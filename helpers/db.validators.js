import User from "../src/user/user.model.js";
import { isValidObjectId } from "mongoose";

export const exitUsername = async (username) => {
    const alreadyUsername = await User.findOne({ username })
    if (alreadyUsername) {
        console.error(`Username ${username} already exists`)
        throw new Error(`Username ${username} already exists`)
    }
}

export const existEmail = async (email) => {
    const alreadyEmail = await User.findOne({ email })
    if (alreadyEmail) {
        console.error(`Email ${email} already exists`)
        throw new Error(`Email ${email} already exists`)
    }
}


export const existUserById = async (uid) => {
    const user = await User.findById(uid)
    if (!user) {
        return false
    }
    return true
}