import express from 'express';
import cors from 'cors';
import config from 'config';
import 'reflect-metadata';
import { useExpressServer } from 'routing-controllers';
import { ValidatorOptions } from 'class-validator';

// Initializations
const app = express();

// Settings
const port: number = config.get('server.port');
app.set('port', port);

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

console.log(port);
const validatorOptions: ValidatorOptions = {
    validationError: {
        target: false,
    },
};
useExpressServer(app, {
    controllers: [__dirname + '/controllers/*.js'],
    middlewares: [__dirname + '/middleware/*.js'],
    validation: validatorOptions,
    defaultErrorHandler: false,
}).listen(app.get('port'));

export default app;
