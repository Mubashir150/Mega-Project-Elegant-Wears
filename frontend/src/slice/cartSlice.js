// src/slice/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api/cart";
const GUEST_CART_KEY = "guestCart"; // Key for localStorage


const getLocalCart = () => {
    try {
        const serializedCart = localStorage.getItem(GUEST_CART_KEY);
        if (serializedCart === null) {
            return [];
        }
        return JSON.parse(serializedCart);
    } catch (error) {
        console.error("Failed to load cart from local storage:", error);
        return [];
    }
};

const saveLocalCart = (cartItems) => {
    try {
        const serializedCart = JSON.stringify(cartItems);
        localStorage.setItem(GUEST_CART_KEY, serializedCart);
    } catch (error) {
        console.error("Failed to save cart to local storage:", error);
    }
};



// Fetches the cart for both logged-in and guest users
export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue, getState }) => {
    try {
        const state = getState();
        const isAuthenticated = state.auth.user;

        if (isAuthenticated) {
            // Logged-in user: Fetch from backend first
            const response = await axios.get(API_URL, { withCredentials: true });
            return response.data.cart; 
        } else {
            // Guest user: Fetch from local storage
            return getLocalCart();
        }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
});

// Merges the localStorage cart with the backend cart upon login
export const mergeLocalCartWithBackend = createAsyncThunk(
    "cart/mergeLocalCartWithBackend",
    async (_, { getState, rejectWithValue }) => {
        try {
            const localCart = getLocalCart();
            // Only proceed if there are items in the local guest cart
            if (localCart.length === 0) {
                return getState().cart.items;
            }

            // Send local cart items to the new backend merge endpoint
            const response = await axios.post(
                `${API_URL}/merge-guest-cart`,
                { guestItems: localCart },
                { withCredentials: true }
            );

            localStorage.removeItem(GUEST_CART_KEY); 
            return response.data.cart; // Return the merged cart from backend
        } catch (error) {
            console.error("Error during mergeLocalCartWithBackend:", error);
            return rejectWithValue(error.response?.data?.message || 'Failed to merge local cart');
        }
    }
);


export const addToCart = createAsyncThunk("cart/addToCart", async (item, { getState, rejectWithValue }) => {
    const state = getState();
    const isAuthenticated = state.auth.user; 

    
    const productMongoId = item._id || item.productId;
    const currentCartItems = isAuthenticated ? state.cart.items : getLocalCart();
    const existingCartItem = currentCartItems.find((cartItem) => cartItem.productId === item.productId);

    let newQuantity;
    if (existingCartItem) {
        newQuantity = existingCartItem.quantity + (item.quantity || 1); 
    } else {
        newQuantity = item.quantity || 1; 
    }

    const itemPayload = {
        productId: productMongoId,
        image: item.image,
        name: item.name,
        price: item.price,
        quantity: newQuantity,
    };

    try {
        if (isAuthenticated) {
            
            const response = await axios.post(API_URL, itemPayload, { withCredentials: true });
            return response.data.cart; 
        } else {
            // Guest user: Update local storage and return updated local cart for Redux state
            const updatedLocalCart = [...currentCartItems];
            const existingLocalItemIndex = updatedLocalCart.findIndex((cartItem) => cartItem.productId === item.productId);

            if (existingLocalItemIndex !== -1) {
                updatedLocalCart[existingLocalItemIndex] = { ...updatedLocalCart[existingLocalItemIndex], quantity: newQuantity };
            } else {
                updatedLocalCart.push({ ...itemPayload }); // Add new item with its calculated quantity
            }

            saveLocalCart(updatedLocalCart);
            return updatedLocalCart; // Return the locally updated cart for Redux state
        }
    } catch (error) {
        console.error("Error during addToCart:", error);
        return rejectWithValue(error.response?.data?.message || 'Failed to add item to cart');
    }
});

export const removeFromCart = createAsyncThunk("cart/removeFromCart", async (productId, { getState, rejectWithValue }) => {
    const state = getState();
    const isAuthenticated = state.auth.user;

    try {
        if (isAuthenticated) {
            await axios.delete(`${API_URL}/${productId}`, { withCredentials: true });
            return productId; // Return productId for filtering from Redux state
        } else {
            // Guest user: Update local storage and return productId
            const localCart = getLocalCart();
            const updatedLocalCart = localCart.filter(item => item.productId !== productId);
            saveLocalCart(updatedLocalCart);
            return productId; 
        }
    } catch (error) {
        console.error("Error during removeFromCart:", error);
        return rejectWithValue(error.response?.data?.message || 'Failed to remove item from cart');
    }
});

export const updateCartQuantity = createAsyncThunk("cart/updateCartQuantity", async ({ productId, image, name, quantity, price }, { getState, rejectWithValue }) => {
    const state = getState();
    const isAuthenticated = state.auth.user;

    const itemPayload = { productId, price, image, quantity, name };

    try {
        if (isAuthenticated) {
            const response = await axios.post(API_URL, itemPayload, { withCredentials: true });
            return response.data.cart; // Backend returns the updated full cart
        } else {
            // Guest user: Update local storage and return updated local cart
            const localCart = getLocalCart();
            const updatedLocalCart = localCart.map(item =>
                item.productId === productId ? { ...item, quantity: quantity } : item
            ).filter(item => item.quantity > 0); // Remove if quantity drops to 0 or less
            saveLocalCart(updatedLocalCart);
            return updatedLocalCart; // Return the locally updated cart for Redux state
        }
    } catch (error) {
        console.error("Error during updateCartQuantity:", error);
        return rejectWithValue(error.response?.data?.message || 'Failed to update item quantity');
    }
});

export const clearCart = createAsyncThunk("cart/clearCart", async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const isAuthenticated = state.auth.user;

    try {
        if (isAuthenticated) {
            await axios.delete(API_URL, { withCredentials: true });
        } else {
            localStorage.removeItem(GUEST_CART_KEY);
        }
        return true;
    } catch (error) {
        console.error("Error during clearCart:", error);
        return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
});


const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: getLocalCart(), 
        status: "idle",
        error: null,
        isDrawerOpen: false,
    },
    reducers: {
        clearCartLocal: (state) => {
            state.items = [];
            localStorage.removeItem(GUEST_CART_KEY); 
        },
        openCartDrawer: (state) => {
            state.isDrawerOpen = true;
        },
        closeCartDrawer: (state) => {
            state.isDrawerOpen = false;
        },
        toggleCartDrawer: (state) => {
            state.isDrawerOpen = !state.isDrawerOpen;
        },
    },
    extraReducers: (builder) => {
        builder
            
            .addCase(fetchCart.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload; 
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
                state.items = getLocalCart(); 
            })

            // addToCart
            .addCase(addToCart.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload; 
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // removeFromCart
            .addCase(removeFromCart.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.status = "succeeded";
                // action.payload is the productId. 
                state.items = state.items.filter(item => item.productId !== action.payload);
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // updateCartQuantity
            .addCase(updateCartQuantity.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(updateCartQuantity.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload; 
            })
            .addCase(updateCartQuantity.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // clearCart (backend/local)
            .addCase(clearCart.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.status = "succeeded";
                state.items = []; 
                localStorage.removeItem(GUEST_CART_KEY); 
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // mergeLocalCartWithBackend (NEW)
            .addCase(mergeLocalCartWithBackend.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(mergeLocalCartWithBackend.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload; 
                localStorage.removeItem(GUEST_CART_KEY); 
            })
            .addCase(mergeLocalCartWithBackend.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export const { openCartDrawer, closeCartDrawer, toggleCartDrawer, clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;