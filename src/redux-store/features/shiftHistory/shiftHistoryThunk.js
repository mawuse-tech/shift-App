import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../config/axios";

export const fetchWorkerHistory = createAsyncThunk(
  "workerHistory/fetchWorkerHistory",
  async (workerId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/shift/history/${workerId}`);
      console.log('-----', res)
      const sorted = res.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      return { workerId, shifts: sorted };
    } catch (error) {
      console.error("Error fetching worker history:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);