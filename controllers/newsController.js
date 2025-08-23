const newsModel = require("../models/newsModel");
const {newsSchema}  = require ("../validators/formValidators");
const { ZodError } = require('zod');
const{cloudinary} = require('../config/config')

// Function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder) => {
return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
    }).end(buffer);
});
};



const postNews = async (req, res) => {
    
    const textData = {
        title: req.body.title,
        date: req.body.date,
        brief: req.body.brief,
        content: req.body.content
    };
    
    const validation = newsSchema.omit({ media: true }).safeParse(textData);
    
    if (!validation.success) {
        const formatted = validation.error.flatten();
        return res.status(400).send({
            success: false,
            message: 'Could not post news',
            error: formatted
        });
    }

    try { 
        if (!req.files || req.files.length === 0) {
            return res.status(400).send({
                success: false,
                message: 'Missing required files: media'
            });
        }
        const mediaFiles = req.files.media;
            
        let uploadedImages = await Promise.all(
            mediaFiles.map(async (file) => {
                const result = await uploadToCloudinary(file.buffer, 'news-arrayposts');
                
                return {
                    url: result.secure_url,
                    public_id: result.public_id,
                    type: file.mimetype.startsWith('image/') ? 'image' : 'video',
                    thumbnail: file.mimetype.startsWith('image/') 
                        ? result.secure_url
                        : result.secure_url
                };
            })
        );

        const createdNews = new newsModel({
            ...validation.data,
            media: uploadedImages
        });
        
        await createdNews.save();

        res.status(201).send({
            success: true,
            message: 'News Created successfully!'
        });
        
    } catch (error) {
        console.error('Error creating news:', error);
        res.status(500).send({
            success: false,
            message: 'Could not post news',
           
        });
    }
};
const getNews =  async (req, res) => {

    try {
    const news = await newsModel.find({})

        res.status(200).send({
            success: true,
            message: 'News fetched successfully!',
            data: news
        })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not fetch news'
        })
    }
}
const deleteNews =  async (req, res) => {

    try {
        const {id} = req.params
    const deletenews = await newsModel.findByIdAndDelete(id)
        if(!deletenews) return res.status(404).send({
            success: false,
            message: 'News not found'
        })

        for (const ids of deletenews.media) {
            await cloudinary.uploader.destroy(ids.public_id);       
        }

        res.status(200).send({
            success: true,
            message: 'News Deleted successfully!',           
        })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not delete news'
        })
    }
}


const editNews = async (req, res) => {
   
    const textData = {
        title: req.body.title,
        date: req.body.date,
        brief: req.body.brief,
        content: req.body.content
    };
    
    // Validate text data only
    const validation = newsSchema.omit({ media: true }).safeParse(textData);
    if (!validation.success) {
        const formatted = validation.error.flatten(); // ✅ Fixed variable reference
        return res.status(400).send({
            success: false,
            message: 'Could not edit news',
            error: formatted
        });           
    } 

    try {
        const { id } = req.params;
        
        // Find existing news
        const existingNews = await newsModel.findById(id);
        if (!existingNews) {
            return res.status(404).send({
                success: false,
                message: 'News not found'
            });
        }

        // Prepare update data
        let updateData = { ...validation.data };

        // Handle media files if new ones are uploaded
        if (req.files && req.files.media && req.files.media.length > 0) {
            console.log('Processing new media files for edit...');
            
            const mediaFiles = req.files.media;
            
            // Upload new media files
            let uploadedImages = await Promise.all(
                mediaFiles.map(async (file) => {
                    console.log('Processing file:', file.originalname);
                    
                    const result = await uploadToCloudinary(file.buffer, 'news-arrayposts');
                    
                    return {
                        url: result.secure_url,
                        public_id: result.public_id,
                        type: file.mimetype.startsWith('image/') ? 'image' : 'video',
                        thumbnail: file.mimetype.startsWith('image/') 
                            ? result.secure_url
                            : result.secure_url
                    };
                })
            );

            console.log('New uploaded images:', uploadedImages);
           updateData.media = [...existingNews.media, ...uploadedImages];
            if (existingNews.media && existingNews.media.length > 0) {
                for (const oldMedia of existingNews.media) {
                    if (oldMedia.public_id) {
                        await cloudinary.uploader.destroy(oldMedia.public_id);
                    }
                }
            }
        } else {
            // No new files uploaded, keep existing media
            console.log('No new media files, keeping existing media');
            const mediaFiles = JSON.parse(req.body.media);
            const existingIds = existingNews.media.map(m => m.public_id);
            const remainingIds = mediaFiles.map(m => m.public_id);
            console.log(existingIds)
            console.log(remainingIds)

          
            const toDelete = existingIds.filter(id => !remainingIds.includes(id));
           for (const oldMediaID of toDelete) {
                    await cloudinary.uploader.destroy(oldMediaID);
                    
                }
             updateData.media = mediaFiles
        }

        // Update the news
        const editedNews = await newsModel.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        );

        if (!editedNews) {
            return res.status(404).send({
                success: false,
                message: 'Could not edit news'
            });
        }

        res.status(200).send({
            success: true,
            message: 'News edited successfully!',
            data: editedNews // ✅ Return updated data
        });
        
    } catch (error) {
        console.error('Edit news error:', error);
        res.status(500).send({
            success: false,
            message: 'Could not edit news',
            error: error.message
        });
    }
};


module.exports = {postNews, getNews, deleteNews, editNews}