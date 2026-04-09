import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Download, Home, TrendingUp, DollarSign, BookOpen, Layers } from 'lucide-react';

const Results: React.FC = () => {
    const { state } = useLocation();
    const details = state?.careerDetails || { title: state?.recommendation || "Software Engineer", description: "Your profile matches this role perfectly.", skills: ["Coding", "Logic"], avgSalary: "$100k", growth: "High", learningPath: ["Step 1", "Step 2"] };
    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="glass-card-static" style={{ padding: '3rem' }}>
                    <h1 className="gradient-text">{details.title}</h1>
                    <p style={{ color: 'var(--text-muted)', margin: '1.5rem 0' }}>{details.description}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', margin: '2rem 0' }}>
                        <div className="glass-card"><h4>Salary</h4><p>{details.avgSalary}</p></div>
                        <div className="glass-card"><h4>Growth</h4><p>{details.growth}</p></div>
                    </div>
                    <h4>Skills</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '1rem 0' }}>
                        {details.skills.map((s: string) => <span key={s} className="skill-tag">{s}</span>)}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                        <button className="btn btn-primary" onClick={() => window.print()}>Download Roadmap</button>
                        <Link to="/" className="btn btn-outline">Back Home</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Results;
