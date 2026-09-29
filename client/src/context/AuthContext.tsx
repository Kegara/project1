import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Snail, BetStats, RaceResult, CardPaymentData, SnailPayResponse } from '../types';
import { db, setCurrentSession, UserRecord } from '../services/db';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isSnailPayOpen: boolean;
  isLoggingIn: boolean;
  snails: Snail[];
  betStats: BetStats;
  raceHistory: RaceResult[];
  setIsSnailPayOpen: (open: boolean) => void;
  login: (email: string, pass: string) => Promise<boolean>;
  commitLogin: () => void;
  register: (firstName: string, lastName: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  deposit: (data: CardPaymentData) => Promise<{ success: boolean; message: string }>;
  refreshStats: () => Promise<void>;
}

const LOCAL_STORAGE_USER_KEY = 'snail_races_user';
const LOCAL_STORAGE_TOKEN_KEY = 'snail_races_token';

const defaultSnails: Snail[] = [
  { id: 's1', name: 'Turbo Shell', color: '#10B981', speedRating: 95, victories: 2 },
  { id: 's2', name: 'Rayo Baboso', color: '#F59E0B', speedRating: 88, victories: 1 },
  { id: 's3', name: 'Flash Gastrópodo', color: '#6366F1', speedRating: 92, victories: 1 },
  { id: 's4', name: 'Speedy Gonzalo', color: '#EC4899', speedRating: 85, victories: 1 },
  { id: 's5', name: 'Caparazón Furia', color: '#8B5CF6', speedRating: 90, victories: 1 },
  { id: 's6', name: 'SnailMan', color: '#06B6D4', speedRating: 82, victories: 0 },
];

const defaultBetStats: BetStats = {
  won: 8,
  lost: 4,
  totalAmountWon: 340,
  totalAmountLost: 120,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  });

  const [isSnailPayOpen, setIsSnailPayOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [snails, setSnails] = useState<Snail[]>(defaultSnails);
  const [betStats, setBetStats] = useState<BetStats>(defaultBetStats);
  const [raceHistory, setRaceHistory] = useState<RaceResult[]>([]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
  }, [user]);

  // Clear session on page unload (beforeunload)
  useEffect(() => {
    const handleBeforeUnload = () => {
      setCurrentSession(null);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const refreshStats = async () => {
    try {
      const res = await fetch('/api/races/stats');
      if (res.ok) {
        const data = await res.json();
        if (data.snails) setSnails(data.snails);
        if (data.betStats) setBetStats(data.betStats);
        if (data.raceHistory) setRaceHistory(data.raceHistory);
      }
    } catch {
      // Fallback local
    }
  };

  useEffect(() => {
    refreshStats();
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    // Check relational LocalStorage DB
    const allUsers = db.readAll<UserRecord>('user');
    const foundUser = allUsers.find(
      (u) => u.email === email && u.password === pass
    );

    if (foundUser) {
      const loggedInUser: User = {
        id: foundUser.idUser,
        firstName: foundUser.name,
        lastName: foundUser.lastName,
        email: foundUser.email,
        balance: foundUser.balance,
      };
      const tkn = `token_${foundUser.idUser}`;
      // Store as pending (Login page will call commitLogin after 3s)
      setPendingUser(loggedInUser);
      setPendingToken(tkn);
      setIsLoggingIn(true);
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, tkn);

      // Create session
      setCurrentSession({
        idSession: crypto.randomUUID(),
        createdDate: new Date().toISOString(),
        browser: navigator.userAgent,
        ip: '127.0.0.1',
      });

      return true;
    }

    // No user found
    return false;
  };

  const commitLogin = () => {
    if (pendingUser) {
      setUser(pendingUser);
      setToken(pendingToken);
      setPendingUser(null);
      setPendingToken(null);
      setIsLoggingIn(false);
    }
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    pass: string
  ): Promise<boolean> => {
    // Check if email already exists in the DB
    const allUsers = db.readAll<UserRecord>('user');
    if (allUsers.some((u) => u.email === email)) {
      return false; // Email already in use
    }

    const userId = crypto.randomUUID();

    // Insert into relational LocalStorage DB
    db.create<UserRecord>('user', {
      idUser: userId,
      name: firstName,
      lastName,
      email,
      password: pass,
      balance: 0,
      createdDate: new Date().toISOString(),
    });

    const newUser: User = {
      id: userId,
      firstName,
      lastName,
      email,
      balance: 0,
    };
    setUser(newUser);
    const tkn = `token_${userId}`;
    setToken(tkn);
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, tkn);

    // Create session
    setCurrentSession({
      idSession: crypto.randomUUID(),
      createdDate: new Date().toISOString(),
      browser: navigator.userAgent,
      ip: '127.0.0.1',
    });

    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    setCurrentSession(null);
  };

  /**
   * Deposit — calls the SnailPay API first, then saves to LocalStorage DB only on success.
   */
  const deposit = async (cardData: CardPaymentData) => {
    if (!user) return { success: false, message: 'Unauthenticated user.' };

    try {
      // 1. Call the SnailPay API
      const res = await fetch('/api/snailpay/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idUser: user.id,
          email: user.email,
          cardNumber: cardData.cardNumber,
          expiry: cardData.expiry,
          cvv: cardData.cvv,
          fullName: cardData.fullName,
          amount: cardData.amount,
        }),
      });

      const apiResponse: SnailPayResponse = await res.json();

      // Create charge record (logs both approved and rejected attempts)
      const chargeId = crypto.randomUUID();
      db.create('charges', {
        idCharge: chargeId,
        idUser: user.id,
        status: apiResponse.status,
        statusDetail: apiResponse.statusDetail,
        transactionAmount: cardData.amount,
        card: cardData.cardNumber.replace(/\s/g, '').slice(-4).padStart(16, '*'),
        cvv: '***',
        authorizationCode: apiResponse.authorizationCode || '',
        reference: apiResponse.reference || '',
        createdDate: new Date().toISOString(),
      });

      // 2. If rejected — do NOT update balance, do NOT create transaction records
      if (!apiResponse.success) {
        return {
          success: false,
          message: apiResponse.statusDetail,
        };
      }

      // 3. SUCCESS — update balance and save to relational LocalStorage DB
      const updatedBalance = parseFloat((user.balance + cardData.amount).toFixed(2));

      // Update user balance in relational DB
      db.update<UserRecord>('user', user.id, { balance: updatedBalance });



      // Create transaction record
      const transactionId = crypto.randomUUID();
      const currencies = db.readAll<any>('currency');
      const usdCurrency = currencies.find((c: any) => c.currency === 'usd');
      db.create('transactions', {
        idTransactions: transactionId,
        idUser: user.id,
        amount: cardData.amount,
        transactionType: 'deposit',
        idCurrency: usdCurrency ? usdCurrency.idCurrency : '1',
        createdDate: new Date().toISOString(),
      });

      // Link transaction to charge
      db.linkTransactionCharge(transactionId, chargeId);

      // Update in-memory user
      const updatedUser = { ...user, balance: updatedBalance };
      setUser(updatedUser);

      return {
        success: true,
        message: `Successful $${cardData.amount} USD top-up. Reference: ${apiResponse.reference}`,
      };
    } catch (err) {
      return {
        success: false,
        message: 'Could not connect to the SnailPay payment gateway. Please try again later.',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isSnailPayOpen,
        isLoggingIn,
        snails,
        betStats,
        raceHistory,
        setIsSnailPayOpen,
        login,
        commitLogin,
        register,
        logout,
        deposit,
        refreshStats,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
