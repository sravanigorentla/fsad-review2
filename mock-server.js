import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authHandler from './api/auth.js';
import questionsHandler from './api/questions.js';
import resultsHandler from './api/results.js';
import statsHandler from './api/stats.js';

dotenv.config();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const wrapHandler = (handler) => async (req, res) => {
    const vReq = { method: req.method, body: req.body, query: req.query, headers: req.headers };
    const vRes = {
        status: (code) => ({
            json: (data) => res.status(code).json(data),
            end: () => res.status(code).end(),
            send: (data) => res.status(code).send(data)
        }),
        setHeader: (name, value) => res.setHeader(name, value)
    };
    try { await handler(vReq, vRes); }
    catch (err) { console.error(err); res.status(500).json({ error: 'Internal Error' }); }
};

app.all('/api/auth', wrapHandler(authHandler));
app.all('/api/questions', wrapHandler(questionsHandler));
app.all('/api/results', wrapHandler(resultsHandler));
app.all('/api/stats', wrapHandler(statsHandler));

app.listen(port, () => console.log(`Backend at http://localhost:${port}`));
