import { createSlice } from "@reduxjs/toolkit"
import { loggedInUserData } from "./loggedInUserThunkData"

export const loggedInUserDataSlice = createSlice({
    name: 'user data',
    initialState: {
        user: null,
        loading: true,
        error: null
    },

     reducers: {
        updatedUserData: (state, action) => {
             //Keep all the old user data, but update or add any new fields from the payload.
            state.user = { ...state.user, ...action.payload }
         }
    },

    extraReducers: (builder) => {
        builder
            .addCase(loggedInUserData.pending, (state) => {
                state.loading = true
            })
            .addCase(loggedInUserData.fulfilled, (state, action) => {
                // console.log(action.payload)
                state.loading = false,
                    state.user = action.payload?.loggedInuserData
            })
            .addCase(loggedInUserData.rejected, (state, action) => {
                state.loading = false,
                    state.user = null
                state.error = action.payload || action.error.message
            })
    }
})

 export const { updatedUserData } = loggedInUserDataSlice.actions
export default loggedInUserDataSlice.reducer