import { configureStore } from "@reduxjs/toolkit";
import quizSlice from "./quizSlice";
import UserSlice from "./UserSlice";

export const store = configureStore({
  reducer: {
    user: UserSlice,
    quiz: quizSlice,
  },
});
