import Category from "../categorie/category.model.js"
import Product from "../product/product.model.js"


export const test = (req, res) => {
    return res.send({ message: 'Todo good' })
}

export const save = async (req, res) => {
    const data = req.body
    try {
        // Verificar si el nombre de la categoría está presente
        if (!data.name || data.name.trim() === "") {
            return res.status(400).send({
                success: false,
                message: "The category name is required"
            })
        }

        const category = new Category(data)
        await category.save()
        return res.send({
            success: true,
            message: `Categoría '${category.name}' Saved successfully`
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'General error when adding category',
            err
        })
    }
}



export const getAll = async (req, res) => {
    const { limit, skip } = req.query
    try {
        const categories = await Category.find().skip(skip).limit(limit)
        if (categories.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'Categories not found.'
            })
        }
        return res.send({
            success: true,
            message: 'Categories found.:',
            total: categories.length,
            categories
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'Error retrieving categories.',
            err
        })
    }
}


export const get = async (req, res) => {
    const { id } = req.params
    try {
        const category = await Category.findById(id)
        if (!category) return res.status(404).send({
            success: false,
            message: 'Category not found.a'
        })
        return res.send({
            success: true,
            message: 'Category found::',
            category
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'Error retrieving category.',
            err
        })
    }
}


export const update = async (req, res) => {
    const { id } = req.params
    const data = req.body
    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, data, { new: true })
        if (!updatedCategory) return res.status(404).send({
            success: false,
            message: 'Category not found, not updated.'
        })
        return res.send({
            success: true,
            message: 'Category updated successfully.',
            updatedCategory
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'Error updating category.',
            err
        })
    }
}



// Eliminar una categoría y reasignar productos a la categoría predeterminada
export const deleteCategory = async (req, res) => {
    const { id } = req.params
    try {
        const category = await Category.findById(id)

        if (!category) {
            return res.status(404).send({
                success: false,
                message: "Category not found."
            })
        }

        // Evitar eliminar la categoría predeterminada
        if (category.isDefault) {
            return res.status(403).send({
                success: false,
                message: "You cannot delete the default category."
            })
        }
        let defaultCategory = await Category.findOne({ isDefault: true })
        if (!defaultCategory) {
            defaultCategory = await Category.create({ name: "No category.", isDefault: true })
            console.log("✅ Default category created successfully.")
        }

        // Reasignar productos a la categoría predeterminada
        await Product.updateMany({ category: id }, { category: defaultCategory._id })
        await Category.findByIdAndDelete(id)

        return res.send({
            success: true,
            message: "Category deleted and products reassigned to the default one."
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: "Error deleting category.",
            err
        })
    }
}

