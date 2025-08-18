const newsModel = require("../models/newsModel");
const {newsSchema}  = require ("../validators/formValidators");
const { ZodError } = require('zod');

const postNews =  async (req, res) => {
    const validation = newsSchema.safeParse(req.body);

        if (!validation.success) {
            const formatted = ZodError.flatten(result.error);
            return res.status(401).send({
                success: false,
                message: `Could not post news: ${formatted}`, 
            });           
        } 


    try {

    const createdNews = new newsModel(validation.data)
        await createdNews.save()

        res.status(201).send({
            success: true,
            message: 'News Created successfully!'
        })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not post news'
        })
    }
}
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
            message: 'Could not post news'
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

const editNews =  async (req, res) => {
    const validation = newsSchema.safeParse(req.body);

        if (!validation.success) {
            const formatted = ZodError.flatten(result.error);
            return res.status(401).send({
                success: false,
                message: `Could not edit news: ${formatted}`, 
            });           
        } 


    try {
        const {id} = req.params       

        const editNews = await newsModel.findByIdAndUpdate(id, validation.data, {new: true})
        if(!editNews) return res.status(404).send({
            success: false,
            message: 'Could not edit news'
        })

        res.status(200).send({
            success: true,
            message: 'News edited successfully!'
        })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not edit news'
        })
    }
}


module.exports = {postNews, getNews, deleteNews, editNews}