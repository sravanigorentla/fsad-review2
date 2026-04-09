import { connectToDatabase } from './lib/mongodb.js';
import { setCorsHeaders, verifyToken, getTokenFromHeader } from './lib/auth.js';
import { seedDatabase, defaultQuestions } from './lib/seed.js';

export default async function handler(req, res) {
    setCorsHeaders(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    const { db } = await connectToDatabase();
    await seedDatabase(db);

    if (req.method === 'GET') {
        const questions = await db.collection('questions').find({}).toArray();
        return res.status(200).json(questions.length > 0 ? questions : defaultQuestions);
    }
    return res.status(405).end();
}
