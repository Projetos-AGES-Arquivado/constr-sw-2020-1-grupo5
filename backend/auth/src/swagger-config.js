import swaggerJsDoc from 'swagger-jsdoc'

const swaggerConfig = {
    swaggerDefinition: {
        info: {
            title: 'Buildings and Rooms',
            description: '',
            contact: {
                name: 'Alexandre Bing'
            },
            servers:['http://localhost:3456'],
            version: '1.0.0'
        }
    },
    apis: ['./app.js','./controller/*.js']
}

const swaggerDoc = swaggerJsDoc(swaggerConfig);

export default swaggerDoc