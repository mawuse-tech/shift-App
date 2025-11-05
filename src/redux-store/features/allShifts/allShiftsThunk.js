import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../config/axios";

// fetching all volunteers
export const fetchAllShifts = createAsyncThunk("all-shifts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/shift/allShifts');
      //  console.log('-------',res.data.data)
      return res.data.data
    } catch (error) {
        console.log(error)
      return rejectWithValue(error.response?.data?.message || "Something went wrong, please try again later");
    }
  }
);