const projectsModel = require("../models/projectsModel");
const {projectsSchema}  = require ("../validators/formValidators");
const { ZodError } = require('zod');
const addUpcomingProject = async (req, res) => {
    
        const validation = projectsSchema.safeParse(req.body);
    
        if (!validation.success) {
            const formatted = ZodError.flatten(result.error);
            return res.status(401).send({
                success: false,
                message: `Could not add project: ${formatted}`, 
                data: null
            });           
        }  
    try {
        const upcomingProject = {...validation.data, category: 'upcoming'}
         const createdProject = new projectsModel(upcomingProject)
        await createdProject.save()

        res.status(201).send({
            success: true,
            message: 'Project added successfully!',
            data: null
        })
    } catch (error) {
         res.status(500).send({
            success: false,
            message: 'Could not add Project',
            data: null
        })
    }
}
const addPastProject = async (req, res) => {
    
        const validation = projectsSchema.safeParse(req.body);
    
        if (!validation.success) {
            const formatted = ZodError.flatten(result.error);
            return res.status(401).send({
                success: false,
                message: `Could not add project: ${formatted}`,
                data: null 
            });           
        }  
    try {
        const pastProject = {...validation.data, category: 'past'}
         const createdProject = new projectsModel(pastProject)
        await createdProject.save()

        res.status(201).send({
            success: true,
            message: 'Project added successfully!',
            data: null
        })
    } catch (error) {
         res.status(500).send({
            success: false,
            message: 'Could not add Project',
            data: null
        })
    }
}

const getProjects = async (req, res) => {
    const{cat} = req.query
    
    try {
        let projects;
        if(cat){
            projects = await projectsModel.find({category: cat})
            if(!projects) return res.status(404).send({
                success: false,
                message: 'Projects not found',
                data: null
            })
        }
        else{
             projects = await projectsModel.find({})            
        }
       
        
         res.status(200).send({
            success: true,
            message: 'Project fetched successfully!',
            data: projects
        })
    } catch (error) {
         res.status(500).send({
            success: false,
            message: 'Could not get Projects',
            data: null
        })
    }
}

const deleteProject = async (req, res) => {
    const{id} = req.params    
    try {
         const deleteproject = await projectsModel.findByIdAndDelete(id)
        if(!deleteproject) return res.status(404).send({
            success: false,
            message: 'Project not found',
            data: null
        })
        
         res.status(200).send({
            success: true,
            message: 'Project deleted successfully!',
            data: null
           
        })
    } catch (error) {
         res.status(500).send({
            success: false,
            message: 'Could not delete project',
            data: null
        })
    } 
}

const editProject = async (req, res) => {
    
const validation = projectsSchema.safeParse(req.body);

    if (!validation.success) {
        const formatted = ZodError.flatten(result.error);
        return res.status(401).send({
            success: false,
            message: `Could not edit project: ${formatted}`, 
            data: null
        });           
    }  
    try {
        const {id} = req.params
        if(!id) return res.status(401).send({
            success: false,
            message: 'ID is required',
            data: null
        })

        const editProject = await projectsModel.findByIdAndUpdate(id, validation.data, {new: true})
        if(!editProject) return res.status(404).send({
            success: false,
            message: 'Project not found',
            data: null
        })
        

        res.status(200).send({
            success: true,
            message: 'Project edited successfully!',
            data: null
        })
    } catch (error) {
         res.status(500).send({
            success: false,
            message: 'Could not edit Project',
            data: null
        })
    }
}

module.exports = {addUpcomingProject, getProjects, addPastProject, editProject, deleteProject}