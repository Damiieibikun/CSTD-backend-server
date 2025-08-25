const publicationModel = require("../models/publicationsModel");
const {publicationSchema}  = require ("../validators/formValidators");
const { ZodError } = require('zod');

const addPublication = async (req, res) => {
     const validation = publicationSchema.safeParse(req.body);
    
        if (!validation.success) {
            const formatted = ZodError.flatten(result.error);
            return res.status(401).send({
                success: false,
                message: `Could not create publication: ${formatted}`, 
                data: null
            });           
        }  
    try {

         const publication = new publicationModel(validation.data)
        await publication.save()

        res.status(201).send({
            success: true,
            message: 'Publication added successfully!',
            data: null
        })
    } catch (error) {
         res.status(500).send({
            success: false,
            message: 'Could not add Publication',
            data: null
        })
    }
};


const getPublications = async (req, res) => {
    try {
         const publications = await publicationModel.find({})
            res.status(200).send({
            success: true,
            message: 'Publications fetched successfully!',
            data: publications
        })
    } catch (error) {
         res.status(500).send({
            success: false,
            message: 'Could not get Publications',
            data: null
        })
    }
};

const deletePublication = async (req, res) => {
    const{id} = req.params    
    try {
         const deletedpublication = await publicationModel.findByIdAndDelete(id)
        if(!deletedpublication) return res.status(404).send({
            success: false,
            message: 'Publication not found',
            data: null
        })
        
         res.status(200).send({
            success: true,
            message: 'Publication deleted successfully!',
            data: null
           
        })
    } catch (error) {
         res.status(500).send({
            success: false,
            message: 'Could not delete Publication',
            data: null
        })
    } 
};

const editPublication = async (req, res) => {
    const validation = publicationSchema.safeParse(req.body);

    if (!validation.success) {
        const formatted = ZodError.flatten(result.error);
        return res.status(401).send({
            success: false,
            message: `Could not edit publication: ${formatted}`, 
            data: null
        });           
    }  
        
    try {
        const{id} = req.params
         const editedpublication = await publicationModel.findByIdAndUpdate(id, validation.data, {new:true})
        if(!editedpublication) return res.status(404).send({
            success: false,
            message: 'Publication not found or could not be edited',
            data: null
        })
        
         res.status(200).send({
            success: true,
            message: 'Publication Edited successfully!',
           data: null
        })
    } catch (error) {
         res.status(500).send({
            success: false,
            message: 'Could not edit Publication',
            data: null
        })
    } 
};

module.exports = {addPublication, getPublications, editPublication, deletePublication}