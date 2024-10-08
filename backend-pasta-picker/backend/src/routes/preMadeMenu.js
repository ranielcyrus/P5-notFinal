import express from "express";
import menu_model from "../models/menuModel.js";

const router = express.Router();

// get all pre-made items p.s. use itemType to filter
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
    
// get one pre-made item p.s. use itemType to filter
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

export default router;