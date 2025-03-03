import {Schema, model} from "mongoose"

const factureSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    products: [{
        product: { 
            type: Schema.Types.ObjectId, 
            ref: 'Product', 
            required: true
        },
        name: { 
            type: String, 
            required: true 
        },
        price: { 
            type: Number, 
            required: true 
        },
        quantity: { 
            type: Number, 
            required: true,
            min: 1 
        },
        subtotal: { 
            type: Number, 
            required: true 
        }
    }],
    total: { 
        type: Number, 
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Canceled'],
        default: 'Pending' 
    },
    issueDate: {
        type: Date,
        default: Date.now 
    }
}, { timestamps: true })

const facture = model('Invoice', factureSchema)

export default facture
