const { User, Appointment, Docotor, sequelize } = require('../models/index.js')
const { Op } = require("sequelize")
const decrypTuser = require('../Middleware/decryptoken')
const moment = require("moment");
const timeFunction = require('../helper/calcularfecha')

//Creamos una cita. (Aquí necesitamos middleware para autenticar USER)

module.exports.createAppointment = async (req, res) => {
    try {
        let user = decrypTuser.decryptoken(req.headers.token)
        let verifyTime = timeFunction.difTime(req.body.date)
        console.log(verifyTime)
        if (verifyTime !== false) {
            let respond = await Appointment.create({
                date: verifyTime,
                state: 'Pending',
                userId: user.data,
                doctorId: req.body.doctor,
                petId: req.body.pets
            })
            res.status(200).json({ data: respond });
        } else {
            res.send('Fecha inválida.')
        }
    } catch (error) {
        res.status(400).send({
            message: 'No se ha podido generar una nueva cita.',
            errors: error,
            status: 400
        });
    }
}


// Buscamos todas las citas. (Aquí necesitamos middleware para autenticar ADMIN)

module.exports.searchAll = async (req, res) => {
    try {
        let user = decrypTuser.decryptoken(req.headers.token)
        let listAppointment = await Appointment.findAll({userId:user.data})
        console.log(listAppointment)
        res.status(200).json({ Data: listAppointment })
    } catch (error) {
        res.status(400).send({
            message: 'No tienes citas pendientes.',
            status: 400
        });
    }
}

module.exports.searchByUser = async (req, res) => {
    try {
        let user = decrypTuser.decryptoken(req.headers.token)
        if(user === false){res.status(400).json({error:"no eres el usuario"})}
        else{
            let list = await Appointment.findAll({where:{userId:user.data}})
            res.status(200).json({ Data: list })
        }
    } catch (error) {
        res.status(400).send({
            message: 'No tienes citas pendientes.',
            status: 400
        });
    }
}

//Buscamos citas por estado 'pending'

module.exports.searchAllPending = async (req, res) => {
    try {
        let result = await Appointment.findAll({ where: { state: 'Pending', } })
        res.status(200).json({ data: result });
    } catch (error) {
        res.status(400).send({
            message: 'No tienes citas pendientes',
            status: 400
        });
    }
}

// // Modificación de la cita, por alguna otra fecha//mejorar
module.exports.updateAppointment = async (req, res) => {
    try {
        await Appointment.update({ date: req.body.oldDate }, {
        where: { date: req.body.newDate }
        })
        res.status(200).json({ data: 'La fecha se ha ejecutado con éxito a : ${req.body.fechaModificar}' });
    } catch (error) {
        res.status(400).send({
            message: 'La cita no se ha podido modificar.',
            status: 400
        });
    }
}

//Eliminar cita por su ID

module.exports.deleteAppointment = async(req, res) => {
    try{
        let user = decrypTuser.decryptoken(req.headers.token)
        await Appointment.destroy({ where: { userId: user.data } })
        res.status(200).json({ Data: 'La cita se ha eliminado.' })
    } catch(error) {
        res.status(400).send({
            message: 'Ha habido un problema.',
            status: 400
        }); }
}

module.exports.deleteOne = async (req, res) => {
    try{
        let user = decrypTuser.decryptoken(req.headers.token)
        let dateDelete = req.body
        console.log(dateDelete.AppointementDelete)
        await Appointment.destroy({
            where: {
                userId: user.data,
                date:dateDelete.date
            } })
        res.status(200).json({ data: `La cita se ha eliminado con éxito ` });
    } catch(error) {
        res.status(400).send({
            message: 'Ha habido un problema.',
            status: 400
        });
    }
}

