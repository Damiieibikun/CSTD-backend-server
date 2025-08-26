const projectsModel = require("../models/projectsModel");
const {projectsSchema}  = require ("../validators/formValidators");
const { ZodError } = require('zod');
const{cloudinary} = require('../config/config')
const uploadToCloudinary = require('../middlewares/cloudinary')

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

  let imagePicResult;
  if (req.file) {   
    imagePicResult = await uploadToCloudinary(req.file.buffer, "project-images");
}

  const upcomingProject = {
    ...validation.data,
    category: "upcoming",
    image: {
      url: imagePicResult?.url || "",
      public_id: imagePicResult?.public_id || "",
    },
  };

  const createdProject = new projectsModel(upcomingProject);
  await createdProject.save();

  res.status(201).send({
    success: true,
    message: "Project added successfully!",
    data: createdProject,
  });
} catch (error) {
  res.status(500).send({
    success: false,
    message: "Could not add Project",
    data: error.message,
  
  });
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

  let imagePicResult;
  if (req.file) {   
    imagePicResult = await uploadToCloudinary(req.file.buffer, "project-images");
}

  const pastProject = {
    ...validation.data,
    category: "past",
    image: {
      url: imagePicResult?.url || "",
      public_id: imagePicResult?.public_id || "",
    },
  };

  const createdProject = new projectsModel(pastProject);
  await createdProject.save();

  res.status(201).send({
    success: true,
    message: "Project added successfully!",
    data: createdProject,
  });
} catch (error) {
  res.status(500).send({
    success: false,
    message: "Could not add Project",
    data: error.message,
  });
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

    if(!id) return res.status(400).send({
        success: false,
        message: 'ID is required',
        data: null
    })

    try {
         const foundproject = await projectsModel.findById(id)
                
         if(!foundproject) return res.status(404).send({
            success: false,
            message: 'Project not found',
            data: null
        })
      
        if (foundproject.image?.public_id) {
        await cloudinary.uploader.destroy(foundproject.image.public_id);
        }

        await projectsModel.findByIdAndDelete(id);       
        
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
    const formatted = ZodError.flatten(validation.error);
    return res.status(401).send({
      success: false,
      message: `Could not edit project: ${formatted}`,
      data: null,
    });
  }

  try {
    const { id } = req.params;
    if (!id) {
      return res.status(401).send({
        success: false,
        message: "ID is required",
        data: null,
      });
    }

    const foundProject = await projectsModel.findById(id);
    if (!foundProject) {
      return res.status(404).send({
        success: false,
        message: "Project not found",
        data: null,
      });
    }

    let imagePicResult;
    let image = { ...foundProject.image };

    // Case 1: User uploaded new image
    if (req.file) {
      imagePicResult = await uploadToCloudinary(
        req.file.buffer,
        "project-images"
      );
      if (foundProject.image?.public_id) {
        await cloudinary.uploader.destroy(foundProject.image.public_id);
      }
      image = {
        url: imagePicResult.url || "",
        public_id: imagePicResult.public_id || "",
      };
    }

    // Case 2: User explicitly removed image
    if (req.body.removeImage === "true") {
        
      if (foundProject.image?.public_id) {
        await cloudinary.uploader.destroy(foundProject.image.public_id);
      }
      image = {
        url: "",
        public_id: "",
      };
    }

    const editProject = {
      ...validation.data,
      image,
    };

    await projectsModel.findByIdAndUpdate(id, editProject, { new: true });

    res.status(200).send({
      success: true,
      message: "Project edited successfully!",
      data: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Could not edit Project",
      data: null,
    });
  }
};


module.exports = {addUpcomingProject, getProjects, addPastProject, editProject, deleteProject}