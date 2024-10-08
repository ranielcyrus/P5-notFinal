import express from "express";
import order_model from "../models/orderModel.js";
import { authProtectRoute } from '../middlewares/authProtect.js';

const router = express.Router();

// Apply the middleware to protect routes that require authentication
router.use(authProtectRoute);

// get ALL orders
router.get("/", async (req, res) => {
    try {
        const orderItems = await order_model.find({
            customerID: req.customer._id, // Filter orders by the authenticated customer
            _status: "active"
        })
        res.status(200).json(
            {
                data: orderItems
            }
        )
    } catch (error) {
        res.status(500).json(
            {
                "message": error.message
            }
        )
    }
})

// get ONE order
router.get("/:id", async (req, res) => {
    try {
        const {
            id
        } = req.params
        const order = await order_model.findById(id)
        res.status(200).json(
            {
                data: order
            }
        )
    } catch (error) {
        res.status(500).json(
            {
                "message": error.message
            }
        )
    }
})

// delete order
router.delete("/delete/:id", async (req, res) => {
    try {
        const {
            id
        } = req.params
        const order = await order_model.findByIdAndUpdate(id, {

            _status: "deleted"

        }, {
            new: true
        })
        await order.save()
        res.status(200).json(
            {
                "message": "Order deleted!", 
                data: order
            }
        )
    } catch (error) {
        res.status(400).json(
            {
                "message": error.message
            }
        )
    }
    })


export default router;