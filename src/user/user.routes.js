import { Router } from 'express'
import { getAll, get, save, update, deleteUser } from "./user.controller.js"
import { validateJwt, isAdmin, isClient  } from '../../middlewares/validate.jwt.js'
import { validateDeletePermission } from '../../middlewares/validate.jwt.js' // Validación de roles

const api = Router()

api.get('/', [validateJwt, isAdmin], getAll)
api.get('/:id', [validateJwt, isClient,], get)
api.post('/createAdmin', [validateJwt], save)
api.put('/:id', [validateJwt], update)
api.delete('/:id', [validateJwt,validateDeletePermission], deleteUser)

export default api
