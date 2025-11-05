import { createSlice } from "@reduxjs/toolkit";
import { assignShift } from "./assignShiftThunk";

const shiftSlice = createSlice({
    name: "shift",
    initialState: {
        shifts: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            // Assign shift
            .addCase(assignShift.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(assignShift.fulfilled, (state, action) => {
                state.loading = false;
                state.shifts.push(...action.payload.createdShifts);
            })
            .addCase(assignShift.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export default shiftSlice.reducer;