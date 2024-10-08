import express from "express";
import order_model from "../models/orderModel.js";
import menu_model from "../models/menuModel.js";

const router = express.Router();

// create orders
router.post("/create", async (req, res) => {
    try {
        const {
            customerID,
            itemID,
            itemQuantity,
            customerComment,
            orderStatus,
        } = req.body;

        const item = await menu_model.findById(itemID);

        if (!item) {
            return res.status(404).json({ message: "Item not found." });
        }

        const newOrder = new order_model({
            customerID: customerID,
            itemID: itemID,
            itemName: item.itemName,
            itemPrice: item.itemPrice,
            itemQuantity: itemQuantity,
            customerComment: customerComment,
        });

        await newOrder.save();

        res.status(201).json({
            message: "Order Created!",
            data: newOrder
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
// get ALL orders
router.get("/", async (req, res) => {
    try {
        const orderItems = await order_model.find({
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
        } = req.body
        const order = await order_model.findById(id)
        order.customerID = customerID
        order.itemID = itemID
        order.itemName = itemName
        order.itemPrice = itemPrice
        order.itemQuantity = itemQuantity
        order.total = total
        order.customerComment = customerComment
        
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