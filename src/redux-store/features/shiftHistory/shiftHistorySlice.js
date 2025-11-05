import { createSlice } from "@reduxjs/toolkit";
import { fetchWorkerHistory } from "./shiftHistoryThunk";

const workerHistorySlice = createSlice({
  name: "workerHistory",
  initialState: {
    selectedWorker: null,
    shifts: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedWorker: (state, action) => {
      state.selectedWorker = action.payload;
    },
    clearWorkerHistory: (state) => {
      state.selectedWorker = null;
      state.shifts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkerHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkerHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedWorker = action.payload.workerId;
        state.shifts = action.payload.shifts;
      })
      .addCase(fetchWorkerHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch shift history";
      });
  },
});

export const { setSelectedWorker, clearWorkerHistory } =
  workerHistorySlice.actions;

export default workerHistorySlice.reducer;