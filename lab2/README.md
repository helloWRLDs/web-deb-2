# Lab 2- Creating an Email Sender with Node.js

## Installation
```bash
npm install
```

## Dependencies
- dotenv     v16.4.4
- ejs        v3.1.9
- express    v4.18.2
- nodemailer v6.9.9
- nodemon    v3.0.3
- path       v0.12.7

## Structure
- [main.js](./main.js) - main file with express server
- [mainSender.js](./mailSender.js) - mail sending logic
- [views](./views/) - static files such as html, css, scripts
- [.env](./.env.example) - environmental configuration file

## Usage
- create .env file in root folder
- set environment properties, as example take [.env.example](./.env.example)
- start the server:
```bash
npm run serve
```
- go to [local server](http://localhost:8080)