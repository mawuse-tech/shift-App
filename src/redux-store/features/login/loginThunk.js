import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../config/axios";

export const loginUser = createAsyncThunk("/auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      // console.log('this is logged in user:', response.data)
      return response.data

    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed, please try again"
      );

    }
  }
);