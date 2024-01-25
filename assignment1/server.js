require('dotenv').config()
const express = require('express')
const app = express()
const http = require('http')
const jwt = require('jsonwebtoken');
const server = http.createServer(app)
const mysql = require('mysql')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const { addUser, verifyUser, getUserById } = require('./services/userService')
const {Server} = require('socket.io');
const io = new Server(server)
const { verifyToken } = require('./services/middleWare');



// Body encoder
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

// Database connection
const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE
})
connection.connect((err) => {
    if (err) {
        console.error(err.stack)
        return
    }
    console.log(`connected to database ${process.env.MYSQL_DATABASE}`)
})

// Connection of static files folder
app.use(express.static(path.join(__dirname + `/ui/static`)))


// Rotes
app.get('/', (req, res) => {
    res.sendFile(__dirname + `/ui/html/index.html`)
})

app.get(`/register`, (req, res) => {
    res.sendFile(__dirname + `/ui/html/register.html`)
})

app.get(`/chat`, verifyToken, (req, res) => {
    res.sendFile(__dirname + `/ui/html/chat.html`)
})

app.post(`/register`, (req, res) => {
    addUser(req, connection, (error, result) => {
        if (error) {
            res.status(401).json({error: 'Registration failed!'})
        } else {
            console.log(result)
            res.redirect(`/login`)
        }
    })
})

app.get(`/login`, (req, res) => {
    res.sendFile(__dirname + `/ui/html/login.html`)
})

app.post(`/login`, (req, res) => {
    verifyUser(req, connection, (error, result) => {
        if (error || !result) {
            console.log(error)
            res.status(401).json({error: 'Authentication failed'})
        } else {
            const user = result
            console.log(user)
            const token = jwt.sign(
                {userId: user.user_id, email: user.email},
                process.env.JWT_SECRET,
                {expiresIn: '1h'}
            )
            res.cookie('jwtToken', token, { httpOnly: false, maxAge: 3600000 })
            // res.status(200).json({token})
            res.redirect(`/chat`)
        }
    })
})

const users = {}
io.use((socket, next) => {
    const cookies = socket.handshake.headers.cookie;
    const token = cookies.split("=")[1]
    verifyToken({cookies: {jwtToken: token}}, null, (error) => {
        if (error) {
            return next(new Error('Authentication error'));
        }
        socket.userId = socket.request.userId
        console.log(socket.request.userId)
        next()
    })
})

// Sockets for chat
io.on('connection', (socket) => {
    console.log(`someone connected`)
    // console.log(socket.userId)
    
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg, 0)
    });
    socket.on('disconnect', () => {
        console.log('someone disconnected')
    })
})


// Starting server
server.listen(process.env.port, () => {
    console.log(`server started on port :${process.env.port}`)
})