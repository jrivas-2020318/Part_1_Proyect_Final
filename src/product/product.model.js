import { Schema, model } from "mongoose"

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
})

export default model("Product", productSchema)
