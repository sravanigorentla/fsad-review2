import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Settings, Users, Database, Plus, Edit2, Trash2, TrendingUp,
    LogOut, BarChart3, PieChart, Clock, Eye, ChevronRight, X,
    Save, AlertCircle
} from 'lucide-react';
import api from '../../services/api';

interface DashboardData {
    stats: {
        totalAssessments: number;
        totalStudents: number;
        totalQuestions: number;
        avgCompletionRate: string;
    };
    distribution: Record<string, number>;
    recentResults: any[];
    questions: any[];
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<any>(null);

    const user = api.getUser();

    useEffect(() => {
        if (!api.isLoggedIn()) {
            navigate('/login');
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await api.getStats();
            setData(result);
        } catch (err: any) {
            // Use fallback data for demo
            setData({
                stats: { totalAssessments: 1284, totalStudents: 856, totalQuestions: 10, avgCompletionRate: '92%' },
                distribution: { "Software Engineer": 420, "Data Scientist": 310, "Project Manager": 230, "UX Designer": 180, "Other": 144 },
                recentResults: [
                    { studentName: 'Rahul Sharma', studentEmail: 'rahul@email.com', recommendation: 'Software Engineer', completedAt: new Date().toISOString() },
                    { studentName: 'Priya Patel', studentEmail: 'priya@email.com', recommendation: 'Data Scientist', completedAt: new Date().toISOString() },
                    { studentName: 'Amit Kumar', studentEmail: 'amit@email.com', recommendation: 'UX Designer', completedAt: new Date().toISOString() },
                    { studentName: 'Sneha Reddy', studentEmail: 'sneha@email.com', recommendation: 'Project Manager', completedAt: new Date().toISOString() },
                    { studentName: 'Vikram Singh', studentEmail: 'vikram@email.com', recommendation: 'Software Engineer', completedAt: new Date().toISOString() },
                ],
                questions: []
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        api.logout();
        navigate('/login');
    };

    const handleDeleteQuestion = async (id: number) => {
        if (!confirm('Are you sure you want to delete this question?')) return;
        try {
            await api.deleteQuestion(id);
            fetchData();
        } catch { setError('Failed to delete question'); }
    };

    const getCareerColor = (career: string) => {
        const colors: Record<string, string> = {
            'Software Engineer': '#818cf8',
            'Data Scientist': '#c084fc',
            'Project Manager': '#f472b6',
            'UX Designer': '#34d399',
            'Systems Analyst': '#fbbf24',
            'IT Consultant': '#60a5fa',
            'Quality Assurance': '#fb923c',
            'Technical Writer': '#a78bfa'
        };
        return colors[career] || '#94a3b8';
    };

    const stats = data?.stats || { totalAssessments: 0, totalStudents: 0, totalQuestions: 0, avgCompletionRate: '0%' };
    const distribution = data?.distribution || {};
    const recentResults = data?.recentResults || [];
    const totalDist = Object.values(distribution).reduce((a: number, b: number) => a + b, 0) || 1;

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner" />
                <p style={{ color: 'var(--text-muted)' }}>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '1400px' }}>
            {/* Header */}
            <header className="nav">
                <Link to="/" className="nav-brand">CareerWise Admin</Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Welcome, {user?.name || 'Admin'}
                    </span>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '0.75rem',
                        background: 'linear-gradient(135deg, var(--primary), #7c3aed)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '700', fontSize: '0.9rem'
                    }}>
                        {(user?.name || 'A')[0].toUpperCase()}
                    </div>
                    <button onClick={handleLogout} className="btn btn-sm btn-outline" style={{ color: 'var(--text-dim)' }}>
                        <LogOut size={16} />
                    </button>
                </div>
            </header>

            {error && (
                <div style={{
                    marginTop: '1rem', padding: '0.875rem 1.25rem', borderRadius: '0.75rem',
                    background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                    <AlertCircle size={18} /> {error}
                    <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>
                        <X size={16} />
                    </button>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', marginTop: '2rem' }}>
                {/* Sidebar */}
                <aside className="glass-card-static sidebar" style={{ padding: '1.25rem' }}>
                    <nav style={{ display: 'grid', gap: '0.25rem' }}>
                        {[
                            { id: 'overview', icon: <BarChart3 size={18} />, label: 'Overview' },
                            { id: 'students', icon: <Users size={18} />, label: 'Students' },
                            { id: 'questions', icon: <Database size={18} />, label: 'Questions' },
                            { id: 'analytics', icon: <PieChart size={18} />, label: 'Analytics' },
                            { id: 'settings', icon: <Settings size={18} />, label: 'Settings' },
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`}
                            >
                                {item.icon} {item.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main>
                    {/* Stats Cards */}
                    {(activeTab === 'overview' || activeTab === 'analytics') && (
                        <div className="animate-fade-in">
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                                gap: '1rem', marginBottom: '1.5rem'
                            }}>
                                {[
                                    { label: 'Total Assessments', value: stats.totalAssessments.toLocaleString(), icon: <Database size={22} />, color: '#818cf8' },
                                    { label: 'Active Students', value: stats.totalStudents.toLocaleString(), icon: <Users size={22} />, color: '#c084fc' },
                                    { label: 'Total Questions', value: stats.totalQuestions.toString(), icon: <BarChart3 size={22} />, color: '#f472b6' },
                                    { label: 'Completion Rate', value: stats.avgCompletionRate, icon: <TrendingUp size={22} />, color: '#34d399' }
                                ].map((stat, i) => (
                                    <div key={i} className="glass-card stat-card">
                                        <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                                            {stat.icon}
                                        </div>
                                        <div>
                                            <div className="stat-value">{stat.value}</div>
                                            <div className="stat-label">{stat.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            {/* Distribution */}
                            <div className="glass-card-static">
                                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <PieChart size={18} color="var(--primary)" /> Career Distribution
                                </h3>
                                <div style={{ display: 'grid', gap: '0.75rem' }}>
                                    {Object.entries(distribution).map(([career, count]) => (
                                        <div key={career}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                                                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{career}</span>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                    {count as number} ({Math.round(((count as number) / totalDist) * 100)}%)
                                                </span>
                                            </div>
                                            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '100px', overflow: 'hidden' }}>
                                                <div style={{
                                                    width: `${((count as number) / totalDist) * 100}%`,
                                                    height: '100%',
                                                    background: getCareerColor(career),
                                                    borderRadius: '100px',
                                                    transition: 'width 1s ease'
                                                }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Results */}
                            <div className="glass-card-static">
                                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Clock size={18} color="var(--secondary)" /> Recent Assessments
                                </h3>
                                <div style={{ display: 'grid', gap: '0.5rem' }}>
                                    {recentResults.slice(0, 6).map((result: any, i: number) => (
                                        <div key={i} style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '0.75rem 1rem', borderRadius: '0.75rem',
                                            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{
                                                    width: '36px', height: '36px', borderRadius: '0.5rem',
                                                    background: `${getCareerColor(result.recommendation)}20`,
                                                    color: getCareerColor(result.recommendation),
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontWeight: '700', fontSize: '0.85rem'
                                                }}>
                                                    {(result.studentName || 'A')[0]}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{result.studentName || 'Anonymous'}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{result.recommendation}</div>
                                                </div>
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                                                {new Date(result.completedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Students Tab */}
                    {activeTab === 'students' && (
                        <div className="glass-card-static animate-fade-in">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Users size={18} color="var(--primary)" /> Student Results
                                </h3>
                            </div>
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Student</th>
                                            <th>Email</th>
                                            <th>Career Match</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentResults.map((result: any, i: number) => (
                                            <tr key={i}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <div style={{
                                                            width: '32px', height: '32px', borderRadius: '0.5rem',
                                                            background: `${getCareerColor(result.recommendation)}20`,
                                                            color: getCareerColor(result.recommendation),
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontWeight: '700', fontSize: '0.8rem'
                                                        }}>
                                                            {(result.studentName || 'A')[0]}
                                                        </div>
                                                        <span style={{ fontWeight: '500' }}>{result.studentName || 'Anonymous'}</span>
                                                    </div>
                                                </td>
                                                <td style={{ color: 'var(--text-muted)' }}>{result.studentEmail || '-'}</td>
                                                <td>
                                                    <span className="badge badge-primary" style={{ color: getCareerColor(result.recommendation) }}>
                                                        {result.recommendation}
                                                    </span>
                                                </td>
                                                <td style={{ color: 'var(--text-muted)' }}>{new Date(result.completedAt).toLocaleDateString()}</td>
                                                <td>
                                                    <button className="btn btn-sm" style={{ padding: '0.4rem', color: 'var(--text-muted)' }}>
                                                        <Eye size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {recentResults.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                                    No student results yet. Results will appear here once students complete assessments.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Questions Tab */}
                    {activeTab === 'questions' && (
                        <div className="glass-card-static animate-fade-in">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Database size={18} color="var(--primary)" /> Assessment Questions
                                </h3>
                                <button className="btn btn-primary btn-sm" onClick={() => { setEditingQuestion(null); setShowModal(true); }}>
                                    <Plus size={16} /> Add Question
                                </button>
                            </div>
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Question</th>
                                            <th>Type</th>
                                            <th>Category</th>
                                            <th>Options</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(data?.questions || []).map((q: any, i: number) => (
                                            <tr key={i}>
                                                <td style={{ fontWeight: '600', color: 'var(--text-dim)' }}>{q.id || i + 1}</td>
                                                <td style={{ maxWidth: '300px' }}>{q.text}</td>
                                                <td>
                                                    <span className={`badge ${q.type === 'personality' ? 'badge-primary' : 'badge-warning'}`}>
                                                        {q.type}
                                                    </span>
                                                </td>
                                                <td style={{ color: 'var(--text-muted)' }}>{q.category}</td>
                                                <td style={{ color: 'var(--text-muted)' }}>{q.options?.length || 0}</td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                        <button className="btn btn-sm" style={{ padding: '0.4rem', color: 'var(--text-muted)' }}
                                                            onClick={() => { setEditingQuestion(q); setShowModal(true); }}>
                                                            <Edit2 size={15} />
                                                        </button>
                                                        <button className="btn btn-sm" style={{ padding: '0.4rem', color: '#ef4444' }}
                                                            onClick={() => handleDeleteQuestion(q.id)}>
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {(data?.questions || []).length === 0 && (
                                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                                    No questions loaded. Questions will be auto-seeded when the API connects to MongoDB.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Analytics Tab */}
                    {activeTab === 'analytics' && (
                        <div className="animate-fade-in" style={{ display: 'grid', gap: '1.5rem' }}>
                            <div className="glass-card-static">
                                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <BarChart3 size={18} color="var(--primary)" /> Career Match Distribution
                                </h3>
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    {Object.entries(distribution).sort((a, b) => (b[1] as number) - (a[1] as number)).map(([career, count]) => (
                                        <div key={career} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '160px', fontSize: '0.9rem', fontWeight: '500', flexShrink: 0 }}>{career}</div>
                                            <div style={{ flex: 1, height: '32px', background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem', overflow: 'hidden', position: 'relative' }}>
                                                <div style={{
                                                    width: `${((count as number) / totalDist) * 100}%`,
                                                    height: '100%',
                                                    background: `linear-gradient(90deg, ${getCareerColor(career)}80, ${getCareerColor(career)})`,
                                                    borderRadius: '0.5rem',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                                                    paddingRight: '0.75rem',
                                                    fontSize: '0.8rem', fontWeight: '600',
                                                    transition: 'width 1s ease'
                                                }}>
                                                    {count as number}
                                                </div>
                                            </div>
                                            <div style={{ width: '50px', textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                {Math.round(((count as number) / totalDist) * 100)}%
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="glass-card-static animate-fade-in">
                            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Settings size={18} color="var(--primary)" /> Settings
                            </h3>
                            <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '500px' }}>
                                <div className="input-group">
                                    <label>Admin Name</label>
                                    <input className="input" defaultValue={user?.name || 'Admin'} />
                                </div>
                                <div className="input-group">
                                    <label>Email</label>
                                    <input className="input" defaultValue={user?.email || 'admin@careerwise.com'} />
                                </div>
                                <div className="input-group">
                                    <label>Assessment Time Limit (minutes)</label>
                                    <input className="input" type="number" defaultValue={30} />
                                </div>
                                <button className="btn btn-primary" style={{ width: 'fit-content' }}>
                                    <Save size={16} /> Save Settings
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Question Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1000, padding: '2rem'
                }} onClick={() => setShowModal(false)}>
                    <div className="glass-card-static animate-fade-in-up" style={{
                        maxWidth: '560px', width: '100%', maxHeight: '80vh',
                        overflowY: 'auto'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3>{editingQuestion ? 'Edit Question' : 'Add New Question'}</h3>
                            <button onClick={() => setShowModal(false)} className="btn btn-sm" style={{ padding: '0.4rem' }}>
                                <X size={18} />
                            </button>
                        </div>
                        <div style={{ display: 'grid', gap: '1.25rem' }}>
                            <div className="input-group">
                                <label>Question Text</label>
                                <input className="input" placeholder="Enter question..." defaultValue={editingQuestion?.text} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="input-group">
                                    <label>Type</label>
                                    <select className="input" defaultValue={editingQuestion?.type || 'personality'}
                                        style={{ cursor: 'pointer' }}>
                                        <option value="personality">Personality</option>
                                        <option value="skill">Skill</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Category</label>
                                    <input className="input" placeholder="e.g. Communication" defaultValue={editingQuestion?.category} />
                                </div>
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
                                onClick={() => setShowModal(false)}>
                                <Save size={16} /> {editingQuestion ? 'Update' : 'Add'} Question
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
