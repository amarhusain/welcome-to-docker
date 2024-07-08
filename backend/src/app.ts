import * as bodyparser from 'body-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import path from 'path';
import { config } from './common/config';
import { CustomError } from './common/errors/custom-error';
import logger from './common/logger';
import appointmentRouter from './routes/appointment.routes';
import authRouter from './routes/auth.routes';
import prescriptionRouter from './routes/prescription.routes';



declare global {
    namespace Express {
        interface Request {
            currentUser?: JwtPayload;
            uploaderError?: Error;
        }
    }
}

const app: express.Application = express();

app.use(bodyparser.json());
app.use(cors());

// Define the error handling middleware function
// function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
//     logger.error(err.stack);
//     res.status(500).send(err.name + ' : ' + err.message);
// }

// Error handling middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.stack);

    // Check for specific error types and send an appropriate response
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    // For other types of errors, send a generic error response
    res.status(500).json({ error: `Internal Server Error : ${err}` });
};

app.use('/api', authRouter);
app.use('/api/appointment', appointmentRouter);
app.use('/api/prescription', prescriptionRouter);


app.get('/health', (req: Request, res: Response) => {
    const message = `Server is running at http://localhost:${process.env.port}`;
    const timestamp = new Date().toLocaleString();
    res.status(200).send({ message, timestamp });
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
})

// Handling non matching request from client
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.error('[ERROR]: No matching API url "' + req.originalUrl + '" found.')
    res.status(404).send('No matching API url "' + req.originalUrl + '" found on the server.');
});

// Register the error handling middleware function
app.use(errorHandler);

(async () => {
    try {
        app.listen(config.serverPort, () => {
            console.log(`⚡️[server]: Server is running at http://localhost:${config.serverPort}`);
        });
    } catch (err) {
        throw new Error(`[ERROR]: Couldn't start server`)
    }
})();


