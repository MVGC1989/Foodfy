// INICIANDO O SERVIDOR

const express = require('express')
const nunjucks = require('nunjucks')
const routes = require("./routes")
const method_override = require("method-override")
const session = require("./config/session")

const server = express()

server.use(session)
server.use((req, res, next)=>{
    res.locals.session = req.session
    next()
})

server.use(express.urlencoded({extended: true}))
server.use(express.static('public')) 
server.use(method_override("_method"))
server.use(routes)
server.set('view engine', 'njk')

nunjucks.configure('src/app/views',{
    express:server,
    autoescape: false,
    noCache: true
})  

server.listen(7000, function(){
    console.log("SERVER IS RUNING!")
})