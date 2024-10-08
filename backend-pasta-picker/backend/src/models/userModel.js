import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, minLenght: 8, required: true},
    role: {type: String},
    status: {type: Boolean, default: true}
})

const user_model = mongoose.model('user', userSchema);

export default user_model;