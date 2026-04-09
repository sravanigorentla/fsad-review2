import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'careerwise-secret-key-2024';
export function generateToken(user) { return jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' }); }
export function verifyToken(token) { try { return jwt.verify(token, JWT_SECRET); } catch (e) { return null; } }
export function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
}
export function getTokenFromHeader(req) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) return authHeader.split(' ')[1];
    return null;
}
