import { createSlice } from "@reduxjs/toolkit";
import word from "../data.json"

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const speedSlice = createSlice({
  name: 'typingSpeed',
  initialState: {
    word: shuffleArray(word.words),
    time: 60,
    keyCount: 0,
    dks: 0,
    correct: 0,
    false: 0,
    wordStatus: [],
  },
  reducers: {
    calculateDks: (state) => {
      return {
        ...state,
        dks: state.keyCount / 5,
      };
    },
    incrementKeyCount: (state, action) => {
      const i = action.payload;
      return {
        ...state,
        keyCount: state.keyCount + i,
      };
    },
    decrementTime: (state) => {
      return {
        ...state,
        time: state.time - 1,
      };
    },
    resetTime: (state) => {
      return {
        ...state,
        word: shuffleArray([...word.words]),
        time: 60,
        wordStatus: [],
        correct: 0,
        false: 0,
        keyCount: 0,
        dks:0,
      };
    },
    correctWord: (state, action) => {
      if (state.time > 0) {
        const i = action.payload;
        const newWordStatus = [...state.wordStatus];
        newWordStatus[i] = "success";
        return {
          ...state,
          correct: state.correct + 1,
          wordStatus: newWordStatus,
        }
      }
    },
    wrongWord: (state, action) => {
      if (state.time > 0) {
      const i = action.payload;
      const newWordStatus = [...state.wordStatus];
      newWordStatus[i] = "danger";
      return {
        ...state,
        false: state.false + 1,
        wordStatus: newWordStatus,
      }
    }},
  },
})

export const { decrementTime, incrementKeyCount, correctWord, wrongWord, resetTime, calculateDks } = speedSlice.actions;
export default speedSlice.reducer;