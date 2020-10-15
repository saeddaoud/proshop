import Axios from "axios"
import { CART_ADD_ITEM } from "../constants/cartConstants";

export const addToCart = (id, qty) => async (dispatch, getState) => {//getState gives us access to the whole state
    try {
        const {data} = await Axios.get(`/api/products/${id}`);
        dispatch({
            type: CART_ADD_ITEM,
            payload: {
                productID = data._id,
                name: data.name,
                image: data.image,
                price: data.price,
                countInStock: data.countInStock,
                qty,
            }
        })

        localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
    } catch (error) {
        console.error(error.message)
    }
}