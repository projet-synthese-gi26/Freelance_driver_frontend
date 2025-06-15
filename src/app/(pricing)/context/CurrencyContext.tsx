"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';

interface CurrencyContextType {
    currency: string;
    setCurrency: (currency: string) => void;
    convertedAmount: number;
    setConvertedAmount: (amount: number) => void;
    convertAmount: (amount: number) => Promise<number>;
    loading: boolean;
    error: string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState('XOF');
    const [convertedAmount, setConvertedAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const convertAmount = async (amount: number): Promise<number> => {
        if (currency === 'XOF') {
            return amount;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(
                `https://api.exchangerate-api.com/v4/latest/XOF`
            );
            
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des taux de change');
            }

            const data = await response.json();
            const rate = data.rates[currency];
            const result = amount * rate;
            return result;
        } catch (err) {
            setError('Erreur de conversion');
            return amount;
        } finally {
            setLoading(false);
        }
    };

    return (
        <CurrencyContext.Provider 
            value={{ 
                currency, 
                setCurrency, 
                convertedAmount, 
                setConvertedAmount,
                convertAmount,
                loading,
                error 
            }}
        >
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}