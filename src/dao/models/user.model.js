import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    cart:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart"
    },
    soldProducts: 
    [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product' 
        }
    ],
    createdProducts: 
    [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product' 
        }
    ],
    role: { type: String, default: "user" },
});

const User = mongoose.model("User", userSchema);

export default User;