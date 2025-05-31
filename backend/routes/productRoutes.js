
import express from "express";
import Products from "../models/Products.js"
import Order from "../models/Order.js";
import { sendOrderConfirmationEmail } from "../ethereal/emails.js";
const router=express.Router();


router.get("/products",async(req,res)=>{
    try {
        const products= await Products.find();
        return res.status(201).json(products)

    } catch (error) {
        return res.status(500).json({msg:"Error occured while getting products"})
    }
})

router.get("/products/:category",async (req,res)=>{
    try {
        const category=req.params.category;
        const {sort}=req.query;
        let productsQuery=Products.find({category:category})
        if(sort==="price_asc"){
            productsQuery=productsQuery.sort({price:1})
        }
        else if (sort === 'price_des') {
            productsQuery = productsQuery.sort({ price: -1 });
        }
        const products=await productsQuery.exec()
        if (!products || products.length === 0) { 
            return res.status(404).json({ msg: "No products of this category found." });
        }

        return res.status(200).json(products);
        
    } catch (error) {
        return res.status(500).json({msg:"Error occured while getting products"})
    }
})

router.get("/products/:category/:id",async(req,res)=>{
    try {
        const id=req.params.id;
        const response= await Products.findById(id);
        if(!response){
            return res.status(400).json({msg:"Product not found"})
        }
        
        return res.status(200).json(response);
        
    } catch (error) {
        return res.status(500).json({msg:"Error occured while getting products"})
    }
})
router.post("/products/checkout", async (req,res)=>{
    try {
        const {name,address,phone,email,cartItems,paymentMethod,paymentToken, discountCode}=req.body;
        if(!name||!address||!phone||!email||!cartItems||cartItems.length===0||!paymentMethod){
            return res.status(400).json({msg:"Please provide all required order details."})
        }

        if(!["COD","Card"].includes(paymentMethod)){
            return res.status(400).json({ msg: 'Invalid payment method selected.' })
        }

        let transactionId=null;
        let paymentStatus="pending";
        if(paymentMethod==="Card"){
            if(!paymentToken){
                return res.status(400).json({ msg: 'Payment token is required for card payments.' })
            }
            try {
                transactionId=`mock_card_txn_${Date.now()}`;
                paymentStatus="paid"
            } catch (paymentError) {
                console.error('Payment Gateway Error:', paymentError);
                return res.status(400).json({ msg: 'Payment processing failed. Please try again.', error: paymentError.message })
            }
        }
        //Security
        const orderItems=[];
        let subtotalAmount=0
        for(const cartItem of cartItems){
            const product=await Products.findById(cartItem.productId);
            if(!product){
                return res.status(404).json({ msg: `Product with ID ${cartItem.productId} not found.` })
            }
            if(cartItem.quantity<=0){
                return res.status(400).json({ msg: `Invalid quantity for product ${product.name}.` })
            }
            orderItems.push({
                productId:product._id,
                name:product.name,
                quantity:cartItem.quantity,
                price:product.price
            })
            subtotalAmount += product.price * cartItem.quantity
        }

        let finalTotalAmount = subtotalAmount;
        let discountPercentage = 0;
        let discountApplied = false;

        if(discountCode){
            if(discountCode==="E15"){
                discountPercentage=0.15;
                discountApplied=true
            }
        }
        if(discountApplied&& discountPercentage>0){
            finalTotalAmount=subtotalAmount*(1-discountPercentage);
            console.log(`Backend: Discount applied. Subtotal: ${subtotalAmount}, Final Total: ${finalTotalAmount}`);
        }
        else {
            console.log(`Backend: No discount applied. Final Total: ${finalTotalAmount}`);
        }

        const newOrder= new Order({
            name,
            address,
            phone,
            email,
            items: orderItems,
            totalAmount:finalTotalAmount.toFixed(2),
            paymentMethod,
            transactionId,
            paymentStatus,
            orderStatus:"pending"
        })
        const createdOrder=await newOrder.save();
        
        await sendOrderConfirmationEmail(
                createdOrder.email,
                createdOrder.name,
                {
                    _id: createdOrder._id,
                    items: createdOrder.items,
                    totalAmount: createdOrder.totalAmount
                }
        )
        
        console.log("Order confirmation email sent successfully!");

        res.status(201).json({ msg: 'Order placed successfully!', order: newOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error placing order.' });
    }
});

router.post("/products/add",async (req, res) => {
    try {
        const { name, price, description, imageUrl, category, stock } = req.body;
        
        const product = new Products({
            name,
            price,
            description,
            imageUrl, 
            category,
            stock
        });

        await product.save();
        res.status(201).json({ message: "Product added successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Failed to add product", error });
    }
})

export default router;