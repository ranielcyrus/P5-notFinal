import mongoose, {Schema} from "mongoose";
import menu_model from "./menuModel.js";

const orderSchema = new Schema({
    orderID: {
        type: String,
    },
    customerID: {
        type: String,
        required: false,
    },
    itemID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'menu'
    },
    itemName: {
        type: String,
    },
    itemType: {
        type: String,
    },
    itemPrice: {
        type: Number,
    },
    itemQuantity: {
        type: Number,
    },
    itemImg: {
        type: String,
    },
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
    _status: {
        type: String,
        default: "active"
    }
})

const order_model = mongoose.model("order", orderSchema)

export default order_model;