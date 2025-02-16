import User from "../user/user.model.js";

import { checkPassword, encrypt } from "../../utils/encrypt.js";
import { generateJwt } from "../../utils/jwt.js";

//Registar
export const register = async(req, res)=>{
    try{
        let data = req.body
        let user = new User(data)
        if(data.status){
            return res.status(400).send({
                success: false,
                message: 'Insert status is not allowed'
            })
        }
        user.password = await encrypt(user.password)
        user.role = 'CLIENT'
        await user.save()
        return res.send({message: `Registered successfully, can be logged with username: ${user.username}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'General error with registering user', err})
    }
}

export const login = async(req, res)=>{
    try {
        let { username, password } = req.body;
        let user = await User.findOne({ username });

        if (user && await checkPassword(user.password, password)) {
            let loggedUser = { 
                id: user._id, 
                name: user.name,
                username: user.username,
                role: user.role
            };
            let token = await generateJwt(loggedUser);
            return res.send({
                message: `W elcome ${user.name}`,
                loggedUser,
                token
            });
        }
        return res.status(400).send({ message: 'Wrong email or password' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'General error with login function' });
    }
}