const swaggerJsdoc = require('swagger-jsdoc');

// Swagger configuration for the combined APIs
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Combined API Documentation',
            version: '1.0.0',
        },
    },
    apis: [
        `./Routes/todoRoutes.js`,
        `./Routes/authRoutes.js`,
        `./Routes/userRoutes.js`,
    ],
    components: {
        schemas: {
            Todo: {
                type: 'object',
                properties: {
                    todo: {
                        type: 'string',
                        description: 'The description of the todo item.',
                    }
                },
            },
            User: {
                type: 'object',
                properties: {
                    email: {
                        type: 'string',
                        description: "The user's email address.",
                    },
                    password: {
                        type: 'string',
                        description: "The user's password.",
                    },
                },
            },
        },
    },
};

const swaggerDocs = swaggerJsdoc(options);
module.exports = swaggerDocs;


