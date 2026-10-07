import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AnalysisResult, Page, DailyHabit, User } from '../types';
import { INITIAL_ANALYSES } from '../lib/dummyData';
import {
  getCurrentUser,
  loginUser,
  registerUser,
  loginWithGoogle,
  logoutUser,
  getUserHistory,
  saveUserScanHistory,
} from '../lib/auth';

interface SkinSenseContextType {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  currentAnalysis: AnalysisResult;
  setCurrentAnalysis: (analysis: AnalysisResult) => void;
  analyses: AnalysisResult[];
  saveNewAnalysis: (analysis: AnalysisResult) => void;
  habits: DailyHabit;
  toggleHabit: (habitKey: keyof DailyHabit) => void;
  comparisonPair: [AnalysisResult, AnalysisResult];
  setComparisonPairByIds: (idBefore: string, idAfter: string) => void;
  navigateToScan: (analysis: AnalysisResult) => void;

  // Authentication
  user: User | null;
  isAuthLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  loginGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  requireAuth: (targetPage: Page) => boolean;

  // Wishlist for Products
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
}

const STORAGE_KEY_ANALYSES = 'skinsense_analyses_v1';
const STORAGE_KEY_HABITS = 'skinsense_habits_v1';
const STORAGE_KEY_WISHLIST = 'skinsense_wishlist_v1';

const DEFAULT_HABITS: DailyHabit = {
  waterIntake: true,
  sunProtection: true,
  restfulSleep: false,
  eveningCleanse: true,
};

const SkinSenseContext = createContext<SkinSenseContextType | undefined>(undefined);

export const SkinSenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPageRaw] = useState<Page>('home');
  const [pendingRedirectPage, setPendingRedirectPage] = useState<Page | null>(null);

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Load saved analyses safely
  const [analyses, setAnalyses] = useState<AnalysisResult[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ANALYSES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Could not read saved analyses from localStorage', err);
    }
    return INITIAL_ANALYSES;
  });

  // Current analysis in view
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult>(() => {
    return analyses[0] || INITIAL_ANALYSES[0];
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_WISHLIST);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Daily habits
  const [habits, setHabits] = useState<DailyHabit>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_HABITS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.warn('Could not read habits from localStorage', err);
    }
    return DEFAULT_HABITS;
  });

  // Comparison pair for progress before/after
  const [comparisonPair, setComparisonPair] = useState<[AnalysisResult, AnalysisResult]>(() => {
    const after = analyses[0] || INITIAL_ANALYSES[0];
    const before = analyses[1] || analyses[0] || INITIAL_ANALYSES[1] || INITIAL_ANALYSES[0];
    return [before, after];
  });

  // Restore authenticated session on mount
  useEffect(() => {
    let isMounted = true;
    getCurrentUser()
      .then(async (currentUser) => {
        if (!isMounted) return;
        if (currentUser) {
          setUser(currentUser);
          try {
            const serverHistory = await getUserHistory();
            if (serverHistory && serverHistory.length > 0) {
              setAnalyses(serverHistory);
              setCurrentAnalysis(serverHistory[0]);
            }
          } catch {
            // fallback to local storage
          }
        }
      })
      .finally(() => {
        if (isMounted) setIsAuthLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  // Safe wrapper for changing page with smooth scroll
  const setCurrentPage = (page: Page) => {
    // Route protection: analyze, diet, and products require authentication
    const protectedPages: Page[] = ['analyze', 'diet', 'products'];
    if (protectedPages.includes(page) && !user) {
      setPendingRedirectPage(page);
      setCurrentPageRaw('login');
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        window.scrollTo(0, 0);
      }
      return;
    }

    setCurrentPageRaw(page);
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      window.scrollTo(0, 0);
    }
  };

  const requireAuth = (targetPage: Page): boolean => {
    if (!user) {
      setPendingRedirectPage(targetPage);
      setCurrentPageRaw('login');
      return false;
    }
    return true;
  };

  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    setIsAuthLoading(true);
    setAuthError(null);
    const res = await loginUser(email, password, rememberMe);
    setIsAuthLoading(false);

    if (res.success && res.user) {
      setUser(res.user);
      // Fetch server history for this user
      try {
        const hist = await getUserHistory();
        if (hist.length > 0) {
          setAnalyses(hist);
          setCurrentAnalysis(hist[0]);
        }
      } catch {
        // ignore
      }
      const target = pendingRedirectPage || 'home';
      setPendingRedirectPage(null);
      setCurrentPageRaw(target);
      return true;
    } else {
      setAuthError(res.error || 'Invalid credentials');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsAuthLoading(true);
    setAuthError(null);
    const res = await registerUser(name, email, password);
    setIsAuthLoading(false);

    if (res.success && res.user) {
      setUser(res.user);
      const target = pendingRedirectPage || 'home';
      setPendingRedirectPage(null);
      setCurrentPageRaw(target);
      return true;
    } else {
      setAuthError(res.error || 'Registration failed');
      return false;
    }
  };

  const loginGoogle = async (): Promise<boolean> => {
    setIsAuthLoading(true);
    setAuthError(null);
    const res = await loginWithGoogle();
    setIsAuthLoading(false);

    if (res.success && res.user) {
      setUser(res.user);
      const target = pendingRedirectPage || 'home';
      setPendingRedirectPage(null);
      setCurrentPageRaw(target);
      return true;
    } else {
      setAuthError(res.error || 'Google authentication failed');
      return false;
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setCurrentPageRaw('home');
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const next = prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId];
      try {
        localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const saveNewAnalysis = (newAnalysis: AnalysisResult) => {
    setAnalyses((prev) => {
      const updated = [newAnalysis, ...prev.filter((a) => a.id !== newAnalysis.id)];
      try {
        localStorage.setItem(STORAGE_KEY_ANALYSES, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save analysis to localStorage', err);
      }
      return updated;
    });
    setCurrentAnalysis(newAnalysis);

    // Save to user account if authenticated
    if (user) {
      saveUserScanHistory(newAnalysis).catch(() => {});
    }
  };

  const toggleHabit = (habitKey: keyof DailyHabit) => {
    setHabits((prev) => {
      const updated = { ...prev, [habitKey]: !prev[habitKey] };
      try {
        localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save habits to localStorage', err);
      }
      return updated;
    });
  };

  const setComparisonPairByIds = (idBefore: string, idAfter: string) => {
    const before = analyses.find((a) => a.id === idBefore) || analyses[1] || analyses[0];
    const after = analyses.find((a) => a.id === idAfter) || analyses[0];
    setComparisonPair([before, after]);
  };

  const navigateToScan = (analysis: AnalysisResult) => {
    setCurrentAnalysis(analysis);
    setCurrentPage('results');
  };

  return (
    <SkinSenseContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        currentAnalysis,
        setCurrentAnalysis,
        analyses,
        saveNewAnalysis,
        habits,
        toggleHabit,
        comparisonPair,
        setComparisonPairByIds,
        navigateToScan,
        user,
        isAuthLoading,
        authError,
        clearAuthError,
        login,
        register,
        loginGoogle,
        logout,
        requireAuth,
        wishlist,
        toggleWishlist,
      }}
    >
      {children}
    </SkinSenseContext.Provider>
  );
};

export const useSkinSense = () => {
  const context = useContext(SkinSenseContext);
  if (!context) {
    throw new Error('useSkinSense must be used within a SkinSenseProvider');
  }
  return context;
};
