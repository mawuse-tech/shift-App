import { configureStore } from "@reduxjs/toolkit";
import registeredUsersReducer from './features/register/registerSlice' 
import loggedInUsersReducer from './features/login/loginSlice'
import loggedInUserDataReducer from './features/loggedInUserData/loggedInUserDataSlice'
import allWorkersReducer from './features/allWorkers/fetchAllWorkersSlice'
import assignShiftReducer from './features/assignShift/assignShitSlice'
import allShiftsDataReducer from './features/allShifts/allShiftsSlice'
import shiftHistoryReducer from './features/shiftHistory/shiftHistorySlice'
export const store = configureStore({
    reducer: {
    registredUsers: registeredUsersReducer,
    loggedInUsers: loggedInUsersReducer,
    loggedInUserData: loggedInUserDataReducer,
    allWorkers: allWorkersReducer,
    assignShiftData: assignShiftReducer,
    allShiftsData: allShiftsDataReducer,
    shiftHistory: shiftHistoryReducer
    }
})