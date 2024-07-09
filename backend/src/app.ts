import * as bodyparser from 'body-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';


const app: express.Application = express();

app.use(bodyparser.json());
app.use(cors());


app.get('/health', (req: Request, res: Response) => {
    const message = `Server is running at http://localhost:${process.env.port}`;
    const timestamp = new Date().toLocaleString();
    res.status(200).send({ message, timestamp });
});


(async () => {
    try {
        app.listen(process.env.port, () => {
            console.log(`⚡️[server]: Server is running at http://localhost:${process.env.port}`);
        });
    } catch (err) {
        throw new Error(`[ERROR]: Couldn't start server`)
    }
})();


