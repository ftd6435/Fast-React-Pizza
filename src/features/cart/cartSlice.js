import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      // payload is a new item object
      state.cart.push(action.payload);
    },
    deleteItem(state, action) {
      // payload is an id of an item
      state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
    },
    increaseItemQuantity(state, action) {
      // payload is an id of an item
      const item = state.cart.find((item) => item.pizzaId === action.payload);
      item.quantity++;
      item.totalPrice = item.quantity * item.unitPrice;
    },
    decreaseItemQuantity(state, action) {
      // payload is an id of an item
      const item = state.cart.find((item) => item.pizzaId === action.payload);
      item.quantity--;
      item.totalPrice = item.quantity * item.unitPrice;

      // Call of a function belongs to the cartSlice using caseReducers (like $this in PHP)
      if(item.quantity === 0) cartSlice.caseReducers.deleteItem(state, action);
    },
    clearCart(state) {
      state.cart = [];
    },
  },
});

export const {
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;

export const getCart = (state) => state.cart.cart;
export const getCartTotalPrice = (state) =>
  state.cart.cart.reduce((sum, curItem) => sum + curItem.totalPrice, 0);
export const getCartTotalQuantity = (state) =>
  state.cart.cart.reduce((sum, curItem) => sum + curItem.quantity, 0);
export const getPizzaQuantity = (id) => (state) =>
  state.cart.cart.find((item) => item.pizzaId === id)?.quantity ?? 0;
