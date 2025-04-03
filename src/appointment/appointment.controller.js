'use strict'

import Animal from '../animal/animal.model.js'
import Appointment from './appointment.model.js'

export const save = async(req, res)=>{
    try{
        let data = req.body
        data.user = req.user._id
        //Verificar que exista el animal
        let animal = await Animal.findOne({_id: data.animal})
        if(!animal) return res.status(404).send({message: 'Animal not found'})
        //Validar que la mascota no tenga una cita activa con esa persona
        let appointmentExist = await Appointment.findOne({
            $or: [
                {
                    animal: data.animal,
                    user: data.user
                },
                {
                    date: data.date,
                    user: data.user
                }
            ]
        })
        if(appointmentExist) return res.send({message: 'Appointment already exist'})
        let appointment = new Appointment(data)
        await appointment.save()
        return res.send({message: `Appointment saved successfully, for the date ${appointment.date}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error saving appointment', err})
    }
}

export const getAppointmentsByUser = async(req, res)=>{
    try{
        //Capturar el id del usuario logeado
        let { _id } = req.user
        let appointments = await Appointment.find({ user: _id }, {user: 0})
            .populate('animal')
        return res.send({message: 'Your appointments: ', appointments})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error getting appointments', err})
    }
}