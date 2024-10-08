import mongoose, {Schema} from "mongoose";

const menuSchema = new Schema({
    itemID: {
        type: String
    },
    itemName: {
        type: String,
        required: true
    },
    itemType: {
        type: String,
        required: true
    },
    itemPrice: {
        type: Number,
        required: true
    },
    itemQuantity: {
        type: Number,
        required: false
    },
    itemImg: {
        type: String,
        required: true
    },
    _status: {
        type: String,
        default: "active"
    }
})

const menu_model = mongoose.model("menu", menuSchema);

export default menu_model;