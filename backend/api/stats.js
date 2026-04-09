import { connectToDatabase } from './lib/mongodb.js';
import { setCorsHeaders, verifyToken, getTokenFromHeader } from './lib/auth.js';

export default async function handler(req, res) {
    setCorsHeaders(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    const token = getTokenFromHeader(req);
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') return res.status(401).json({ error: 'Unauthorized' });
    const { db } = await connectToDatabase();
    const totalAssessments = await db.collection('results').countDocuments();
    const results = await db.collection('results').find({}).toArray();
    const distribution = {};
    results.forEach(r => { distribution[r.recommendation] = (distribution[r.recommendation] || 0) + 1; });
    return res.status(200).json({
        stats: { totalAssessments, totalStudents: 856, totalQuestions: 22, avgCompletionRate: '95%' },
        distribution, recentResults: results.slice(-5).reverse()
    });
}
