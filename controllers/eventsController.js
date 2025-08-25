const eventsModel = require("../models/eventsModel");
const {eventSchema}  = require ("../validators/formValidators");
const { ZodError } = require('zod');
const postEvent = async (req, res) => {
        const validation = eventSchema.safeParse(req.body);

        if (!validation.success) {
            const formatted = ZodError.flatten(result.error);
            return res.status(401).send({
                success: false,
                message: `Could not post event: ${formatted}`, 
                data: null
            });           
        } 


    try {

    const createdEvent = new eventsModel(validation.data)
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
    const deleteevent = await eventsModel.findByIdAndDelete(id)
        if(!deleteevent) return res.status(404).send({
            success: false,
            message: 'Event not found',
            data: null
        })

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
            const formatted = ZodError.flatten(result.error);
            return res.status(401).send({
                success: false,
                message: `Could not edit event: ${formatted}`, 
                data: null
            });           
        } 


    try {
        const {id} = req.params       

        const editEvent = await eventsModel.findByIdAndUpdate(id, validation.data, {new: true})
        if(!editEvent) return res.status(404).send({
            success: false,
            message: 'Could not edit event',
            data: null
        })

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