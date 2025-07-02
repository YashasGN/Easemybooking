import { createAsyncThunk } from "@reduxjs/toolkit";
import { createTransaction,getTransactionByUserId,getAllTransactions} from "../../services/transaction.service";

export const createTransactionThunk = createAsyncThunk('createTransaction', async (transactionData) => {
    try {
        const response = await createTransaction(transactionData);
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
});

export const getTransactionByUserIdThunk = createAsyncThunk('getTransactionByUserId', async (userId) => {
    try {
        const response = await getTransactionByUserId(userId);
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
});


export const getAllTransactionsThunk = createAsyncThunk('getAllTransactions', async () => {
    try {
        const response = await getAllTransactions();
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
});
    