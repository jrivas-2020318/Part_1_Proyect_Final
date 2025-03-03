import {Router} from 'express'
import {addToCart, clearCart, deleteProductCart, getCart} from './cart.controller.js'
import {validateJwt} from '../../middlewares/validate.jwt.js'
import { cartClearValidator, cartDeleteValidator, cartValidator } from '../../helpers/validators.js'

const api = Router()
api.delete('/clear',[validateJwt], clearCart)
api.post('/add', [validateJwt, cartValidator], addToCart)
api.delete('/delete', [validateJwt, cartDeleteValidator], deleteProductCart)
api.get('/', [validateJwt], getCart)

export default api

