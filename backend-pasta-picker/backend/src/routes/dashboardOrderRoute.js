import express from "express";
import order_model from "../models/orderModel.js";
import menu_model from "../models/menuModel.js";
import { authProtectRoute } from "../middlewares/authProtect.js";

const router = express.Router();

// Apply the middleware to protect routes that require authentication
router.use(authProtectRoute);

// create orders - For admin/kitchen crew use only - for order creation IF manually creating one
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
            orderStatus: orderStatus
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

// get ALL orders - Applicable to admin and kitchen crew users
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

// get ONE order - Applicable to admin, kitchen crew, and rider users only
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

// edit order - applicable to admin and kitchen crew users if there's a need to edit manually or update orderStatus only
router.patch('/edit/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get the order ID from params
        const { customerID, itemOrder, customerComment, orderStatus } = req.body; // Destructure from request body

        // Fetch the existing order from the database
        const order = await order_model.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        // Update the customer ID if provided
        if (customerID) {
            order.customerID = customerID;
        }

        // Validate and update itemOrder if provided
        if (itemOrder && itemOrder.length > 0) {
            const itemIDs = itemOrder.map(orderItem => orderItem.itemID);
            console.log('Extracted Item IDs for update:', itemIDs);

            // Validate ObjectId for all item IDs
            for (const itemID of itemIDs) {
                if (!mongoose.isValidObjectId(itemID)) {
                    console.error(`Invalid itemID: ${itemID}`);
                    return res.status(400).json({ message: `Invalid itemID: ${itemID}` });
                }
            }

            // Fetch the new menu items to be added to the order
            const menuItems = await menu_model.find({ _id: { $in: itemIDs } });
            if (menuItems.length === 0) {
                return res.status(404).json({ message: "No menu items found for the provided itemIDs." });
            }

            // Create a lookup for the new menu items
            const menuItemLookup = {};
            menuItems.forEach(menuItem => {
                menuItemLookup[menuItem._id.toString()] = menuItem;
            });

            // Create a new array for updated items
            const updatedItems = itemOrder.map(orderItem => {
                const { itemID, itemQuantity } = orderItem; // Extract necessary details from request
                const menuItem = menuItemLookup[itemID]; // Match item with the menu model

                // Check if the menu item exists
                if (!menuItem) {
                    throw new Error(`Menu item not found for itemID: ${itemID}`);
                }

                // Log the update for debugging purposes
                console.log(`Updating Item: ${itemID} -`, {
                    itemName: menuItem.itemName,
                    itemPrice: menuItem.itemPrice,
                    itemQuantity,
                });

                // Return updated item details
                return {
                    itemID: menuItem._id.toString(),
                    itemPrice: menuItem.itemPrice,
                    itemQuantity: itemQuantity || 1, // Default to 1 if quantity is missing
                };
            });

            // Update the itemOrder with the new details
            order.itemOrder = updatedItems; // Replace existing itemOrder with updatedItems
        }

        // Update the customer comment if provided
        if (customerComment) {
            order.customerComment = customerComment;
        }

        // Update the order status if provided
        if (orderStatus) {
            order.orderStatus = orderStatus;
        }

        // Set total to 0 as per earlier instructions
        order.total = 0; // To be calculated on the frontend later

        // Save the updated order
        await order.save();
        console.log('Order Updated:', order); // Log the updated order

        // Return success response
        return res.status(200).json({
            message: "Order updated successfully!",
            data: order,
        });
    } catch (error) {
        console.error('Error updating order:', error);
        return res.status(500).json({ message: error.message });
    }
});

// delete order - if there's an issue with the orders
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