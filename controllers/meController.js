const Footer = require('../models/footerModel');
const z = require('zod');
const { footerSchema } = require('../validators/formValidators');
const footerModel = require('../models/footerModel');
const adminModel = require("../models/adminModel");


const getMe = async (req, res) => {
    if (req.user) {
        const adminFound = await adminModel.findOne({ email: email })
        if (!adminFound) return res.status(404).send({
            success: false,
            message: 'Admin not Found'
        })
        return {
            success: false,
            message: {
                isAuthenticated: true,
                userid: adminFound.id,
                isAdmin: adminFound.role === "admin" ? true : false,
                isWebmaster: adminFound.role === "webmaster" ? true : false,
            }
        }
    }
}

module.exports = { getMe }