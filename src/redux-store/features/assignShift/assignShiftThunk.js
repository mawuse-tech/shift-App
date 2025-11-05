import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../config/axios";

export const assignShift = createAsyncThunk(
  "shift/assignShift",
  async (shiftData, { rejectWithValue }) => {
    try {
      const response = await api.post('/shift', shiftData)
      console.log('--------==',response.data)
      return response.data;
    } catch (error) {
         console.log(error)
      return rejectWithValue(
        error.response?.data?.message || "Failed to assign shift"
      );
    }
  }
);