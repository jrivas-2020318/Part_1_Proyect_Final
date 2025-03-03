import Cart from '../cart/cart.model.js'
import Facture from '../facture/facture.model.js'
import Product from '../product/product.model.js'

export const createFacture = async (req, res) => {
    try {
        const userId = req.user.uid 
        const cart = await Cart.findOne({ user: userId }).populate('products.product')

        if (!cart) {
            return res.status(404).send({ message: 'Cart not found for the logged-in user' });
        }

        let productsWithSubtotal = [];
        let totalInvoice = 0;

        cart.products.forEach(item => {
            const subtotal = item.product.price * item.quantity
            productsWithSubtotal.push({
                product: item.product._id,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
                subtotal: subtotal
            });
            totalInvoice += subtotal
        })

        const facture = new Facture({
            user: userId,  
            products: productsWithSubtotal,
            total: totalInvoice,
            status: 'Pending',  
            issueDate: Date.now()  
        })

        await facture.save();

        cart.status = 'Invoiced'
        await cart.save()

        return res.status(201).send({
            message: 'Facture created successfully',
            facture: facture
        })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error creating facture', error })
    }
}



export const updateFactureStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body

        if (status !== 'Canceled') {
            return res.status(400).send({
                success: false,
                message: 'Only status "Canceled" can update the stock'
            })
        }
        const facture = await Facture.findById(id).populate('products.product')
        if (!facture) {
            return res.status(404).send({
                success: false,
                message: 'Facture not found'
            })
        }

        if (facture.status === 'Canceled') {
            return res.status(400).send({
                success: false,
                message: 'Facture is already marked as Canceled'
            })
        }
        facture.status = status;

        for (const item of facture.products) {
            const product = item.product
            const quantityToRestore = item.quantity

            const updatedProduct = await Product.findByIdAndUpdate(
                product._id,
                { $inc: { stock: -quantityToRestore } }, 
                { new: true } 
            )
            if (!updatedProduct) {
                return res.status(400).send({
                    success: false,
                    message: `Failed to update stock for product: ${product.name}`
                })
            }
        }
        await facture.save();

        return res.status(200).send({
            success: true,
            message: 'Facture updated successfully to Canceled',
            facture
        });

    } catch (error) {
        console.error('Error updating facture status:', error)
        return res.status(500).send({
            success: false,
            message: 'Error updating facture status',
            error: error.message 
        })
    }
}

export const getFacturesByUser = async (req, res) => {
    try {
        const userId = req.user.uid

        const factures = await Facture.find({ user: userId }).populate('products.product')

        if (!factures || factures.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No factures found for this user'
            })
        }

        return res.status(200).send({
            success: true,
            message: 'Factures retrieved successfully',
            factures
        })

    } catch (error) {
        console.error('Error retrieving factures:', error)
        return res.status(500).send({
            success: false,
            message: 'Error retrieving factures',
            error: error.message
        })
    }
}
