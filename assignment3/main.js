import dotenv from 'dotenv'
import express from 'express'
import { MongoClient } from 'mongodb'
import apiRouter from './routes/api.js'
import bodyParser from 'body-parser'
import path, { dirname } from 'path'
import webRouter from './routes/web.js'

dotenv.config()
const app = express()

// app.set("Content-Type", "application/x-www-form-urlencoded")
app.set("Content-Type", "application/json")
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(dirname + `/views/static`)))
app.set('view engine', 'ejs')

app.use('/api', apiRouter)
app.use('/', webRouter)


MongoClient.connect(process.env.DB_CONNECTION_STRING)
.then(client => {
    const db = client.db('blog')
    app.listen(process.env.PORT, () => {
        console.log(`server started on port :${process.env.PORT}`)
    })
    app.set("db", db)
})