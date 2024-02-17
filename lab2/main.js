const express = require('express')
const ejs = require('ejs')
const path = require('path')
const { sendEmail } = require('./mailSender')
require('dotenv').config()


const app = express()

//middleware
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('Content-Type', 'application/json');
app.use(express.json())
app.use(express.static(path.join(__dirname + `/views/static`)))

//router
app.get(`/`, async(req, res) => {
    res.render('index')
})

app.post('/message', async(req, res) => {
    sendEmail(req.body.sender, req.body.subject, req.body.body, (error) => {
        if (error) {
            res.status(500).json({message: error})
        }
        else {
            res.status(200).send("message sent successfuly")
        }
    })
})


app.listen(process.env.PORT, () => {
    console.log(`server started on port :${process.env.PORT}`)
})