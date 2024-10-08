import express from "express";
import order_model from "../models/orderModel.js";
import menu_model from "../models/menuModel.js";

const router = express.Router();

// this router is if the "add to checkout" button generates the full order already, in that case, use GET ONE ORDER below

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

// edit an order
router.patch("/edit/:id", async (req, res) => {
    try {
        const {
            id
        } = req.params
        const {
            customerID,
            itemID,
            itemName,
            itemPrice,
            itemQuantity,
            total,
            customerComment,
            orderStatus
        } = req.body
        const order = await order_model.findById(id)
        order.customerID = customerID
        order.itemID = itemID
        order.itemName = itemName
        order.itemPrice = itemPrice
        order.itemQuantity = itemQuantity
        order.total = total
        order.customerComment = customerComment
        order.orderStatus = orderStatus
        
        await order.save()
        res.status(201).json(
            {
                "message": "Order updated!", 
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