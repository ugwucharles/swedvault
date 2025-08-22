import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAccounts } from '../services/accountService';

interface Account {
    id: string;
    type: string;
    balance: number;
}

interface AccountContextType {
    accounts: Account[];
    loading: boolean;
    error: string | null;
    refreshAccounts: () => Promise<void>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshAccounts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAccounts();
            setAccounts(data);
        } catch (err) {
            setError('Failed to fetch accounts');
            console.error('Error fetching accounts:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshAccounts();
    }, []);

    return (
        <AccountContext.Provider value={{ accounts, loading, error, refreshAccounts }}>
            {children}
        </AccountContext.Provider>
    );
};

export const useAccounts = () => {
    const context = useContext(AccountContext);
    if (context === undefined) {
        throw new Error('useAccounts must be used within an AccountProvider');
    }
    return context;
};

export default AccountContext;
