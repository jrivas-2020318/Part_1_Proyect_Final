import { Router } from 'express'
import { getAll, get, save, update, deleteUser, deleteMyUser } from "./user.controller.js"
import { validateJwt, isAdmin, isClient  } from '../../middlewares/validate.jwt.js'
import { validateDeletePermission } from '../../middlewares/validate.jwt.js' // Validación de roles
import { createAdminValidator, updateValidator } from '../../helpers/validators.js'

const api = Router()

api.get('/', [validateJwt, isAdmin], getAll)
api.delete('/myUser', [validateJwt, deleteMyUser], deleteMyUser)
api.get('/my', [validateJwt], get)
api.post('/createAdmin', [validateJwt, createAdminValidator, isAdmin], save)
api.put('/:id', [validateJwt, updateValidator], update)
api.delete('/:id', [validateJwt, validateDeletePermission, isAdmin], deleteUser)

export default api
