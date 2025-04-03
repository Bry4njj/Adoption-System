'use strict'

import { Router } from 'express'
import { 
    save,
    getAppointmentsByUser     
} from './appointment.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

//Rutas privadas - CLIENT
api.post('/save', [validateJwt], save)
api.get('/getMyAppointments', [validateJwt], getAppointmentsByUser)

export default api