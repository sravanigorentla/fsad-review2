const API_BASE = import.meta.env.PROD ? '/api' : '/api';

class ApiService {
    private token: string | null = null;

    constructor() {
        this.token = localStorage.getItem('careerwise_token');
    }

    setToken(token: string) {
        this.token = token;
        localStorage.setItem('careerwise_token', token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('careerwise_token');
        localStorage.removeItem('careerwise_user');
    }

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    // Auth
    async login(email: string, password: string) {
        const res = await fetch(`${API_BASE}/auth?action=login`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        this.setToken(data.token);
        localStorage.setItem('careerwise_user', JSON.stringify(data.user));
        return data;
    }

    async register(name: string, email: string, password: string, role: string = 'student') {
        const res = await fetch(`${API_BASE}/auth?action=register`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ name, email, password, role })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        this.setToken(data.token);
        localStorage.setItem('careerwise_user', JSON.stringify(data.user));
        return data;
    }

    logout() {
        this.clearToken();
    }

    getUser() {
        const user = localStorage.getItem('careerwise_user');
        return user ? JSON.parse(user) : null;
    }

    isLoggedIn() {
        return !!this.token;
    }

    // Questions
    async getQuestions() {
        const res = await fetch(`${API_BASE}/questions`, { headers: this.getHeaders() });
        return res.json();
    }

    async createQuestion(question: any) {
        const res = await fetch(`${API_BASE}/questions`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(question)
        });
        return res.json();
    }

    async updateQuestion(question: any) {
        const res = await fetch(`${API_BASE}/questions`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(question)
        });
        return res.json();
    }

    async deleteQuestion(id: number) {
        const res = await fetch(`${API_BASE}/questions`, {
            method: 'DELETE',
            headers: this.getHeaders(),
            body: JSON.stringify({ id })
        });
        return res.json();
    }

    // Results
    async submitResults(data: { studentName: string; studentEmail: string; answers: any; recommendation: string }) {
        const res = await fetch(`${API_BASE}/results`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });
        return res.json();
    }

    async getResult(id: string) {
        const res = await fetch(`${API_BASE}/results?id=${id}`, { headers: this.getHeaders() });
        return res.json();
    }

    async getAllResults() {
        const res = await fetch(`${API_BASE}/results`, { headers: this.getHeaders() });
        return res.json();
    }

    // Stats
    async getStats() {
        const res = await fetch(`${API_BASE}/stats`, { headers: this.getHeaders() });
        return res.json();
    }
}

export const api = new ApiService();
export default api;
