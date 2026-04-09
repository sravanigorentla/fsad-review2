import bcrypt from 'bcryptjs';
import { connectToDatabase } from './lib/mongodb.js';
import { generateToken, setCorsHeaders } from './lib/auth.js';
import { seedDatabase } from './lib/seed.js';

export default async function handler(req, res) {
    setCorsHeaders(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    const { db } = await connectToDatabase();
    await seedDatabase(db);
    if (req.method === 'POST') {
        const { action, email, password } = req.body;
        if (action === 'login') {
            const user = await db.collection('users').findOne({ email });
            if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: 'Invalid credentials' });
            return res.status(200).json({ token: generateToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
        }
    }
    return res.status(405).end();
}
