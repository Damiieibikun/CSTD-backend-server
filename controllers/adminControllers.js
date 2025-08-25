
const bcryptjs = require('bcryptjs')
const { ZodError } = require('zod');
const adminModel = require("../models/adminModel")
const {registerSchema, editAdminSchema, loginSchema, changePasswordSchema} = require('../validators/formValidators')


const createAdmin = async (req, res) => { 
   
     
        const validation = registerSchema.safeParse(req.body);

        if (!validation.success) {
            const formatted = ZodError.flatten(result.error);
            return res.status(401).send({
                success: false,
                message: `Could not register Admin: ${formatted}`,
                data: null
            });           
        }        

        try {
        const {email, role} = validation.data; 
        const adminFound = await adminModel.findOne({email: email})
        if(adminFound) return res.status(401).send({
            success: false,
            message: 'Admin already exists',
            data: null
        })
            
        const encrypted_pass = await bcryptjs.hash(validation.data.password, 12);
        const new_admin = {...validation.data, password:encrypted_pass, role: role}
        const createdadmin = new adminModel(new_admin)
        await createdadmin.save()

        res.status(201).send({
            success: true,
            message: 'Admin Created successfully!',
            data: null
        })
           
        } catch (err) {
            console.error(err);
            res.status(500).send({
            success: false,
            message: 'Could not create Admin',
            data: err.message
       });
        }       
    
}
const createWebmaster = async (req, res) => { 
     
        const validation = registerSchema.safeParse(req.body);

        if (!validation.success) {
            const formatted = ZodError.flatten(result.error);
            return res.status(401).send({
                success: false,
                message: `Could not register Admin: ${formatted}`, 
                data: null
            });           
        }        

        try {
        const {email} = validation.data; 
        const adminFound = await adminModel.findOne({email: email})
        if(adminFound) return res.status(401).send({
            success: false,
            message: 'Admin already exists',
            data: null
        })
            
        const encrypted_pass = await bcryptjs.hash(validation.data.password, 12);
        const new_admin = {...validation.data, password:encrypted_pass, role: 'webmaster', status: 'approved', approved: true}
        const createdadmin = new adminModel(new_admin)
        await createdadmin.save()

        res.status(201).send({
            success: true,
            message: 'Admin Created successfully!',
            data: null
        })
           
        } catch (err) {
            console.error(err);
            res.status(500).send({
            success: false,
            message: 'Could not create Admin',
            data: err.message
       });
        }       
    
}

const loginAdmin = async (req, res) => {
    const validation = loginSchema.safeParse(req.body);

        if (!validation.success) {
            const formatted = ZodError.flatten(result.error);
            return res.status(401).send({
                success: false,
                message: `Could not login Admin: ${formatted}`, 
                data: null
            });           
        }

    try {
        const {email, password} = validation.data; 
        const adminFound = await adminModel.findOne({email: email})
        if(!adminFound) return res.status(404).send({
            success: false,
            message: 'Admin not Found',
            data: null
        })

        const checkPassword = await bcryptjs.compare(password, adminFound.password)
        if(!checkPassword){
            return res.status(401).send({
                success: false,
                message: "Incorrect Password!",
                data: null
            })
        };
                  
        if(!adminFound.approved) return res.status(401).send({
            success: false,
            message: "*Pending Approval, Please Contact Admin for further assistance",
            data: null
        })

        res.status(200).send({
            success: true,
            message: 'Logged in successfully!',
            data: {
                id: adminFound._id,
                firstname: adminFound.firstname,
                lastname: adminFound.lastname,
                role: adminFound.role,
                email: adminFound.email,
                phone: adminFound.phone                
            }
        })
           
    } catch (err) {
        console.error(err);
        res.status(500).send({
        success: false,
        message: 'Error in logging in Admin',
        data: err.message
    });
    }  
    
}

const changePwdAdmin = async(req, res) =>{
     const validation = changePasswordSchema.safeParse(req.body);

        if (!validation.success) {
            const formatted = ZodError.flatten(result.error);
            return res.status(401).send({
                success: false,
                message: `Could not change Admin password: ${formatted}`, 
                data: null
            });           
        }

    try {       
        const{id, currentPassword, newPassword} = validation.data
      
        if(!id) return res.status(401).send({
            success:false,
            message: 'ID is required',
            data: null
        })        

        const found_admin = await adminModel.findById(id)
        const checkPassword = await bcryptjs.compare(currentPassword, found_admin.password)
        if(!checkPassword){
            return res.status(401).send({
                success: false,
                message: "Invalid Password!",
                data: null
            })
        };

        const encrypted_pass = await bcryptjs.hash(newPassword, 12);
        const updateadminPassword = await adminModel.findByIdAndUpdate(id, {password:encrypted_pass}, {new:true})

        res.status(200).send({
            success: true,
            message: 'Password updated successfully!',
            data: {
                id: updateadminPassword._id,
                firstname: updateadminPassword.firstname,
                lastname: updateadminPassword.lastname,
                role: updateadminPassword.role,
                email: updateadminPassword.email,
                phone: updateadminPassword.phone
            }
        })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not change admin password',
            data: error.message
        })
    }
}
const editAdmin = async(req, res) =>{
     const validation = editAdminSchema.safeParse(req.body);

        if (!validation.success) {
            const formatted = ZodError.flatten(result.error);
            return res.status(401).send({
                success: false,
                message: `Could not edit Admin details: ${formatted}`,
                data: null 
            });           
        }

    try {       
        const{id, firstname, lastname, email, phone} = validation.data
      
        if(!id) return res.status(401).send({
            success:false,
            message: 'ID is required',
            data: null
        })        

        const found_admin = await adminModel.findById(id)
        
        if(!found_admin){
            return res.status(401).send({
                success: false,
                message: "Admin Not Found or does not exist!",
                data: null
            })
        };
        
        const updateAdmin = await adminModel.findByIdAndUpdate(id, {firstname, lastname, email, phone}, {new:true})

        res.status(200).send({
            success: true,
            message: 'Admin updated successfully!',
            data: {
                id: updateAdmin._id,
                firstname: updateAdmin.firstname,
                lastname: updateAdmin.lastname,
                role: updateAdmin.role,
                email: updateAdmin.email,
                phone: updateAdmin.phone
            }
        })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not change admin password',
            data: error.message
        })
    }
}

const fetchAdmins = async (req, res) => {
    try {
        const admins = await adminModel.find({role:{ $ne: 'webmaster' }},{password:0, __v:0});
        res.status(200).send({
            success: true,
            message: 'Admin Fetched successfully!',
            data: admins
        })
    } catch (error) {
         res.status(500).send({
            success: false,
            message: 'Could not Fetch admin details',
            data: error.message
        })
    }
}



const approveAdmin = async (req, res) => {
    try {
        const {id} = req.params        
       
        if(!id) return res.status(401).send({
            success: false,
            message: "Admin id is required",
            data: null
        })      

       
        const found_admin = await adminModel.findById(id);

        if(!found_admin) return res.status(404).send({
            success: false,
            message: 'Admin does not exist',
            data: null
        })
        if (found_admin.role === 'webmaster') {
            return res.status(401).send({
                success: false,
                message: 'Admin cannot be approved',
                data: null
            });
        }       


        const approve_admin = await adminModel.findByIdAndUpdate(id, {approved: true, status:'approved'}, {new: true})
        res.status(200).send({
            success: true,
            message: "Admin approved successfully",
            data: approve_admin
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in approving Admin",
            data: error.message
        })
    }
}
const denyAdmin = async (req, res) => {
    try {
        const {id} = req.params        
       
        if(!id) return res.status(401).send({
            success: false,
            message: "Admin id is required",
            data: null
        })      

       
        const found_admin = await adminModel.findById(id);

        if(!found_admin) return res.status(404).send({
            success: false,
            message: 'Admin does not exist',
            data: null
        })
        if (found_admin.role === 'webmaster') {
            return res.status(401).send({
                success: false,
                message: 'Admin cannot be Denied',
                data: null
            });
        }       


        const deny_admin = await adminModel.findByIdAndUpdate(id, {approved: false, status:'denied'}, {new: true})
        res.status(200).send({
            success: true,
            message: "Admin Denied successfully",
            data: deny_admin            
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in denying Admin",
            data: error.message
        })
    }
}


const deleteAdmin = async (req, res) => {
    try {
        const {id} = req.params

        if(!id) return res.status(401).send({
            success: false,
            message: 'Admin ID is required',
            data: null
        })

        const deleteAdmin = await adminModel.findByIdAndDelete(id)
        if(!deleteAdmin) return res.status(404).send({
            success: false,
            message: 'Admin not Found',
            data: null
        })

        res.status(200).send({
            success: true,
            message: 'Deleted Successfully!',
            data: null           
        })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not delete Admin',
            data: error.message
        })
    }
}

module.exports = {createAdmin, createWebmaster, loginAdmin, changePwdAdmin, 
    fetchAdmins, approveAdmin, denyAdmin, deleteAdmin, editAdmin}