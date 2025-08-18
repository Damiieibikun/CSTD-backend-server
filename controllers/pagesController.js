const pagesModel = require("../models/pagesModel");
const { ZodError } = require('zod');
const { pageSchema } = require("../validators/formValidators");

const updatePage = async (req, res) => {
  const { pageId } = req.params;
  const { content } = req.body;

  if (!pageId) {
    return res.status(401).send({
      success: false,
      message: 'Page ID is required',
    });
  }

  if (!content || typeof content !== 'object') {
    return res.status(400).send({
      success: false,
      message: 'Content must be a valid object',
    });
  }

  try {
    const page = await pagesModel.findOne({ pageId: pageId });

    if (!page) {
      return res.status(404).send({
        success: false,
        message: 'Page not found',
      });
    }

    const updatedContent = { ...page.content };

    // Handle each section update
    for (const sectionKey in content) {
      const sectionValue = content[sectionKey];

      if (sectionValue === null || (typeof sectionValue === 'object' && sectionValue.delete)) {
        // Delete section
        delete updatedContent[sectionKey];
      } else if (
        typeof sectionValue === 'object' &&
        !Array.isArray(sectionValue)
      ) {
        // Update or add new section
        updatedContent[sectionKey] = {
          ...(updatedContent[sectionKey] || {}),
          ...sectionValue,
        };
      } else {
        // Invalid structure
        return res.status(400).send({
          success: false,
          message: `Invalid content format for section "${sectionKey}"`,
        });
      }
    }

    page.content = updatedContent;
    await page.save();

    return res.status(200).send({
      success: true,
      message: 'Page updated successfully!',
      content: page.content,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      success: false,
      message: 'Could not update page',
      error: err.message,
    });
  }
};

const getPages = async (req, res) => {
    try {
        const{pageId} = req.params

        if(!pageId) return res.status(401).send({
            success: false,
            message: 'Page ID is required'
        })
        const foundPage = await pagesModel.findOne({pageId: pageId})
        if(!foundPage) return res.status(404).send({
            success: false,
            message: 'Page Not Found'
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
            error: err.message
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
        });           
    } 
      try {
    const { pageId, icon, ...rest } = validation.data;

    const foundPage = await pagesModel.findOne({ pageId });
    if (foundPage) {
      return res.status(400).send({
        success: false,
        message: 'Page already exists',
      });
    }

    const pageData = {
      pageId,
      icon: icon || 'fa:FaRegFileCode',
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
            error: err.message
       });
    }
}

const getPageLinks = async (req, res) => {
    try {
        const response = await pagesModel.find().sort({ pageName: 1 })
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
            error: err.message
       });
    }
}

const updatePageLinks = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(401).send({
      success: false,
      message: 'ID is required',
    });
  }

  const validation = pageSchema.safeParse(req.body);

 if (!validation.success) {
        const formatted = ZodError.flatten(result.error);
        return res.status(401).send({
            success: false,
            message: `Could not Create Link: ${formatted}`, 
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
      error: err.message,
    });
  }
};

const deletePage = async (req, res) => {
    try {
        const {id} = req.params
        if(!id) return res.status(401).send({
            success: false,
            message: 'Could not delete Page'
        })

        const deletedPage = await pagesModel.findByIdAndDelete(id)
        if(!deletedPage) return res.status(404).send({
            success: false,
            message: 'Page not found!'
        })

        res.status(200).send({
            success: true,
            message: 'Page deleted successfully!'
        })
    } catch (err) {
       console.error(err);
    res.status(500).send({
      success: false,
      message: 'Could not delete page',
      error: err.message,
    });  
    }
}

module.exports = {createPageLinks, getPageLinks, updatePageLinks, getPages, updatePage, deletePage}