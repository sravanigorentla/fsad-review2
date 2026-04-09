import { connectToDatabase } from './lib/mongodb.js';
import { setCorsHeaders, verifyToken, getTokenFromHeader } from './lib/auth.js';
import { careerDetails } from './lib/seed.js';

export default async function handler(req, res) {
    setCorsHeaders(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    const { db } = await connectToDatabase();
    if (req.method === 'POST') {
        const result = req.body;
        result.completedAt = new Date();
        result.careerDetails = careerDetails[result.recommendation] || careerDetails["Software Engineer"];
        const doc = await db.collection('results').insertOne(result);
        return res.status(201).json({ ...result, id: doc.insertedId });
    }
    if (req.method === 'GET') {
        const token = getTokenFromHeader(req);
        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'admin') return res.status(401).json({ error: 'Unauthorized' });
        const results = await db.collection('results').find({}).sort({ completedAt: -1 }).toArray();
        return res.status(200).json(results);
    }
    return res.status(405).end();
}
