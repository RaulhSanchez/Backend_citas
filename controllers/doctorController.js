const { User, Appointment, Pet, Doctor } = require('../models/index.js')

module.exports.createDoctor = async (req,res) => {
    try {
        const doctor = req.body
        await Doctor.create(doctor)
        res.status(200).json({data:doctor})
    } catch (eror) {
        res.send("error")
    }
}

module.exports.finDoctor = async (req,res)=>{
    console.log("estoy dentro desde Front")

    try {
        let doctorList = await Doctor.findAll({})
        console.log(doctorList)
        res.status(200).json({data:doctorList})
    } catch (error) {
        res.status(400).send({
            message: "No hay doctores"
        })
    }
}