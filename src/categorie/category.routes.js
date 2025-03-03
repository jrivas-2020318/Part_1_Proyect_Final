import { Router } from 'express'
import { getAll, get, save, update, deleteCategory } from "./category.controller.js"
import { isAdmin, isClient, validateJwt } from '../../middlewares/validate.jwt.js'
import { categoryDeleteValidator, categoryUpdateValidator, categoryValidator } from '../../helpers/validators.js'

const api = Router()

api.get('/', [validateJwt], getAll)

api.get('/:id', [validateJwt, isAdmin], get)

api.post('/createCategory', [validateJwt, isAdmin, categoryValidator], save)

api.put('/:id', [validateJwt, isAdmin, categoryUpdateValidator], update)

api.delete('/:id', [validateJwt, isAdmin, categoryDeleteValidator], deleteCategory)

export default api
