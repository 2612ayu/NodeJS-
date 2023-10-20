const router = require('express').Router();
const { User } = require('../Models/User');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Validation schema for the request body
const validationSchema = Joi.object({
    email: Joi.string().email().required().label('Email'),
    password: Joi.string().required().label('Password')
});

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user and get an access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   description: The access token.
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request, check the request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Invalid Email or Password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */


router.post("/", async (req, res) => {
    try {
        // Validate the request body
        const { error } = validationSchema.validate(req.body);

        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        // Find the user by email
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(401).send({ message: "Invalid Email or Password" });
        }

        // Compare the provided password with the stored password hash
        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword) {
            return res.status(401).send({ message: "Invalid Email or Password" });
        }

        // If email and password are correct, generate a token
        const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);

        // Send a success response
        res.status(200).send({ data: token, message: "Logged in successfully" });
    } catch (error) {
        console.error("Error:", error); // Log the error for debugging
        res.status(500).send({ message: "Internal server error" });
    }
});

module.exports = router;
