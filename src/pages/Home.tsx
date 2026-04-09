import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Shield } from 'lucide-react';

const Home: React.FC = () => {
    return (
        <div className="container" style={{ textAlign: 'center', paddingTop: '10rem' }}>
            <div className="badge badge-primary"><Sparkles size={14} /> AI-Powered Career Assessment</div>
            <h1 style={{ fontSize: '4rem', margin: '2rem 0' }}>Discover Your <span className="gradient-text">Perfect Career</span></h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 3rem' }}>The world's smartest career assessment platform powered by AI analysis.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link to="/assessment" className="btn btn-primary btn-lg">Start Now <ArrowRight size={20} /></Link>
                <Link to="/login" className="btn btn-outline btn-lg"><Shield size={20} /> Admin</Link>
            </div>
        </div>
    );
};
export default Home;
