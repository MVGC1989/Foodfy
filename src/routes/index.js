const express = require('express')
const routes = express.Router()

const main = require("./main")
const chefs = require("./chefs")
const recipes = require("./recipes")
const users = require("./users")
const profile = require("./profile")


routes.use(main)
routes.use("/admin/chefs", chefs)
routes.use("/admin/recipes", recipes)
routes.use("/admin/users", users)
routes.use("/admin/profile", profile)


//ATALHOS
routes.get('/accounts', function(req , res){
    return res.redirect("/admin/users/login")
})


module.exports = routes