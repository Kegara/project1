export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  balance: number;
}

export interface Snail {
  id: string;
  name: string;
  color: string;
  speedRating: number;
  victories: number;
}

export interface BetStats {
  won: number;
  lost: number;
  totalAmountWon: number;
  totalAmountLost: number;
}

export interface RaceResult {
  id: string;
  raceNumber: number;
  winnerId: string;
  winnerName: string;
  timestamp: string;
}

export interface CardPaymentData {
  cardNumber: string;
  expiry: string;
  cvv: string;
  fullName: string;
  amount: number;
}

export interface SnailPayResponse {
  success: boolean;
  status: 'approved' | 'rejected';
  statusDetail: string;
  authorizationCode?: string;
  reference?: string;
  transactionAmount?: number;
  errorCode?: string;
}
