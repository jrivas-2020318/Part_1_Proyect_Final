import { Router } from 'express'
import { getAll, get, save, update, deleteProduct } from "./product.controller.js"
import { isAdmin, isClient, validateJwt } from '../../middlewares/validate.jwt.js'

const api = Router()

api.get('/', [validateJwt], getAll)
api.get('/:id', [validateJwt], get)
api.post('/createProduct', [validateJwt, isAdmin], save)
api.put('/:id', [validateJwt, isAdmin], update)
api.delete('/delete/:id', [validateJwt, isAdmin], deleteProduct)

export default api
