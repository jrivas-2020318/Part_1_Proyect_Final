import {Router} from 'express'
import {createFacture, updateFactureStatus, getFacturesByUser} from './facture.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { factureUpdateValidator, factureValidator } from '../../helpers/validators.js'

const api = Router()
api.post('/addfacture', [validateJwt, factureValidator], createFacture)
api.put('/updatefacture/:id', [validateJwt, factureUpdateValidator], updateFactureStatus)
api.get('/getall', [validateJwt], getFacturesByUser)

export default api 