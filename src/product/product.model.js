import { Schema, model, Types} from "mongoose"

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
        type: Types.ObjectId,
        ref: "Category",
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true
})

export default model("Product", productSchema)
