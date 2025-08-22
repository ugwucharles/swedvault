import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL as string;

export interface TransferData {
    fromAccount: string;
    toAccount: string;
    amount: number;
    memo?: string;
}

export const getAccounts = async () => {
    const response = await axios.get(`${API_BASE_URL}/accounts`);
    return response.data;
};

export const transferMoney = async (transferData: TransferData) => {
    const response = await axios.post(`${API_BASE_URL}/transfers`, transferData);
    return response.data;
};
