import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserResponse as User } from '@/types/response.type'

// Define the state type for the auth slice
type AuthState = {
    user: User | null
}
// Define the initial state for the auth slice
const initialState: AuthState = {
    user: null,
}
// Create the auth slice using createSlice function from Redux toolkit
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth(state, action: PayloadAction<User>) {
            state.user = action.payload
        },
        clearAuth(state) {
            state.user = null
        },
    },
})

export const { setAuth, clearAuth } = authSlice.actions
export default authSlice.reducer
