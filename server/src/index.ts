import express, { Request, Response } from "express";
import cors from "cors";
import { snails, betStats, raceHistory } from "./store";
import { SnailPayChargeRequest, SnailPayChargeResponse } from "./types";

const app = express();

app.use(cors());
app.use(express.json());

// =============================================
// SNAILPAY — Mock Payment Gateway API
// =============================================

// Fixed test card data for a SUCCESSFUL charge
const VALID_CARD = "1234123412341234";
const VALID_EXPIRY = "12/26";
const VALID_CVV = "543";

// Fixed card numbers that trigger specific ERROR scenarios
const ERROR_CARDS: Record<string, { statusDetail: string; errorCode: string }> =
  {
    "4000000000000002": {
      statusDetail:
        "Card declined by the issuing bank. Please contact your bank or try a different card.",
      errorCode: "CARD_DECLINED",
    },
    "4000000000000069": {
      statusDetail:
        "The card has expired. Please use a card with a valid expiration date.",
      errorCode: "CARD_EXPIRED",
    },
    "4000000000000127": {
      statusDetail:
        "CVV verification failed. Please check the security code on the back of your card.",
      errorCode: "INCORRECT_CVV",
    },
    "4000000000009995": {
      statusDetail:
        "Insufficient funds in the account. Please use a different card or add funds.",
      errorCode: "INSUFFICIENT_FUNDS",
    },
  };

/**
 * POST /api/snailpay/charge
 *
 * Mock payment gateway endpoint. Validates card data and returns
 * deterministic results based on fixed test card numbers.
 */
app.post("/snailpay/charge", (req: Request, res: Response) => {
  const { idUser, email, cardNumber, expiry, cvv, fullName, amount } =
    req.body as SnailPayChargeRequest;

  // --- Field validation ---

  if (!idUser || !email) {
    const response: SnailPayChargeResponse = {
      success: false,
      status: "rejected",
      statusDetail: "User identification is required (idUser and email).",
      errorCode: "MISSING_USER_DATA",
    };
    return res.status(400).json(response);
  }

  if (!cardNumber || !expiry || !cvv || !fullName) {
    const response: SnailPayChargeResponse = {
      success: false,
      status: "rejected",
      statusDetail:
        "All card fields are required: card number, expiration date, CVV, and full name.",
      errorCode: "MISSING_CARD_DATA",
    };
    return res.status(400).json(response);
  }

  if (!amount || !Number.isInteger(amount) || amount <= 0) {
    const response: SnailPayChargeResponse = {
      success: false,
      status: "rejected",
      statusDetail: "Amount must be a positive whole number greater than $0.",
      errorCode: "INVALID_AMOUNT",
    };
    return res.status(400).json(response);
  }

  if (amount > 999) {
    const response: SnailPayChargeResponse = {
      success: false,
      status: "rejected",
      statusDetail: "The maximum allowed amount per transaction is $999 USD.",
      errorCode: "AMOUNT_EXCEEDS_LIMIT",
    };
    return res.status(400).json(response);
  }

  // Normalize card number (strip spaces and dashes)
  const cleanCard = cardNumber.replace(/[\s-]/g, "");

  if (cleanCard.length !== 16 || !/^\d{16}$/.test(cleanCard)) {
    const response: SnailPayChargeResponse = {
      success: false,
      status: "rejected",
      statusDetail: "Card number must be exactly 16 digits.",
      errorCode: "INVALID_CARD_FORMAT",
    };
    return res.status(400).json(response);
  }

  // --- Scenario routing ---

  // 1. Check if the card matches a known error scenario
  if (ERROR_CARDS[cleanCard]) {
    const scenario = ERROR_CARDS[cleanCard];
    const response: SnailPayChargeResponse = {
      success: false,
      status: "rejected",
      statusDetail: scenario.statusDetail,
      errorCode: scenario.errorCode,
    };
    return res.status(200).json(response); // Return 200 for logical card issues to prevent console errors
  }

  // 2. Check if it matches the ONLY valid card
  if (
    cleanCard !== VALID_CARD ||
    expiry !== VALID_EXPIRY ||
    cvv !== VALID_CVV
  ) {
    // If the card number is the valid one but expiry/CVV don't match
    if (cleanCard === VALID_CARD && expiry !== VALID_EXPIRY) {
      const response: SnailPayChargeResponse = {
        success: false,
        status: "rejected",
        statusDetail:
          "The expiration date does not match the card on file. Please verify your card details.",
        errorCode: "EXPIRY_MISMATCH",
      };
      return res.status(200).json(response);
    }

    if (cleanCard === VALID_CARD && cvv !== VALID_CVV) {
      const response: SnailPayChargeResponse = {
        success: false,
        status: "rejected",
        statusDetail:
          "The CVV code does not match the card on file. Please check the back of your card.",
        errorCode: "CVV_MISMATCH",
      };
      return res.status(200).json(response);
    }

    // Generic invalid card
    const response: SnailPayChargeResponse = {
      success: false,
      status: "rejected",
      statusDetail:
        "Invalid card data. The transaction could not be processed. Please verify all card details and try again.",
      errorCode: "INVALID_CARD",
    };
    return res.status(200).json(response);
  }

  // 3. SUCCESS — all data matches the valid test card
  const authorizationCode = Math.random()
    .toString(36)
    .substring(2, 10)
    .toUpperCase();
  const reference = `SNAILPAY-${Date.now()}`;

  const response: SnailPayChargeResponse = {
    success: true,
    status: "approved",
    statusDetail: `Payment of $${amount} USD approved successfully.`,
    authorizationCode,
    reference,
    transactionAmount: amount,
  };

  return res.status(200).json(response);
});

// =============================================
// RACES & STATS (unchanged)
// =============================================
app.get("/races/stats", (_req: Request, res: Response) => {
  res.json({
    snails,
    betStats,
    raceHistory,
    totalRacesToday: 6,
  });
});

// =============================================
// Default export for Vercel serverless
// =============================================
export default app;
