import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../config/axios";

export const loggedInUserData = createAsyncThunk("user data",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const res = await api.get('/auth/userData');
      //  console.log('logged in user data',res.data.loggedInuserData)
      return fulfillWithValue(res.data);
    } catch (error) {
      console.log(error)
      return rejectWithValue(error.response?.data?.message || "Failed to check login");
    }
  }
);
