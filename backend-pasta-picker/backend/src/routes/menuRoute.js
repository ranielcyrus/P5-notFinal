import express from "express";
import menu_model from "../models/menuModel.js";

const router = express.Router();

// please consider this as the master file, but can be used as pasta-picker.com/menu (only to GET ALL menu items or one menu item only)

// create menu item
router.post("/create", async (req, res) => {
    try {
        const {
            itemName,
            itemType,
            itemPrice,
            itemImg,
            itemQuantity,
        } = req.body
        const newMenu = new menu_model({
            itemName: itemName,
            itemType: itemType,
            itemPrice: itemPrice,
            itemImg: itemImg,
            itemQuantity: itemQuantity
        })
        await newMenu.save()
        res.status(201).json(
            {
                "message": "Menu Item Created!"
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

// get all items
router.get("/", async (req, res) => {
    try {
        const menuItems = await menu_model.find({
            _status: "active"
        })
        res.status(200).json(
            {
                data: menuItems
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
    
//get 1 menu item
router.get("/:id", async (req, res) => {
    try {
        const {
            id
        } = req.params
        const menu = await menu_model.findById(id)
        res.status(200).json(
            {
                data: menu
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
    
//edit menu
router.patch("/edit/:id", async (req, res) => {
    try {
        const {
            id
        } = req.params
        const {
            itemName,
            itemType,
            itemPrice,
            itemImg,
            itemQuantity
        } = req.body
        const menu = await menu_model.findById(id)
        menu.itemName = itemName
        menu.itemType = itemType
        menu.itemPrice = itemPrice
        menu.itemImg = itemImg
        menu.itemQuantity = itemQuantity
    
        await menu.save()
        res.status(201).json(
            {
                "message": "Menu updated!", 
                data: menu
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
    
    //delete menu item
router.delete("/delete/:id", async (req, res) => {
    try {
        const {
            id
        } = req.params
        const menu = await menu_model.findByIdAndUpdate(id, {
    
            _status: "deleted"
    
        }, {
            new: true
        })
        await menu.save()
        res.status(200).json(
            {
                "message": "Menu deleted!", 
                data: menu
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