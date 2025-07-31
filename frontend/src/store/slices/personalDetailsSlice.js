import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  age: '',
  location: '',
  occupation: '',
  email: '',
  phone: '',
  hobbies: [],
  interests: [],

  customDetails: {} 
};

const personalDetailsSlice = createSlice({
  name: 'personalDetails',
  initialState,
  reducers: {
    setPersonalDetail: (state, action) => {
      const { field, value } = action.payload;
      if (field in state) {
        state[field] = value;
      } else {
        state.customDetails[field] = value;
      }
    },
    setMultipleDetails: (state, action) => {
      const details = action.payload;
      Object.keys(details).forEach(key => {
        if (key in state) {
          state[key] = details[key];
        } else {
          state.customDetails[key] = details[key];
        }
      });
    },
    addToArray: (state, action) => {
      const { field, value } = action.payload;
      if (Array.isArray(state[field])) {
        if (!state[field].includes(value)) {
          state[field].push(value);
        }
      }
    },
    removeFromArray: (state, action) => {
      const { field, value } = action.payload;
      if (Array.isArray(state[field])) {
        state[field] = state[field].filter(item => item !== value);
      }
    },
    clearPersonalDetails: (state) => {
      return initialState;
    }
  },
});

export const { 
  setPersonalDetail, 
  setMultipleDetails, 
  addToArray, 
  removeFromArray, 
  clearPersonalDetails 
} = personalDetailsSlice.actions;

export default personalDetailsSlice.reducer;