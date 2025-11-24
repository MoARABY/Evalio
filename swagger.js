const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
    title: 'Evalio API Documentation',
    version: '1.0.0',
    description: 'API documentation for my Node.js project',
    },
    servers: [
    {
        url: 'http://localhost:3000',
        description: 'Development server',
    },
    {
        url: 'https://evalio.vercel.app/',
        description: 'production server',
    }
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.js'], // Adjust the path according to your project structure
}
const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}