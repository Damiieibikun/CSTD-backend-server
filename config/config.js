require('dotenv').config({ debug: true })
const cloudinary = require('cloudinary').v2

const config =  {
    port: process.env.PORT,
    db_url: process.env.DB_URL,
}



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET

})

module.exports = {cloudinary, config}