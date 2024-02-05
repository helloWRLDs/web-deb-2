import { Int32 } from "mongodb"

const getPostIndex = async(db) => {
    const result = await db.collection('posts').find().sort({"created": -1}).limit(1).toArray()
    if (result.length === 0) {
        return 1
    }
    return ++result[0]._id
}

const getPostById = async(db, id, callback) => {
    try {
        const result = await db.collection('posts').findOne({_id: id})
        callback(result, null)
    } catch (error) {
        callback(null, error)
    }
}

const getAllPosts = async(db, callback) => {
    try {
        const result = await db.collection('posts').find().toArray()
        callback(result, null)
    } catch (error) {
        callback(null, error)
    }
}

const insertPost = async(db, post, callback) => {
    try {
        const result = await db.collection('posts').insertOne(post)
        if (result.acknowledged) {
            callback(result.insertedId, null)
        } else {
            callback(null, new Error("Error"))
        }
    } catch (error) {
        console.log(error)
        callback(null, error)
    }
}

const deletePostById = async(db, id, callback) => {
    try {
        const result = await db.collection('posts').deleteOne({_id: id})
        if (result.deletedCount) {
            callback(id, null)
        } else {
            callback(null, null)
        }
    } catch (error) {
        console.log(error)
        callback(null, error)
    }
}

const updatePostById = async(db, id, post, callback) => {
    try  {
        const result = await db.collection('posts').updateOne({_id: id}, {$set: post})
        console.log(result)
        if (result.acknowledged) {
            callback(null)
        }
    } catch (error) {
        callback(error)
    }
}


export default {
    getPostIndex,
    getAllPosts,
    insertPost,
    deletePostById,
    getPostById,
    updatePostById
}