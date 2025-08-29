const Footer = require('../models/footerModel');
const { ZodError, json } = require('zod');
const { footerSchema } = require('../validators/formValidators');
const footerModel = require('../models/footerModel');
const{cloudinary} = require('../config/config')
const uploadToCloudinary = require('../middlewares/cloudinary')
// Create footer
const addFooter = async (req, res) => {
const objData = JSON.parse(req.body.data)
const validation = footerSchema.safeParse(objData);
   if (!validation.success) {
        const formatted = validation.error.flatten();
        return res.status(400).send({
            success: false,
            message: `Could not add Footer: ${JSON.stringify(formatted)}`,
            data: formatted
        });           
    } 
    try {    

    let logoResult;    
           
    if (req.file) {
        logoResult = await uploadToCloudinary(
            req.file.buffer,
            "logo"
            );                     
    }
    const newFooter = {...validation.data, logo: logoResult.url, public_id: logoResult.public_id}      
    const footer = new Footer(newFooter);

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
    data: err.message
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
    data: err.message
       });
    }
}
// Update footer
const updateFooter = async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
        return res.status(400).send({
            success: false,
            message: 'ID is required',
            data: null
        });
    } 

    const objData = JSON.parse(req.body.data)
    
    const validation = footerSchema.safeParse(objData);
    
    if (!validation.success) {
        const formatted = validation.error.flatten();
        return res.status(400).send({
            success: false,
            message: `Could not update Footer: ${JSON.stringify(formatted)}`,
            data: formatted
        });           
    } 
    
    try {          
          
        const existingfooter = await Footer.findById(id);
        
        if (!existingfooter) {
            return res.status(404).send({   
                success: false,
                message: "Footer not found",
                data: null 
            });
        }

        let currentLogo = existingfooter.logo
        let currentPublicID = existingfooter.public_id
        let logoResult;
       
        if (req.file) {
                  logoResult = await uploadToCloudinary(
                        req.file.buffer,
                        "logo"
                      );
                      
             if(existingfooter.public_id){
                await cloudinary.uploader.destroy(existingfooter.public_id);
            }

            currentLogo = logoResult.url
            currentPublicID = logoResult.public_id

            }

            const footer = {...validation.data, logo: currentLogo, public_id: currentPublicID}
            const editedFooter = await footerModel.findByIdAndUpdate(id, footer, {new: true})
        res.status(200).send({
            success: true,
            message: 'Footer updated successfully!',
            data: editedFooter
        });
        
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send({
            success: false,
            message: 'Could not update Footer',
            data: err.message
        });
    }
};

module.exports = {addFooter, getFooter, updateFooter};

