import mongoose, {Schema} from "mongoose";

const customerSchema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, minLenght: 8, required: true},
    address: {type: String, required: true},
    contact: {type: Number, required: true},
    status: {type: Boolean, default: true}
})

const customer_model = mongoose.model('customer', customerSchema);

export default customer_model;