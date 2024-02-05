import { Router } from "express";

const webRouter = Router()

webRouter.get('/blogs', (req, res, next) => {
    res.render("index")
})


export default webRouter