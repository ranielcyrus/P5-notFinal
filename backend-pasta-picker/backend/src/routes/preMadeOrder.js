import express from "express";
import order_model from "../models/orderModel.js";
import menu_model from "../models/menuModel.js";
import mongoose from "mongoose";

const router = express.Router();

// create orders
router.post('/', async (req, res) => {
    const { customerID, itemOrder = [], customerComment, preMadeItems = [] } = req.body;

    // Validate itemOrder and preMadeItems
    if (itemOrder.length === 0 && preMadeItems.length === 0) {
        return res.status(400).json({ message: "At least one order type must be provided." });
    }

    // Function to validate if the itemOrder follows the specified structure
    const validateItemOrderStructure = (orderItems) => {
        const validCategories = ['Pasta', 'Sauce', 'Toppings'];
        for (const orderItem of orderItems) {
            if (!orderItem.category || !validCategories.includes(orderItem.category)) {
                return false; // Invalid category found
            }
        }
        return true; // All items are valid
    };

    try {
        // Initialize an array to hold populated items
        let populatedItems = [];

        // Process standard item orders if provided
        if (itemOrder.length > 0) {
            // Validate the structure of itemOrder
            if (!validateItemOrderStructure(itemOrder)) {
                return res.status(400).json({ message: "Each standard item must belong to a valid category: 'Pasta', 'Sauce', or 'Toppings'." });
            }

            // Extract all item IDs from the standard item orders
            const itemIDs = itemOrder.map(orderItem => orderItem.itemID);
            console.log('Extracted Item IDs from itemOrder:', itemIDs);

            // Validate ObjectId for all item IDs
            for (const itemID of itemIDs) {
                if (!mongoose.isValidObjectId(itemID)) {
                    console.error(`Invalid itemID in itemOrder: ${itemID}`);
                    return res.status(400).json({ message: `Invalid itemID in itemOrder: ${itemID}` });
                }
            }

            // Fetch all menu items in a single query
            const menuItems = await menu_model.find({ _id: { $in: itemIDs } });
            console.log('Fetched Menu Items:', menuItems);

            // Check if any menu items were found
            if (menuItems.length === 0) {
                console.error('No menu items found for the provided itemIDs');
                return res.status(404).json({ message: "No menu items found for the provided itemIDs." });
            }

            // Create a lookup for easy access
            const itemLookup = {};
            menuItems.forEach(menuItem => {
                itemLookup[menuItem._id.toString()] = menuItem;
            });

            // Populate the items with details from the menu model
            populatedItems = itemOrder.map(orderItem => {
                const { itemID, itemQuantity } = orderItem; // Extract itemID and quantity
                const menuItem = itemLookup[itemID]; // Find the corresponding item

                // Check if the item exists
                if (!menuItem) {
                    console.error(`Item not found for itemID: ${itemID}`);
                    throw new Error(`Item not found for itemID: ${itemID}`);
                }

                // Determine quantity
                const quantity = itemQuantity && !isNaN(itemQuantity) ? itemQuantity : 1; // Default to 1

                // Log the populated item details
                console.log(`Populating Item: ${itemID} -`, {
                    itemPrice: menuItem.itemPrice,
                    itemImg: menuItem.itemImg,
                    itemQuantity: quantity,
                });

                // Return the populated item details
                return {
                    itemID: menuItem._id.toString(),
                    itemPrice: menuItem.itemPrice,
                    itemQuantity: quantity,
                    itemImg: menuItem.itemImg,
                };
            });
        }

        // Process pre-made items if provided
        if (preMadeItems.length > 0) {
            populatedItems = populatedItems.concat(preMadeItems.map(preMadeItem => ({
                itemID: preMadeItem.itemID,
                itemPrice: preMadeItem.itemPrice,
                itemQuantity: preMadeItem.itemQuantity || 1, // Default to 1 if not provided
                itemImg: preMadeItem.itemImg,
            })));
        }

        // Create the new order
        const newOrder = new order_model({
            customerID: customerID || null,
            itemOrder: populatedItems,
            customerComment,
            total: 0, // Temporarily set to 0
        });

        // Save the order
        await newOrder.save();
        console.log('New Order Created:', newOrder);

        // Return the response with the created order
        return res.status(201).json({
            message: "Order Created!",
            data: newOrder,
        });
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ message: error.message });
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
router.patch('/:id', async (req, res) => {
    const { itemOrder = [], customerComment, preMadeItems = [] } = req.body;
    const { id } = req.params; // Get the order ID from params

    // Validate itemOrder and preMadeItems
    if (itemOrder.length === 0 && preMadeItems.length === 0) {
        return res.status(400).json({ message: "At least one order type must be provided." });
    }

    // Function to validate if the itemOrder follows the specified structure
    const validateItemOrderStructure = (orderItems) => {
        const validCategories = ['Pasta', 'Sauce', 'Toppings'];
        for (const orderItem of orderItems) {
            if (!orderItem.category || !validCategories.includes(orderItem.category)) {
                return false; // Invalid category found
            }
        }
        return true; // All items are valid
    };

    try {
        // Fetch the existing order from the database
        const order = await order_model.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        // Initialize an array to hold populated items
        let populatedItems = [...order.itemOrder]; // Start with existing items

        // Process standard item orders if provided
        if (itemOrder.length > 0) {
            // Validate the structure of itemOrder
            if (!validateItemOrderStructure(itemOrder)) {
                return res.status(400).json({ message: "Each standard item must belong to a valid category: 'Pasta', 'Sauce', or 'Toppings'." });
            }

            // Extract all item IDs from the standard item orders
            const itemIDs = itemOrder.map(orderItem => orderItem.itemID);
            console.log('Extracted Item IDs from itemOrder:', itemIDs);

            // Validate ObjectId for all item IDs
            for (const itemID of itemIDs) {
                if (!mongoose.isValidObjectId(itemID)) {
                    console.error(`Invalid itemID in itemOrder: ${itemID}`);
                    return res.status(400).json({ message: `Invalid itemID in itemOrder: ${itemID}` });
                }
            }

            // Fetch all menu items in a single query
            const menuItems = await menu_model.find({ _id: { $in: itemIDs } });
            console.log('Fetched Menu Items:', menuItems);

            // Check if any menu items were found
            if (menuItems.length === 0) {
                console.error('No menu items found for the provided itemIDs');
                return res.status(404).json({ message: "No menu items found for the provided itemIDs." });
            }

            // Create a lookup for easy access
            const itemLookup = {};
            menuItems.forEach(menuItem => {
                itemLookup[menuItem._id.toString()] = menuItem;
            });

            // Populate the items with details from the menu model
            populatedItems = itemOrder.map(orderItem => {
                const { itemID, itemQuantity } = orderItem; // Extract itemID and quantity
                const menuItem = itemLookup[itemID]; // Find the corresponding item

                // Check if the item exists
                if (!menuItem) {
                    console.error(`Item not found for itemID: ${itemID}`);
                    throw new Error(`Item not found for itemID: ${itemID}`);
                }

                // Determine quantity
                const quantity = itemQuantity && !isNaN(itemQuantity) ? itemQuantity : 1; // Default to 1

                // Log the populated item details
                console.log(`Populating Item: ${itemID} -`, {
                    itemPrice: menuItem.itemPrice,
                    itemImg: menuItem.itemImg,
                    itemQuantity: quantity,
                });

                // Return the populated item details
                return {
                    itemID: menuItem._id.toString(),
                    itemPrice: menuItem.itemPrice,
                    itemQuantity: quantity,
                    itemImg: menuItem.itemImg,
                };
            });
        }

        // Process pre-made items if provided
        if (preMadeItems.length > 0) {
            populatedItems = populatedItems.concat(preMadeItems.map(preMadeItem => ({
                itemID: preMadeItem.itemID,
                itemPrice: preMadeItem.itemPrice,
                itemQuantity: preMadeItem.itemQuantity || 1, // Default to 1 if not provided
                itemImg: preMadeItem.itemImg,
            })));
        }

        // Update the order properties
        order.itemOrder = populatedItems;
        if (customerComment) {
            order.customerComment = customerComment; // Update customer comment if provided
        }
        order.total = 0; // Temporarily set total to 0; this can be calculated based on populatedItems later

        // Save the updated order
        await order.save();
        console.log('Order Updated:', order);

        // Return the response with the updated order
        return res.status(200).json({
            message: "Order Updated!",
            data: order,
        });
    } catch (error) {
        console.error('Error updating order:', error);
        return res.status(500).json({ message: error.message });
    }
});

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