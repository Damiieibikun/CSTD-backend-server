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
      data: null
    });
  }

  if (!content || typeof content !== 'object') {
    return res.status(400).send({
      success: false,
      message: 'Content must be a valid object',
      data: null
    });
  }

  try {
    const page = await pagesModel.findOne({ pageId: pageId });

    if (!page) {
      return res.status(404).send({
        success: false,
        message: 'Page not found',
        data: null
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
          data: null
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
    const { pageId, icon, ...rest } = validation.data;

    const foundPage = await pagesModel.findOne({ pageId });
    if (foundPage) {
      return res.status(400).send({
        success: false,
        message: 'Page already exists',
        data: null
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
            data: err.message
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