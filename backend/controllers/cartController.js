import User from "../models/User.js"

export const getCart=async(req,res)=>{
    try {
        const user= await User.findById(req.userId).select("cart")
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        res.status(200).json({success:true,cart:user.cart})
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Server error fetching cart' })
    }
}

export const updateCart=async(req,res)=>{
    
    const {productId,image,quantity,name,price}=req.body;
    
    if(!name||!quantity||!productId||!price){
       
        return res.status(400).json({ message: 'Product ID, quantity, name, and price are required' })
    }
    try {
        
        if (req.userId) {
            let user = await User.findById(req.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const existingItemIndex = user.cart.findIndex(
                (item) => item.productId.toString() === productId
            );
            if (existingItemIndex > -1) {
                // Update existing item quantity
                user.cart[existingItemIndex].quantity = quantity;
                user.cart[existingItemIndex].name = name;
                user.cart[existingItemIndex].price = price;
                user.cart[existingItemIndex].image = image;

                // Remove item if quantity is 0 or less
                if (user.cart[existingItemIndex].quantity <= 0) {
                    user.cart.splice(existingItemIndex, 1);
                }
            }
            else {
                // Add new item to cart
                if (quantity > 0) { 
                    user.cart.push({ productId, quantity, name, price, image });
                }
            }
            await user.save();
            return res.status(200).json({ success: true, cart: user.cart, message: 'Cart updated successfully' });
        }
        
        else{
            return res.status(200).json({
                success: true,
                message: 'Item added to guest cart locally (not persisted on server yet)',
                itemAdded: { productId, quantity, name, price, image }
            });
        }

    } catch (error) {
       
        res.status(500).json({ message: 'Server error updating cart' })
    }
}

export const mergeGuestCart = async (req, res) => {
    const { guestItems } = req.body; // Expects an array of cart items from the frontend's localStorage
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized: Please log in to merge your cart." });
    }

    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        guestItems.forEach(guestItem => {
            const existingItemIndex = user.cart.findIndex(
                (cartItem) => cartItem.productId.toString() === guestItem.productId
            );

            if (existingItemIndex > -1) {
                // Item exists, update its quantity by adding guest item quantity
                user.cart[existingItemIndex].quantity += guestItem.quantity;
            } else {
                // Item does not exist, add it to the user's cart
                user.cart.push({
                    productId: guestItem.productId,
                    quantity: guestItem.quantity,
                    name: guestItem.name,
                    price: guestItem.price,
                    image: guestItem.image,
                });
            }
        });

        await user.save();
        return res.status(200).json({ success: true, cart: user.cart, message: 'Cart merged successfully' });

    } catch (error) {
        console.error('Error merging guest cart:', error);
        return res.status(500).json({ message: 'Server error merging cart' });
    }
};

export const removeItemFromCart=async(req,res)=>{
    const {productId}=req.params;
    try {
        const user= await User.findById(req.userId);
        if(!user){
            return res.status(404).json({ message: 'User not found' })
        }
        user.cart=user.cart.filter((item)=>item.productId.toString()!==productId)
        await user.save();
        res.status(200).json({ success: true, cart: user.cart, message: 'Item removed from cart' });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Server error removing item from cart' });
    }
}

export const clearUserCart = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.cart = []; 
        await user.save();
        res.status(200).json({ success: true, message: 'Cart cleared successfully' });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ message: 'Server error clearing cart' });
    }
};