import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../config/axios";

// fetching all volunteers
export const fetchAllWorkers = createAsyncThunk("all-workers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/worker/allWorkers');
      //  console.log('-------',res.data.workers)
      return res.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong, please try again later");
    }
  }
);