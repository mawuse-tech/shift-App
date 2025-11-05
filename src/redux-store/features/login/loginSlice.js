import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "./loginThunk";

export const loginSlice = createSlice({
    name: 'login',
    initialState: {
        user: null,
        loading: false,
        error: null
    },

    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                console.log(action.payload)
                state.loading = false,
                    state.user = action.payload
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload || action.error.message
            })
    }
});

export default loginSlice.reducer