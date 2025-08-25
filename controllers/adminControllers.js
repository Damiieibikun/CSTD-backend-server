
const bcryptjs = require('bcryptjs')
const { ZodError } = require('zod');
const adminModel = require("../models/adminModel")
const { registerSchema, editAdminSchema, loginSchema, changePasswordSchema } = require('../validators/formValidators')
const jwt = require("jsonwebtoken");


const createAdmin = async (req, res) => {


    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
        const formatted = ZodError.flatten(result.error);
        return res.status(401).send({
            success: false,
            message: `Could not register Admin: ${formatted}`,
        });
    }

    try {
        const { email, role } = validation.data;
        const adminFound = await adminModel.findOne({ email: email })
        if (adminFound) return res.status(401).send({
            success: false,
            message: 'Admin already exists'
        })

        const encrypted_pass = await bcryptjs.hash(validation.data.password, 12);
        const new_admin = { ...validation.data, password: encrypted_pass, role: role }
        const createdadmin = new adminModel(new_admin)
        await createdadmin.save()

        res.status(201).send({
            success: true,
            message: 'Admin Created successfully!'
        })

    } catch (err) {
        console.error(err);
        res.status(500).send({
            success: false,
            message: 'Could not create Admin',
            error: err.message
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
        });
    }

    try {
        const { email } = validation.data;
        const adminFound = await adminModel.findOne({ email: email })
        if (adminFound) return res.status(401).send({
            success: false,
            message: 'Admin already exists'
        })

        const encrypted_pass = await bcryptjs.hash(validation.data.password, 12);
        const new_admin = { ...validation.data, password: encrypted_pass, role: 'webmaster', status: 'approved', approved: true }
        const createdadmin = new adminModel(new_admin)
        await createdadmin.save()

        res.status(201).send({
            success: true,
            message: 'Admin Created successfully!'
        })

    } catch (err) {
        console.error(err);
        res.status(500).send({
            success: false,
            message: 'Could not create Admin',
            error: err.message
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
        });
    }

    try {
        const { email, password } = validation.data;
        const adminFound = await adminModel.findOne({ email: email })
        if (!adminFound) return res.status(404).send({
            success: false,
            message: 'Admin not Found'
        })

        const checkPassword = await bcryptjs.compare(password, adminFound.password)
        if (!checkPassword) {
            return res.status(401).send({
                success: false,
                message: "Incorrect Password!",
            })
        };

        if (!adminFound.approved) return res.status(401).send({
            success: false,
            message: "*Unable to log in, Please Contact Admin for further assistance",
        });

        const token = jwt.sign(
            { user_id: adminFound.user_id, email: adminFound.email, role: adminFound.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

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
            },
            token: token,
        })

    } catch (err) {
        console.error(err);
        res.status(500).send({
            success: false,
            message: 'Error in logging in Admin',
            error: err.message
        });
    }

}

const changePwdAdmin = async (req, res) => {
    const validation = changePasswordSchema.safeParse(req.body);

    if (!validation.success) {
        const formatted = ZodError.flatten(result.error);
        return res.status(401).send({
            success: false,
            message: `Could not change Admin password: ${formatted}`,
        });
    }

    try {
        const { id, currentPassword, newPassword } = validation.data

        if (!id) return res.status(401).send({
            success: false,
            message: 'ID is required'
        })

        const found_admin = await adminModel.findById(id)
        const checkPassword = await bcryptjs.compare(currentPassword, found_admin.password)
        if (!checkPassword) {
            return res.status(401).send({
                success: false,
                message: "Invalid Password!",
            })
        };

        const encrypted_pass = await bcryptjs.hash(newPassword, 12);
        const updateadminPassword = await adminModel.findByIdAndUpdate(id, { password: encrypted_pass }, { new: true })

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
            error: error.message
        })
    }
}
const editAdmin = async (req, res) => {
    const validation = editAdminSchema.safeParse(req.body);

    if (!validation.success) {
        const formatted = ZodError.flatten(result.error);
        return res.status(401).send({
            success: false,
            message: `Could not edit Admin details: ${formatted}`,
        });
    }

    try {
        const { id, firstname, lastname, email, phone } = validation.data

        if (!id) return res.status(401).send({
            success: false,
            message: 'ID is required'
        })

        const found_admin = await adminModel.findById(id)

        if (!found_admin) {
            return res.status(401).send({
                success: false,
                message: "Admin Not Found or does not exist!",
            })
        };

        const updateAdmin = await adminModel.findByIdAndUpdate(id, { firstname, lastname, email, phone }, { new: true })

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
            error: error.message
        })
    }
}

const fetchAdmins = async (req, res) => {
    try {
        const admins = await adminModel.find({ role: { $ne: 'webmaster' } }, { password: 0, __v: 0 });
        res.status(200).send({
            success: true,
            message: 'Admin Fetched successfully!',
            data: admins
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not Fetch admin details',
            error: error.message
        })
    }
}



const approveAdmin = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) return res.status(401).send({
            success: false,
            message: "Admin id is required"
        })


        const found_admin = await adminModel.findById(id);

        if (!found_admin) return res.status(404).send({
            success: false,
            message: 'Admin does not exist'
        })
        if (found_admin.role === 'webmaster') {
            return res.status(401).send({
                success: false,
                message: 'Admin cannot be approved'
            });
        }


        const approve_admin = await adminModel.findByIdAndUpdate(id, { approved: true, status: 'approved' }, { new: true })
        res.status(200).send({
            success: true,
            message: "Admin approved successfully",
            data: approve_admin
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in approving Admin",
            error: error.message
        })
    }
}
const denyAdmin = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) return res.status(401).send({
            success: false,
            message: "Admin id is required"
        })


        const found_admin = await adminModel.findById(id);

        if (!found_admin) return res.status(404).send({
            success: false,
            message: 'Admin does not exist'
        })
        if (found_admin.role === 'webmaster') {
            return res.status(401).send({
                success: false,
                message: 'Admin cannot be Denied'
            });
        }


        const deny_admin = await adminModel.findByIdAndUpdate(id, { approved: false, status: 'denied' }, { new: true })
        res.status(200).send({
            success: true,
            message: "Admin Denied successfully",
            data: deny_admin
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in denying Admin",
            error: error.message
        })
    }
}


const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) return res.status(401).send({
            success: false,
            message: 'Admin ID is required'
        })

        const deleteAdmin = await adminModel.findByIdAndDelete(id)
        if (!deleteAdmin) return res.status(404).send({
            success: false,
            message: 'Admin not Found'
        })

        res.status(200).send({
            success: true,
            message: 'Deleted Successfully!',
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not delete Admin',
            error: error.message
        })
    }
}

module.exports = {
    createAdmin, createWebmaster, loginAdmin, changePwdAdmin,
    fetchAdmins, approveAdmin, denyAdmin, deleteAdmin, editAdmin
}