import mongoose, {disconnect} from "mongoose"
import Category from "../src/categorie/category.model.js"
import argon2  from "argon2"
import User from "../src/user/user.model.js"

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
            await createDefaultAdmin()
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
        const defaultCategoryExists = await Category.findOne({ 
            $or: [{ isDefault: true }, { name: "Sin categoría" }]
        });

        if (defaultCategoryExists) {
            console.log("✅ Categoría predeterminada ya existe")
            return;
        }
        const newCategory = new Category({ 
            name: "Sin categoría", 
            description: "Productos sin categoría", 
            isDefault: true 
        });

        await newCategory.save()
        console.log("✅ Categoría predeterminada creada")

    } catch (err) {
        console.error("❌ Error al crear la categoría predeterminada:", err)
    }
}

const createDefaultAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: 'ADMIN' })
        if (adminExists) {
            console.log('✅ Admin account already exists.')
            return;
        }
        const hashedPassword = await argon2.hash('J0s3Jul1@n11')
        const newAdmin = new User({
            username: 'admin',
            email: 'admin@gmail.com',
            password: hashedPassword,
            name: 'Admin',
            lastname: 'User',
            phone: '1234567890',
            role: 'ADMIN'
        });

        await newAdmin.save();
        console.log('✅ Admin account created successfully.')
    } catch (error) {
        console.error('❌ Failed to create admin account:', error)
    }
}