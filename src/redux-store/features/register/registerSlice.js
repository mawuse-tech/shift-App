import { createSlice } from "@reduxjs/toolkit";
import { registerUser } from "./registerThunk";

export const registerSlice = createSlice({
    name: 'register',
    initialState: {
        registeredUsers: [],
        loading: false,
        error: null
    },

    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                console.log(action.payload)
                state.loading = false,
                    state.registeredUsers.push(action.payload)
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload || action.error.message
            })
    }
});

export default registerSlice.reducer

