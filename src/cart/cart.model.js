import { Schema, model} from 'mongoose'

const cartSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    products: [{
        product: {type: Schema.Types.ObjectId, ref: 'Product'},
        quantity: {type: Number, default: 1},

    }],
    total:{
        type: Number,
        default: 0
    },
    total: Number,
})

export default model('Cart', cartSchema);
