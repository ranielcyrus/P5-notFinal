import mongoose, { Schema } from "mongoose";
import menu_model from "./menuModel.js";
import customer_model from "./customerModel.js";

const orderSchema = new Schema({
    orderID: {
        type: String,
        required: false
    },
    customerID: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'customer'
    },
    itemOrder: [{
        itemID: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'menu',
            required: true
        },
        itemType: {
            type: String,
            enum: ['Pasta', 'Sauce', 'Topping', 'Pre-made'],
            required: false
        },
        itemName: {
            type: String,
            required: false
        }
    }],
    orderStatus: {
        type: String,
    },
    total: {
        type: Number,
        required: false
    },
    customerComment: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: new Date()
    },
    _status: {
        type: String,
        default: "active"
    }
})

const order_model = mongoose.model("order", orderSchema);

export default order_model;