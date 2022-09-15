import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

let token;
if (Cookies.get("QuizUser")) {
  token = JSON.parse(Cookies.get("QuizUser"));
}

const initialState = {
  token: token || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addToken: (state, action) => {
      state.token = action.payload;
    },
    removeToken: (state) => {
      state.token = null;
    },
  },
});

export const { addToken, removeToken } = userSlice.actions;

export default userSlice.reducer;
