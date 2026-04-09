import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Brain, Clock } from 'lucide-react';
import type { Question } from '../types';

const Assessment: React.FC = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [studentName, setStudentName] = useState('');
    const [showIntro, setShowIntro] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => { if (!submitting && !showIntro) setSeconds(s => s + 1); }, 1000);
        return () => clearInterval(interval);
    }, [submitting, showIntro]);

    const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    useEffect(() => {
        fetch('/api/questions').then(res => res.json()).then(data => {
            if (Array.isArray(data) && data.length > 0) setQuestions(data.slice(0, 10));
        }).catch(() => { });
    }, []);

    const handleSelect = (qId: number, val: string) => setAnswers({ ...answers, [qId]: val });

    const calculateResult = () => {
        const counts: Record<string, number> = {};
        Object.entries(answers).forEach(([qId, val]) => {
            const question = questions.find(q => q.id === parseInt(qId));
            const option = question?.options.find(o => o.value === val);
            if (option?.category) counts[option.category] = (counts[option.category] || 0) + (option.weight || 1);
        });
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        return sorted[0] ? sorted[0][0] : "Software Engineer";
    };

    const nextStep = async () => {
        if (currentStep < questions.length - 1) setCurrentStep(currentStep + 1);
        else {
            setSubmitting(true);
            const recommendation = calculateResult();
            try {
                const res = await fetch('/api/results', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ studentName, answers, recommendation })
                });
                const data = await res.json();
                navigate('/results', { state: { recommendation, careerDetails: data.careerDetails } });
            } catch { navigate('/results', { state: { recommendation } }); }
        }
    };

    if (showIntro) return (
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            <div className="glass-card-static" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                <Brain size={48} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                <h2>Career Assessment</h2>
                <input type="text" className="input" placeholder="Your Name" value={studentName} onChange={e => setStudentName(e.target.value)} style={{ margin: '1.5rem 0' }} />
                <button onClick={() => setShowIntro(false)} className="btn btn-primary" style={{ width: '100%' }}>Start Exploration <ArrowRight size={18} /></button>
            </div>
        </div>
    );

    const q = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;
    if (!q) return null;

    return (
        <div className="container">
            <div style={{ maxWidth: '700px', margin: '4rem auto' }}>
                <div className="progress-bar" style={{ marginBottom: '2rem' }}><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
                <div className="glass-card-static">
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                        <span>Question {currentStep + 1} of {questions.length}</span>
                        <span><Clock size={14} /> {formatTime(seconds)}</span>
                    </div>
                    <h3 style={{ marginBottom: '2rem' }}>{q.text}</h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {q.options.map(o => (
                            <button key={o.value} onClick={() => handleSelect(q.id, o.value)} className={`option-card ${answers[q.id] === o.value ? 'selected' : ''}`}>
                                {o.text}
                            </button>
                        ))}
                    </div>
                    <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between' }}>
                        <button onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : setShowIntro(true)} className="btn btn-outline">Back</button>
                        <button onClick={nextStep} disabled={!answers[q.id] || submitting} className="btn btn-primary">
                            {currentStep === questions.length - 1 ? 'Finish' : 'Next'} <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Assessment;
