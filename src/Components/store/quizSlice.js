import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  allQuizes: [],
  totalPages: 0,
  error: null,
  loading: true,
};

export const getAllQuizes = createAsyncThunk("quiz/allquizes", async (page) => {
  const pageNumber = page || 1;
  try {
    const quizes = await axios.get(
      `https://quiz-backend-production.up.railway.app/quiz?page=${pageNumber}&limit=2`
    );
    return quizes.data;
  } catch (error) {
    return error.message;
  }
});

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllQuizes.fulfilled, (store, action) => {
      if (typeof action.payload === "string") {
        //store.allQuizes = [];
        store.error = action.payload;
        store.loading = false;
        return;
      }
      //console.log("action:", action);
      store.allQuizes = action.payload.currentQuiz;
      store.totalPages = action.payload.totalPages;
      store.loading = false;
    });
  },
});

export default quizSlice.reducer;
