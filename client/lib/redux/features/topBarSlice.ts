import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TopBarState {
  isOpen: boolean;
}

const initialState: TopBarState = {
  isOpen: true,
};

export const topBarSlice = createSlice({
  name: 'topBar',
  initialState,
  reducers: {
    toggle: (state) => {
      state.isOpen = !state.isOpen;
    },
    close: (state) => {
      state.isOpen = false;
    },
    open: (state) => {
      state.isOpen = true;
    },
    setIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const { toggle, close, open, setIsOpen } = topBarSlice.actions;

export default topBarSlice.reducer;
