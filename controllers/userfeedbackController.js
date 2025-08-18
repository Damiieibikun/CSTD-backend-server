const feedbackModel = require("../models/userfeedbackModel");
const {feedbackSchema}  = require ("../validators/formValidators");
const { ZodError } = require('zod');

const sendFeedBack = async (req, res) => {
    const validation = feedbackSchema.safeParse(req.body);

    if (!validation.success) {
        const formatted = ZodError.flatten(result.error);
        return res.status(401).send({
            success: false,
            message: `Could not send Message: ${formatted}`, 
        });           
    }  

    try {
    
    const createdFeedback = new feedbackModel(validation.data)
        await createdFeedback.save()

        res.status(201).send({
            success: true,
            message: 'FeedBack Sent successfully!'
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not send Message'
        })
    }
}
const getFeedBack = async (req, res) => {
  
    try {
        const response = await feedbackModel.find({})

        res.status(201).send({
            success: true,
            message: 'FeedBack Fetched successfully!',
            data: response
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not send Message'
        })
    }
}
const deleteFeedBack = async (req, res) => {
      try {
        const{id} = req.params
        if (!id){
            return res.status(401).send({
            success: false,
            message: 'Feedback ID is required'
        })}
        const foundfeedBack = await feedbackModel.findByIdAndDelete(id)
        if(!foundfeedBack) {
            return res.status(404).send({
            success: false,
            message: 'Feedback does not exist or has been deleted'
        })
}
        res.status(200).send({
            success: true,
            message: 'FeedBack deleted successfully!',
            
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not delete Message'
        })
    }
}

const deleteMultipleFeedBack = async (req, res) => {
  try {
   
    const { ids } = req.body; 
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send({
        success: false,
        message: 'Array of feedback IDs is required'
      });
    }

    const deleteResult = await feedbackModel.deleteMany({ 
      _id: { $in: ids } 
    });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).send({
        success: false,
        message: 'No matching feedbacks found or they may have already been deleted'
      });
    }

    res.status(200).send({
      success: true,
      message: `${deleteResult.deletedCount} feedback(s) deleted successfully!`,
    });

  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).send({
      success: false,
      message: 'Could not delete feedback(s)',
      error: error.message
    });
  }
};

module.exports = {sendFeedBack, getFeedBack, deleteFeedBack, deleteMultipleFeedBack}