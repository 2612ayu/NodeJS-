const express = require('express');
const router = express.Router();
const Todo = require('../Models/Todo');

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Operations for managing todos.
 */

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get a list of todos
 *     description: Retrieve a list of todos.
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: List of todos retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todos:
 *                   type: array
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalTodos:
 *                   type: integer
 *       400:
 *         description: Bad request, check the request
 *         content:
 *           application/json:
 *             example:
 *               error: Error message
 */

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     description: Create a new todo item.
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *     responses:
 *       201:
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad request, check the request body
 *         content:
 *           application/json:
 *             example:
 *               error: Error message
 */

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get a specific todo by ID
 *     description: Retrieve a todo by its unique identifier.
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the todo to retrieve.
 *     responses:
 *       200:
 *         description: Todo retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Todo not found
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               error: Error message
 */

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo by ID
 *     description: Delete a specific todo by its unique identifier.
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the todo to delete.
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *       404:
 *         description: Todo not found
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               error: Error message
 */

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update a todo by ID
 *     description: Update a specific todo by its unique identifier.
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the todo to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Todo not found
 *       400:
 *         description: Bad request, check the request body
 *         content:
 *           application/json:
 *             example:
 *               error: Error message
 */

// Create a new todo
router.post('/', async (req, res) => {
    try {
        const todo = new Todo(req.body);
        await todo.save();
        res.status(201).json(todo);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(400).json({ error: err.message });
    }
});

// Update a todo by ID
router.put('/:id', async (req, res) => {
    try {
        const todo = await Todo.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(todo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a todo by ID
router.delete('/:id', async (req, res) => {
    try {
        const todo = await Todo.findOneAndRemove({ _id: req.params.id });
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const todos = await Todo.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        const count = await Todo.countDocuments().exec();

        res.json({
            todos,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalTodos: count,
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    const todoId = req.params.id; // Get the ID from the URL parameter

    try {
        const todo = await Todo.findById(todoId).exec();

        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        res.json(todo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
