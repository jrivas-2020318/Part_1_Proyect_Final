import { Router } from 'express'
import { getAll, getId, save, update, deleteProduct, OutOfStockProducts, productSell } from "./product.controller.js"
import { isAdmin, isClient, validateJwt } from '../../middlewares/validate.jwt.js'
import { productDeleteValidator, productUpdateValidator, productValidator } from '../../helpers/validators.js'

const api = Router()
api.get('/sellProduct', [validateJwt],productSell)
api.get('/', [validateJwt], getAll)
api.get('/stock',[validateJwt, isAdmin], OutOfStockProducts)

api.get('/:id', [validateJwt], getId)
api.post('/createProduct', [validateJwt, isAdmin, productValidator], save)
api.put('/updateProduct', [validateJwt, isAdmin, productUpdateValidator], update)
api.delete('/delete/:id', [validateJwt, isAdmin, productDeleteValidator], deleteProduct)


export default api
