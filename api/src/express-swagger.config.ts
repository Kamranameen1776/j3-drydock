export function options(port: number) {
    return {
        swaggerDefinition: {
            info: {
                description: 'Dry dock API',
                title: 'Dry dock API',
                version: '0.0.1',
            },
            host: `localhost:${port}`,
            basePath: '/',
            produces: ['application/json', 'application/xml'],
            schemes: ['http', 'https'],
            securityDefinitions: {
                JWT: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                    description: '',
                },
            },
        },
        //app absolute path
        basedir: __dirname,
        //Path to the API handle folder}
        files: ['./controllers/**/*.js'],
    };
}
