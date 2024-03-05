const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Joi = require('@hapi/joi');

const userCreate = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        // Validate user input
        if (!(email && password && userName)) {
            res.status(400).send("Todas las entradas son requeridas");
        }

        // check if user already exists
        // Validate if user exists in our database
        const olderUser = await User.findOne({ email });

        if (olderUser) {
            return res.status(409).send("El ususario ya existe. Por favor iniciar sesión");
        }

        // Validation
        const schemaRegister = Joi.object({
            userName: Joi.string().min(6).max(255).required(),
            email: Joi.string().min(6).max(255).required().email(),
            password: Joi.string().min(6).max(1024).required()
        })

        // Validate user
        const { error } = schemaRegister.validate(req.body);

        if (error) {
            return res.status(400).json(
                {error: error.details[0].message}
            )
        }

        // Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            userName,
            email: email.toLowerCase(),
            password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign(
            {
                user_id: user._id,
                email
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        // save user token
        user.token = token;

        // return new user
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }
}

const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const schemaLogin = Joi.object({
            email: Joi.string().min(6).max(255).required().email(),
            password: Joi.string().min(6).max(1024).required()
        })

        const { error } = schemaLogin.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message })

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("Todas las entradas son requeridas");
        }
        // Validate if user exists in our database
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                {
                    user_id: user._id,
                    email,
                },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            // save user token
            user.token = token;

            // user
            res.status(200).json(user);
        } else {
            res.status(400).json({message: "Credenciales Inválidas"});
        }
    } catch (err) {
        console.log(err);
    }
}

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const removeUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);
        res.send(`User with ${user.email} has been removed...`)
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

module.exports = {
    userCreate,
    logIn,
    getUser,
    removeUser
};