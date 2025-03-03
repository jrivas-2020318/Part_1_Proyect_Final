import Product from "./product.model.js"
import Facture from "../facture/facture.model.js"
import mongoose from "mongoose";


export const getAll = async (req, res) => {
    try {
        const products = await Product.find().populate('category').populate('name')
        if (products.length === 0) {
            return res.status(404).send({ success: false, message: "No se encontraron productos" })
        }
        return res.send({ success: true, message: "Productos encontrados", total: products.length, products })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "Error al obtener productos", err })
    }
}

export const getId = async (req, res) => {
    const { id } = req.params
    try {
        const product = await Product.findById(id)
        if (!product) return res.status(404).send({ success: false, message: "Producto no encontrado" })
        return res.send({ success: true, message: "Producto encontrado", product })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "Error al obtener producto", err })
    }
}

export const save = async (req, res) => {
    const data = req.body
    try {
        const product = new Product(data)
        await product.save()
        return res.send({ success: true, message: `Producto ${product.name} guardado correctamente` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "Error al guardar producto", err })
    }
}

export const update = async (req, res) => {
    const { id } = req.params
    const data = req.body
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true })
        if (!updatedProduct) return res.status(404).send({ success: false, message: "Producto no encontrado, no actualizado" })
        return res.send({ success: true, message: "Producto actualizado correctamente", updatedProduct })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "Error al actualizar producto", err })
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params
    try {
        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).send({ success: false, message: "Producto no encontrado, no eliminado" })
        }
        product.status = false
        await product.save()
        return res.send({ success: true, message: "Producto desactivado correctamente" })
    } catch (err) {
        console.error("Error al desactivar producto:", err)
        return res.status(500).send({ success: false, message: "Error al desactivar producto", err })
    }
};


export const OutOfStockProducts = async (req, res) => {
    try {
        const stock = await Product.find({stock: 0})

        if(stock.length === 0)
            return res.send({message: 'Not product stock'})
            return res.send(stock)
            
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'General error'})
    }
    
}

export const productSell = async (req, res) => {
    try {
        const factures = await Facture.find({});
        if (factures.length === 0) {
            return res.send({ success: true, message: 'No invoices posted', products: [] })
        }

        const productSales = {};
        factures.forEach(facture => {
            facture.products.forEach(({ product, quantity }) => {
                if (!product || typeof product !== 'object' || !product._id) return
                const idString = product._id.toString()
                productSales[idString] = (productSales[idString] || 0) + quantity
            });
        });

        console.log("Cumulative sales by product:", productSales)

        const productIds = Object.keys(productSales).map(id => new mongoose.Types.ObjectId(id))
        if (!productIds.length) {
            return res.send({ success: true, message: 'No Sold Products Found', products: [] })
        }

        const products = await Product.find({ '_id': { $in: productIds } }).populate('category')
        const topSellingProducts = products
            .map(product => ({
                name: product.name,
                price: product.price,
                totalSold: productSales[product._id.toString()] || 0,
                category: product.category
            }))
            .filter(product => product.totalSold > 0)
            .sort((a, b) => b.totalSold - a.totalSold)
            .slice(0, 10); 

        return res.send({
            success: true,
            message: 'Best-selling products obtained correctly',
            products: topSellingProducts
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Failed to get best-selling products',
            error: error.message
        })
    }
}






