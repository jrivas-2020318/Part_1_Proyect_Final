import Cart from './cart.model.js'
import Product from '../product/product.model.js'

export const addToCart = async (req, res) => {
    try {
        const idUser = req.user.uid
        const { product: idProduct, quantity } = req.body

        if (!idProduct || !quantity) {
            return res.status(400).send({ message: 'Please provide product and quantity' })
        }
        const product = await Product.findById(idProduct);
        if (!product) {
            return res.status(404).send({ message: 'Product not found' })
        }

        if (product.stock < quantity) {
            return res.status(400).send({ message: `Insufficient stock. Available: ${product.stock}` })
        }

        let cart = await Cart.findOne({ user: idUser })

        if (!cart) {
            cart = new Cart({
                user: idUser,
                products: [{ product: idProduct, quantity }],
                total: product.price * quantity,
            });
        } else {
            const existingProductIndex = cart.products.findIndex(p => p.product.toString() === idProduct)

            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity = quantity

            } else {
                cart.products.push({ product: idProduct, quantity })
            }

            let total = 0;
            for (const item of cart.products) {
                const productDetails = await Product.findById(item.product)
                total += productDetails.price * item.quantity
            }
            cart.total = total;
        }
        await cart.save();

        return res.status(200).send({ message: 'Product added to your cart', cart })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error adding to cart', error })
    }
};

export const deleteProductCart = async (req, res) => {
    try {
        const idUser = req.user.uid
        const { product: idProduct } = req.body

        if (!idProduct) {
            return res.status(400).send({ message: 'Please provide product ID' })
        }

        // Buscar el carrito del usuario
        let cart = await Cart.findOne({ user: idUser })

        if (!cart) {
            return res.status(404).send({ message: 'Cart not found for this user' })
        }

        // Buscar el producto en el carrito
        const existingProductIndex = cart.products.findIndex(p => p.product.toString() === idProduct)

        if (existingProductIndex === -1) {
            return res.status(400).send({ message: 'Product not found in cart' })
        }

        // Eliminar el producto del carrito
        cart.products.splice(existingProductIndex, 1)
        console.log('Product removed from cart')

        // Recalcular el total del carrito
        let total = 0;
        for (const item of cart.products) {
            const productDetails = await Product.findById(item.product)
            total += productDetails.price * item.quantity
        }
        cart.total = total
        
        await cart.save()

        return res.status(200).send({ message: 'Product removed from cart', cart })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error removing product from cart', error })
    }
};



export const getCart = async (req, res) => {
    try {
        const idUser = req.user.uid;
        const cart = await Cart.findOne({ user: idUser })
            .populate('products.product', 'name description price -_id') 
            .populate('user', 'name email'); 

        if (!cart) {
            return res.status(404).send({ message: 'Cart not found for this user' })
        }

        return res.status(200).send({ message: 'Cart fetched successfully', cart })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error fetching cart', error })
    }
};

export const clearCart = async (req, res) => {
    try {
        const userId = req.user._id; 
        const updatedCart = await Cart.findOneAndUpdate(
            { userId: userId }, 
            { $set: { products: [] } },
            { new: true }
        );

        if (!updatedCart) {
            return res.status(404).send({
                success: false,
                message: 'Carrito no encontrado'
            });
        }
        return res.send({
            success: true,
            message: 'Carrito limpiado con éxito',
            cart: updatedCart 
        });

    } catch (error) {
        console.error('Error al limpiar el carrito:', error)
        return res.status(500).send({
            success: false,
            message: 'Error al limpiar el carrito',
            error: error.message
        });
    }
};

