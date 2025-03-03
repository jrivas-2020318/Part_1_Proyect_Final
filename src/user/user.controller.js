import User from "./user.model.js"

export const getAll = async (req, res) => {
    try {
        
        const users = await User.find()
        if (users.length === 0) {
            return res.status(404).send({ success: false, message: "No users found." })
        }
        return res.send({ success: true, message: "Users found.", total: users.length, users })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "Error retrieving users.", err })
    }
}

export const get = async (req, res) => {
    try {
        const user = await User.findById(req.user.uid).select('-password')
        if (!user) {
            return res.status(404).send({message: 'User not found'})
        }
        return res.send(user)
    } catch (error) {
        console.error('Error retrieving user user:', error)
        return res.status(500).send( {success: false,message: 'General Error'})
    }
}




export const save = async (req, res) => {
    const data = req.body
    try {
        const existingUser = await User.findOne({ $or: [{ username: data.username }, { email: data.email }] })
        if (existingUser) {
            return res.status(400).send({ success: false, message: "The username or email is already registered." })
        }

        const user = new User(data)
        await user.save()
        return res.send({ success: true, message: `Usuario ${user.username} Created successfully.`, user })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "Error creating user.", err })
    }
}

export const update = async(req,res)=>{
    try{
        const id = req.user.uid
        const newdata = req.body
        if(newdata.password){
            return res.send({message: 'cannot update your password'})
            
        }
        const data = await User.findByIdAndUpdate(id,newdata,{ new: true })

        if(!data) return res.status(404).send({succes: false, message: 'User not foudn'})
            return res.send({
        succes: true,
        message: 'user updated', data})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'General error with updating an user', err})
    }
}


export const deleteUser = async (req, res) => {
    try {
        const userToDelete = await User.findById(req.params.id)
        if (!userToDelete) {
            return res.status(404).send({ success: false, message: "User not found" })
        }

        userToDelete.status = false
        await userToDelete.save()
        return res.send({ success: true, message: "User deactivated successfully" })
    } catch (error) {
        console.error("Error deactivating user:", error)
        return res.status(500).send({ success: false, message: "General Error" })
    }
}


export const deleteMyUser = async (req, res) => {
    try {
        if (!req.user || !req.user.uid) {
            return res.status(401).send({ success: false, message: "Unauthorized: Token required" })
        }
        const userUid = req.user.uid

        const user = await User.findById(userUid);
        if (!user) {
            return res.status(404).send({ success: false, message: "User not found" })
        }

        user.status = false; 
        await user.save();

        return res.send({ success: true, message: "User deactivated successfully" })

    } catch (error) {
        console.error("Error deactivating user:", error)
        res.status(500).send({ success: false, message: "General Error", error: error.message })
    }
}










