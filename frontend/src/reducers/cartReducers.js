import { CART_ADD_ITEM } from '../constants/cartConstants';

export const cartReducer = (state = { cartItems: [] }, action) => {
  const { type, payload } = action;
  switch (type) {
    case CART_ADD_ITEM:
      const existItem = state.cartItems.find(
        (item) => item.productID === payload.productID
      );

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item.productID === payload.productID ? payload : item
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, payload],
        };
      }
    default:
      return state;
  }
};
