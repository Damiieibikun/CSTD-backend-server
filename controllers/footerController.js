const Footer = require('../models/footerModel');
const { ZodError } = require('zod');
const { footerSchema } = require('../validators/formValidators');
const footerModel = require('../models/footerModel');

// Create footer
const addFooter = async (req, res) => {
const validation = footerSchema.safeParse(req.body);
    if (!validation.success) {
        const formatted = ZodError.flatten(result.error);
        return res.status(401).send({
            success: false,
            message: `Could not add Footer: ${formatted}`, 
        });           
        } 
    try {    
    const footer = new Footer(validation.data);
    await footer.save();
    res.status(201).send({
        success: true,
        message: 'Footer added!',
        data: footer
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
    success: false,
    message: 'Could not add Footer',
    error: err.message
       });
  }
}

// Get footer
const getFooter = async (req, res) => {
    try {
        const footer = await footerModel.find({})
        res.status(200).send({
            success: true,
            message: 'Footer fetched successfully!',
            data: footer
        })
    } catch (err) {
         console.error(err);
    res.status(500).send({
    success: false,
    message: 'Could not fetch Footer',
    error: err.message
       });
    }
}
// Update footer
const updateFooter = async (req, res) => {
    const{id} = req.params
        if(!id) return res.status(401).send({
            success: false,
            message: 'ID is required'
        })
    const validation = footerSchema.safeParse(req.body);
    if (!validation.success) {
        const formatted = ZodError.flatten(result.error);
        return res.status(401).send({
            success: false,
            message: `Could not update Footer: ${formatted}`, 
        });           
        } 
    try {        
        const validatedData = validation.data
    const footer = await Footer.findByIdAndUpdate(id, validatedData, { new: true });
    if (!footer) return res.status(404).send(
        {   
            success: false,
            message: "Footer not found" 
        });
   
    res.status(200).send({
        success: true,
        message: 'Footer updated successfully!',
        data: footer
    })
  } catch (err) {
    console.error(err);
    res.status(500).send({
    success: false,
    message: 'Could not update Footer',
    error: err.message
       });
  }
}

module.exports = {addFooter, getFooter, updateFooter};
