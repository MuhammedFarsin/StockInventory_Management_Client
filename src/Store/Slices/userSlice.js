import { createSlice } from "@reduxjs/toolkit";

// Initial state definition
const initialState = {
  user: null,  // this ensures `user` is null initially
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Set the user
    setUser: (state, action) => {
      state.user = action.payload;
    },
    // Remove the user
    removeUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
