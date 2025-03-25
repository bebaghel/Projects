import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserData } from "../../services/userService";

// Async action to fetch user data
export const getUser = createAsyncThunk("user/fetch", async () => {
    const data = await fetchUserData();
    return data;
});

const userSlice = createSlice({
    name: "user",
    initialState: { user: null, loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUser.pending, (state) => { state.loading = true; })
            .addCase(getUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            });
    },
});

export default userSlice.reducer;
