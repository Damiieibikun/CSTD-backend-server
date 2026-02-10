const pagesModel = require("../models/pagesModel");
const { ZodError } = require('zod');
const { pageSchema } = require("../validators/formValidators");
const{cloudinary} = require('../config/config')

const updatePage = async (req, res) => {
  const { pageId } = req.params;
  if (!pageId) {
    return res.status(400).send({
      success: false,
      message: 'Page ID is required',
      data: null
    });
  }

  let parsedContent;
  try {
    parsedContent = typeof req.body.content === "string"
      ? JSON.parse(req.body.content)
      : req.body.content;
  } catch (err) {
    console.error('Error parsing content:', err);
    return res.status(400).send({
      success: false,
      message: 'Invalid JSON in content',
      data: null
    });
  }

  if (!parsedContent || typeof parsedContent !== 'object') {
    return res.status(400).send({
      success: false,
      message: 'Content must be a valid object',
      data: null
    });
  }

  try {
    const page = await pagesModel.findOne({ pageId });

    if (!page) {
      return res.status(404).send({
        success: false,
        message: 'Page not found',
        data: null
      });
    }

    const updatedContent = { ...page.content };
    const imagesToDelete = []; // Track images to delete from Cloudinary

    for (const sectionKey in parsedContent) {
      const sectionValue = parsedContent[sectionKey];

      if (sectionValue === null || (typeof sectionValue === 'object' && sectionValue.delete)) {
        // If section is being deleted, collect its images for cleanup
        if (updatedContent[sectionKey]?.images) {
          imagesToDelete.push(...updatedContent[sectionKey].images
            .filter(img => img.public_id) // Only delete images with public_id (from Cloudinary)
            .map(img => img.public_id)
          );
        }

        try {
            const folderPath = `pages/${pageId}/${sectionKey}`;

            // Delete all resources in that folder
            await cloudinary.api.delete_resources_by_prefix(folderPath);

            // Then delete the folder itself
            await cloudinary.api.delete_folder(folderPath);

            console.log(`🗑️ Deleted Cloudinary folder: ${folderPath}`);
          } catch (err) {
            console.error(`⚠️ Failed to delete folder for section ${sectionKey}:`, err.message);
          }
        delete updatedContent[sectionKey];
      } else if (typeof sectionValue === 'object' && !Array.isArray(sectionValue)) {
        // Initialize section if it doesn't exist
        if (!updatedContent[sectionKey]) {
          updatedContent[sectionKey] = {};
        }

        const currentImages = updatedContent[sectionKey].images || [];
        const hasNewFiles = req.files && req.files.some(file => 
          file.fieldname === `${sectionKey}_images`
        );

        let finalImages = [];

        // Handle deleted images first
        const deletedImages = sectionValue.deletedImages || [];
        if (deletedImages.length > 0) {
         
          deletedImages.forEach(img => {
            if (img.public_id) {
              imagesToDelete.push(img.public_id);
              console.log(`📋 Marked for deletion: ${img.url} (${img.public_id})`);
            }
          });
        }

        // Handle existing images that should be preserved
        if (hasNewFiles || deletedImages.length > 0) {         
          // Check if frontend is sending keepExistingImages flag or existing image URLs
          const keepExistingImages = sectionValue.keepExistingImages || false;
          const existingImageUrls = sectionValue.existingImages || [];
          
          if (keepExistingImages && existingImageUrls.length > 0) {
            // Keep only the existing images that are in the frontend's list
            finalImages = currentImages.filter(img => 
              existingImageUrls.includes(img.url)
            );
           
          } else if (hasNewFiles) {
            // Replace all existing images - mark all current images for deletion
            const imagesToDeleteFromSection = currentImages.filter(img => img.public_id);
            imagesToDelete.push(...imagesToDeleteFromSection.map(img => img.public_id));
            finalImages = []; // Start with empty array for new images
           
          } else {
            // Just deleting images, no new files
            finalImages = currentImages.filter(img => 
              !deletedImages.some(delImg => delImg.url === img.url)
            );
           
          }

          // Process new image uploads
          const sectionFiles = req.files.filter(file => 
            file.fieldname === `${sectionKey}_images`
          );

          for (const file of sectionFiles) {
            try {
             
              let uploadResult;

              // METHOD 1: Try uploading from file path first
              if (file.path) {
                const fs = require('fs');
                if (fs.existsSync(file.path)) {
                 
                  uploadResult = await cloudinary.uploader.upload(file.path, {
                    folder: `pages/${pageId}/${sectionKey}`,
                    resource_type: 'image',
                    public_id: `${sectionKey}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    transformation: [
                      { width: 1200, height: 800, crop: 'limit', quality: 'auto' }
                    ]
                  });

                  // Clean up temp file
                  fs.unlinkSync(file.path);
                } else {
                  throw new Error(`File does not exist at path: ${file.path}`);
                }
              } 
              // METHOD 2: Upload from buffer if path doesn't work
              else if (file.buffer) {
                
                
                // Convert buffer to base64 data URI
                const b64 = Buffer.from(file.buffer).toString("base64");
                const dataURI = "data:" + file.mimetype + ";base64," + b64;
                
                uploadResult = await cloudinary.uploader.upload(dataURI, {
                  folder: `pages/${pageId}/${sectionKey}`,
                  resource_type: 'image',
                  public_id: `${sectionKey}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                  transformation: [
                    { width: 1200, height: 800, crop: 'limit', quality: 'auto' }
                  ]
                });
              } else {
                throw new Error('Neither file path nor buffer available');
              }

              finalImages.push({
                url: uploadResult.secure_url,
                public_id: uploadResult.public_id
              });              
            } catch (uploadError) {
              console.error('Error uploading file:', uploadError);
              
              // Clean up any successfully uploaded images from this batch
              for (const img of finalImages) {
                if (img.public_id) {
                  try {
                    await cloudinary.uploader.destroy(img.public_id);
                  } catch (cleanupError) {
                    console.error('Error cleaning up uploaded image:', cleanupError);
                  }
                }
              }
              
              return res.status(500).send({
                success: false,
                message: `Failed to upload image: ${uploadError.message}`,
                data: null
              });
            }
          }

        } else {       
          
          const deletedImages = sectionValue.deletedImages || [];
          if (deletedImages.length > 0) {
            // Handle deletions without new uploads
            finalImages = currentImages.filter(img => 
              !deletedImages.some(delImg => delImg.url === img.url)
            );
           
          } else {
            // No changes to images at all
            finalImages = currentImages;
           
          }
        }

        // Update section with final content
        updatedContent[sectionKey] = {
          ...updatedContent[sectionKey],
          ...sectionValue,
          images: finalImages
        };

        // Remove helper properties that shouldn't be stored
        delete updatedContent[sectionKey].keepExistingImages;
        delete updatedContent[sectionKey].existingImages;
        delete updatedContent[sectionKey].deletedImages;
      }
    }

    // Delete old images from Cloudinary before saving
    if (imagesToDelete.length > 0) {
     
      
      const deletePromises = imagesToDelete.map(async (publicId) => {
        try {
          const result = await cloudinary.uploader.destroy(publicId);
          
          return { publicId, success: true, result };
        } catch (error) {
        
          return { publicId, success: false, error: error.message };
        }
      });

      const deleteResults = await Promise.allSettled(deletePromises);
      
      // Log results
      deleteResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const { publicId, success } = result.value;
          if (!success) {
            console.warn(`Failed to delete ${publicId}: ${result.value.error}`);
          }
        } else {
          console.error(`Delete promise failed for ${imagesToDelete[index]}:`, result.reason);
        }
      });
    }

    // Save the updated page
    page.content = updatedContent;
    await page.save();

    return res.status(200).send({
      success: true,
      message: 'Page updated successfully!',
      content: page.content,
    });
    
  } catch (err) {
    console.error('Error updating page:', err);
    return res.status(500).send({
      success: false,
      message: 'Could not update page',
      data: err.message,
    });
  }
};

const getPages = async (req, res) => {
    try {
        const{pageId} = req.params

        if(!pageId) return res.status(401).send({
            success: false,
            message: 'Page ID is required',
            data: null
        })
        const foundPage = await pagesModel.findOne({pageId: pageId})
        if(!foundPage) return res.status(404).send({
            success: false,
            message: 'Page Not Found',
            data: null
        })
         res.status(200).send({
            success: true,
            message: 'Page Fetched successfully!',
            data: {
               id: foundPage._id,
               content: foundPage.content
            }
        })
    } catch (err) {
         res.status(500).send({
            success: false,
            message: 'Could not fetch research page',
            data: err.message
       });
    }
}

const createPageLinks = async (req, res) => {
const validation = pageSchema.safeParse(req.body);
    if (!validation.success) {
        const formatted = ZodError.flatten(result.error);
        return res.status(401).send({
            success: false,
            message: `Could not Create Page: ${formatted}`, 
            data: null
        });           
    } 
      try {
    const { pageId, icon, order, ...rest } = validation.data;

    const foundPage = await pagesModel.findOne({ pageId });
    if (foundPage) {
      return res.status(400).send({
        success: false,
        message: 'Page already exists',
        data: null
      });
    }

    // Determine order: if provided use it, otherwise append to end
    let nextOrder = order;
    if (typeof nextOrder !== 'number') {
      const count = await pagesModel.countDocuments();
      nextOrder = count;
    }

    const pageData = {
      pageId,
      icon: icon || 'fa:FaRegFileCode',
      order: nextOrder,
      ...rest,
    };

    const createdPage = new pagesModel(pageData);
    await createdPage.save();

    res.status(201).send({
      success: true,
      message: 'Link created successfully!',
      data: createdPage,
    });
  } catch (err) {
         console.error(err);
            res.status(500).send({
            success: false,
            message: 'Could not Create page',
            data: err.message
       });
    }
}

const getPageLinks = async (req, res) => {
    try {
        const response = await pagesModel.find().sort({ order: 1, createdAt: 1 })
        res.status(200).send({
            success: true,
            message: 'Page Links Fetched successfully',
            data: response
        })
    } catch (err) {
        console.error(err);
            res.status(500).send({
            success: false,
            message: 'Could not Create page',
            data: err.message
       });
    }
}

const updatePageLinks = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(401).send({
      success: false,
      message: 'ID is required',
      data: null
    });
  }

  const validation = pageSchema.safeParse(req.body);

 if (!validation.success) {
        const formatted = ZodError.flatten(result.error);
        return res.status(401).send({
            success: false,
            message: `Could not Create Link: ${formatted}`, 
            data: null
        });           
    } 

  try {
    const updatedPage = await pagesModel.findByIdAndUpdate(
      id,
       { $set: validation.data },
      { new: true }
    );

    if (!updatedPage) {
      return res.status(404).send({
        success: false,
        message: 'Link not found',
        data: null
      });
    }

    res.status(200).send({
      success: true,
      message: 'Link updated successfully!',
      data: updatedPage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: 'Could not update Link',
      data: err.message,
    });
  }
};

const deletePage = async (req, res) => {
    try {
        const {id} = req.params
        if(!id) return res.status(401).send({
            success: false,
            message: 'Could not delete Page',
            data: null
        })

        const deletedPage = await pagesModel.findByIdAndDelete(id)
        if(!deletedPage) return res.status(404).send({
            success: false,
            message: 'Page not found!',
            data: null
        })

        res.status(200).send({
            success: true,
            message: 'Page deleted successfully!',
            data: null
        })
    } catch (err) {
       console.error(err);
    res.status(500).send({
      success: false,
      message: 'Could not delete page',
      data: err.message,
    });  
    }
}

module.exports = {createPageLinks, getPageLinks, updatePageLinks, getPages, updatePage, deletePage}