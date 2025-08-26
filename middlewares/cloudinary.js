// Function to upload buffer to Cloudinary
const{cloudinary} = require('../config/config')
const uploadToCloudinary = (buffer, folder) => {
return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
    }).end(buffer);
});
};

module.exports = uploadToCloudinary