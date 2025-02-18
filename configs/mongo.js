import mongoose, {disconnect} from "mongoose"
import Category from "../src/categorie/category.model.js"

export const connect = async()=>{
    try{
        mongoose.connection.on('error', ()=>{
            console.log('MongoDB | Could not be connect to mongodb')
        })
        mongoose.connection.on('connecting', ()=>{
            console.log('MongoDB | try conecting')
        })
        mongoose.connection.on('connected', async()=>{
            console.log('MongoDB | connected to mongodb')
            await createDefaultCategory()
        })
        mongoose.connection.once('open', ()=>{
            console.log('MongoDB | connected to database')
        })
        mongoose.connection.on('reconnected', ()=>{
            console.log('MongoDB | reconnected to mongodb')
        })
        mongoose.connection.on('disconnected', ()=>{
            console.log('MongoDB | disconnected')
        })
        await mongoose.connect(
            `${process.env.DB_SERVICE}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
            {
                maxPoolSize: 50, 
                serverSelectionTimeoutMS: 5000 
            }
        )
    }catch(err){
        console.error('Database connection failed', err)
    }
}

const createDefaultCategory = async () => {
    try {
        const defaultCategory = await Category.findOne({ isDefault: true })
        if (!defaultCategory) {
            const newCategory = new Category({ 
                name: "Sin categoría", 
                description: "Productos sin categoría", 
                isDefault: true 
            })
            await newCategory.save()
            console.log("✅ Categoría predeterminada creada")
        } else {
            console.log("✅ Categoría predeterminada ya existe")
        }
    } catch (err) {
        console.error("Error al crear la categoría predeterminada:", err)
    }
}