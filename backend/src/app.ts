import * as bodyparser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';

const app: express.Application = express();

app.use(bodyparser.json());
app.use(cors());
dotenv.config();

app.get('/health', (req: Request, res: Response) => {
    const message = `Server is running at http://localhost:${process.env.SERVER_PORT}`;
    const timestamp = new Date().toLocaleString();
    res.status(200).send({ message, timestamp });
});

app.get('/', (req: Request, res: Response) => {
    const message = `Server is running at http://localhost:${process.env.SERVER_PORT}`;
    const timestamp = new Date().toLocaleString();
    res.status(200).send({ message, timestamp });
});


(async () => {
    try {
        app.listen(process.env.SERVER_PORT, () => {
            console.log(`⚡️[server]: Server is running at http://localhost:${process.env.SERVER_PORT}`);
        });
    } catch (err) {
        throw new Error(`[ERROR]: Couldn't start server`)
    }
})();


