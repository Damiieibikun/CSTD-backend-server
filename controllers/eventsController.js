const eventsModel = require("../models/eventsModel");
const {eventSchema}  = require ("../validators/formValidators");
const{cloudinary} = require('../config/config')
const uploadToCloudinary = require('../middlewares/cloudinary')
const postEvent = async (req, res) => {
        const validation = eventSchema.safeParse(req.body);
         if (!validation.success) {
       
        const formatted = validation.error.flatten();
        return res.status(400).send({
            success: false,
            message: `Could not post event: ${JSON.stringify(formatted)}`,
            data: formatted
        });           
    } 

    try {      
        let flyerResult
    if (!req.file) {
         return res.status(400).send({
                success: false,
                message: 'Missing required files: flyer',
                data: null
            });   
    }
    if (req.file) {
          flyerResult = await uploadToCloudinary(
                req.file.buffer,
                "event-flyers"
              );      
    }

    const newEvent = {...validation.data, flyer: flyerResult.url, public_id: flyerResult.public_id}

    const createdEvent = new eventsModel(newEvent)
        await createdEvent.save()

        res.status(201).send({
            success: true,
            message: 'Event Created successfully!',
            data: null
        })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not post event',
            data: null
        })
    }
};


const getEvents =  async (req, res) => {

    try {
    const events = await eventsModel.find({})

        res.status(200).send({
            success: true,
            message: 'Events fetched successfully!',
            data: events
        })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not fetch news',
            data: null
        })
    }
};
const deleteEvent =  async (req, res) => {

    try {
        const {id} = req.params
        const foundEvent = await eventsModel.findById(id)
        if(!foundEvent) return res.status(404).send({
            success: false,
            message: 'Event not found',
            data: null
        })

        if(foundEvent.public_id){
             await cloudinary.uploader.destroy(foundEvent.public_id);
        }

        await eventsModel.findByIdAndDelete(id)

        res.status(200).send({
            success: true,
            message: 'Event Deleted successfully!', 
            data: null       
        })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not delete event',
            data: null
        })
    }
};

const editEvent =  async (req, res) => {
    const validation = eventSchema.safeParse(req.body);

         if (!validation.success) {
        // Fix: Use validation.error instead of result.error
        const formatted = validation.error.flatten();
        return res.status(400).send({
            success: false,
            message: `Could not update Event: ${JSON.stringify(formatted)}`,
            data: formatted
        });           
    } 
        
    try {
        const {id} = req.params      
        const foundEvent = await eventsModel.findById(id)
        if(!foundEvent) return res.status(404).send({
            success: false,
            message: 'Could not edit event',
            data: null
        })

        let currentFlyer = foundEvent.flyer
        let currentPublicID = foundEvent.public_id
        let newFlyerResult;        

    if (req.file) {
          newFlyerResult = await uploadToCloudinary(
                req.file.buffer,
                "event-flyers"
              );
        if(foundEvent.public_id){
            await cloudinary.uploader.destroy(foundEvent.public_id);
        }
         
        currentFlyer = newFlyerResult.url
        currentPublicID = newFlyerResult.public_id
    }

    const editedEvent = {...validation.data, flyer: currentFlyer, public_id: currentPublicID}
    await eventsModel.findByIdAndUpdate(id, editedEvent, {new: true})
        res.status(200).send({
            success: true,
            message: 'Event edited successfully!',
            data: null
        })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not edit event',
            data: null
        })
    }
}

module.exports = {postEvent, getEvents, deleteEvent, editEvent}