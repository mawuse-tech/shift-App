import { createSlice } from "@reduxjs/toolkit";
import { fetchAllShifts } from "./allShiftsThunk";

const fetchAllShiftsSlice = createSlice({
    name: 'fetch shifts',
    initialState: {
        shifts: [],
        error: null,
        loading: false
    },

    reducers: {
        removeShiftLocally: (state, action) => {
            const shiftId = action.payload;

            // Looping through all workers to get access to the shift
            state.shifts = state.shifts.map(worker => ({
                ...worker,
                shifts: worker.shifts.filter(shift => shift.shift_id !== shiftId)
            }))// Remove workers who no longer have any shifts
                // .filter((worker) => worker.shifts.length > 0);
        },
    },

    extraReducers: builder => {
        builder
            .addCase(fetchAllShifts.pending, (state, action) => {
                state.loading = true
            })

            .addCase(fetchAllShifts.fulfilled, (state, action) => {
                state.loading = false;
                state.shifts = action.payload;
            })

            .addCase(fetchAllShifts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})
export const { removeShiftLocally } = fetchAllShiftsSlice.actions;
export default fetchAllShiftsSlice.reducer