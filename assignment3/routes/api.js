import Router from 'express'
import blogRepository from '../blogRepository.js'
import { Int32 } from 'mongodb'

const apiRouter = new Router()

apiRouter.get('/blogs', async(req, res, next) => {
    blogRepository.getAllPosts(req.app.get("db"), (result, error) => {
        if (error) {
            res.status(500).json({"message": "Internal Server Error"})
        } else {
            res.status(200).json(result)
        }
    })
})

apiRouter.get('/blogs/:id', async(req, res, next) => {
    const id = new Int32(req.params.id)
    blogRepository.getPostById(req.app.get("db"), id, (result, error) => {
        if (error) {
            res.status(500).json({"message": "Internal Server Error"})
        } else {
            if (result) {
                res.status(200).json(result)
            } else {
                res.status(404).json({"message": `Post with id=${id} not found`})
            }
            
        }
    })
})

apiRouter.post('/blogs', async(req, res, next) => {
    if (req.get("Content-Length") > 300) {
        res.status(400).json({"message": "Body is too large"})
        return
    }
    const newPost = {
        "_id": new Int32(await blogRepository.getPostIndex(req.app.get("db"))),
        "title": req.body.title,
        "body": req.body.body,
        "author": req.body.author,
        "created": Date.now()
    }
    blogRepository.insertPost(req.app.get("db"), newPost, (insertedId, err) => {
        if (err) {
            console.log(err)
            res.status(500).json({"message": "Internal Server Error"})
        } else {
            res.status(200).json({"message": `Inserted post with id=${insertedId}`})
        }
    })
})

apiRouter.delete('/blogs/:id', async(req, res, next) => {
    const id = new Int32(req.params.id)
    blogRepository.deletePostById(req.app.get('db'), id, (deletedId, err) => {
        if (err) {
            console.log(err)
            res.status(500).json({"message": "Internal Server Error"})
        } else {
            if (deletedId) {
                res.status(200).json({"message": `Deleted post with id=${deletedId}`})
            } else {
                res.status(404).json({"message": `Post with id=${id} not found`})
            }
            
        }
    })
})

apiRouter.put('/blogs/:id', async(req, res, next) => {
    const id = new Int32(req.params.id)
    const post = {}
    try {
        req.body.title ? (post.title = req.body.title) : null
        req.body.body ? (post.body = req.body.body) : null
        req.body.author ? (post.author = req.body.author) : null
    } catch (error) {}
    
    console.log(post)
    blogRepository.updatePostById(req.app.get('db'), id, post, (result, err) => {
        if (err) {
            console.log(err)
            res.status(500).json({"message": "Internal Server Error"})
        } else {
            res.status(200).json({"message": `Updated post with id=${id}`})
        }
    })
})


export default apiRouter;