'use strict'

import jwt from 'jsonwebtoken'

export const validateJwt = async(req, res, next)=>{
    try{
        let secretKey = process.env.SECRET_KEY
        let { authorization } = req.headers
        if(!authorization) return res.status(401).send({message: 'Unauthorized'})
        let user = jwt.verify(authorization, secretKey)
        req.user = user
        next()
    }catch(err){
        console.error(err)
        return res.status(401).send({message: 'Invalid token or expired'})
    }
}

export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).send({ message: 'Access denied, insufficient privileges' })
    }
    next()
}

export const isClient = (req, res, next) => {
    if (req.user.role !== 'CLIENT') {
        return res.status(403).send({ message: 'Access denied, only allowed for clients' })
    }
    next()
}

export const validateDeletePermission = (req, res, next) => {
    const { role, id } = req.user 
    const userToDeleteId = req.params.id 
    console.log("Usuario autenticado:", req.user) 
    console.log("ID autenticado:", id)
    console.log("ID a eliminar:", userToDeleteId)

    if (role === "CLIENT") {
        if (id !== userToDeleteId) {
            return res.status(403).send({ success: false, message: "Clients can only delete their own account" })
        }
        return next()
    }
    if (role === "ADMIN") {
        return next()
    }
    return res.status(403).send({ success: false, message: "Unauthorized action" })
}

