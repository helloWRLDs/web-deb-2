require(`dotenv`).config()
const path = require('path')
const bodyParser = require('body-parser')

const http = require('http')
const express = require('express')
const { Server } = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(path.join(__dirname + `/ui/static`)))
app.use(bodyParser.urlencoded({extended: true}))

app.get(`/`, (req, res) => {
    res.sendFile(__dirname + `/ui/html/index.html`)
})

app.post(`/`, (req, res) => {
    res.redirect(`/chat?name=${req.body.name}`)
})

app.get(`/chat`, (req, res) => {
    // const name = req.query.name;
    res.sendFile(__dirname + `/ui/html/chat.html`)
})

io.on('connection', (socket) => {
    const name = socket.handshake.query.name
    console.log(`${name} connected`)
    io.emit('chat message', "Hello, welcome to chat!", "server")

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg, name)
    })

    socket.on('disconnect', () => {
        console.log(`${name} disconnected`)
    })
})

server.listen(process.env.port, () => {
    console.log(`server started on port :${process.env.port}`)
})