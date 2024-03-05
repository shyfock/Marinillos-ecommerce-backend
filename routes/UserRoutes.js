const express = require("express");
const router = express.Router();
const User = require("../models/User");
const userController = require("../controllers/UserController");



let routes = app => {
    // Post Method
    router.post('/create', userController.userCreate)

    // Login
    router.post('/login', userController.logIn)

    // Get by ID Method
    router.get('/getUser/:id', userController.getUser)

    // Remove User by ID
    router.delete('/deleteUser/:id', userController.removeUser)

    return app.use("/users", router)
}

module.exports = routes;