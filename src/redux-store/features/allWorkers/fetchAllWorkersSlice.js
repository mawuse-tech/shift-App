import { createSlice } from "@reduxjs/toolkit";
import { fetchAllWorkers } from "./fetchAllWorkersThunk";

const fetchAllWorkersSlice = createSlice({
    name: 'fetch workers',
    initialState: {
        workers: [],
        error: null,
        loading: false
    },
    reducers: {
        removeWorkerLocally: (state, action) => {
            state.workers = state.workers.filter(worker => worker.user_id !== action.payload);
        },
    },

    extraReducers: builder => {
        builder
            .addCase(fetchAllWorkers.pending, (state, action) => {
                state.loading = true
            })

            .addCase(fetchAllWorkers.fulfilled, (state, action) => {
                state.loading = false;
                state.workers = action.payload.workers;
            })

            .addCase(fetchAllWorkers.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export const { removeWorkerLocally } = fetchAllWorkersSlice.actions;
export default fetchAllWorkersSlice.reducer