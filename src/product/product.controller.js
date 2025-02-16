import Product from "./product.model.js"

// Obtener todos los productos
export const getAll = async (req, res) => {
    try {
        const products = await Product.find()
        if (products.length === 0) {
            return res.status(404).send({ success: false, message: "No se encontraron productos" })
        }
        return res.send({ success: true, message: "Productos encontrados", total: products.length, products })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "Error al obtener productos", err })
    }
}

// Obtener un producto por ID
export const get = async (req, res) => {
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

// Crear un nuevo producto
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

// Actualizar un producto
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

// Eliminar un producto
export const deleteProduct = async (req, res) => {
    const { id } = req.params
    try {
        const deletedProduct = await Product.findByIdAndDelete(id)
        if (!deletedProduct) return res.status(404).send({ success: false, message: "Producto no encontrado, no eliminado" })
        return res.send({ success: true, message: "Producto eliminado correctamente" })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "Error al eliminar producto", err })
    }
}