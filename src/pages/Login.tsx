import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('admin@careerwise.com');
    const [password, setPassword] = useState('admin123');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.login(email, password);
            navigate('/admin');
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <header className="nav">
                <Link to="/" className="nav-brand">CareerWise</Link>
                <Link to="/" className="btn btn-outline btn-sm">
                    <ArrowLeft size={16} /> Back to Home
                </Link>
            </header>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <div className="animate-fade-in-up" style={{ width: '100%', maxWidth: '440px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '1rem',
                            background: 'linear-gradient(135deg, var(--primary), #7c3aed)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.35)'
                        }}>
                            <Shield size={28} color="white" />
                        </div>
                        <h2 style={{ marginBottom: '0.5rem' }}>Admin Portal</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Sign in to manage assessments and view analytics</p>
                    </div>

                    <div className="glass-card-static">
                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {error && (
                                <div style={{
                                    padding: '0.875rem 1.25rem', borderRadius: '0.75rem',
                                    background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                                    color: '#f87171', fontSize: '0.9rem'
                                }}>
                                    {error}
                                </div>
                            )}

                            <div className="input-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    className="input"
                                    placeholder="admin@careerwise.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="input"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        style={{ paddingRight: '3rem' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                                            background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer',
                                            padding: '0.25rem'
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                                style={{
                                    width: '100%', justifyContent: 'center', padding: '1rem',
                                    fontSize: '1rem', marginTop: '0.5rem',
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                {loading ? (
                                    <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} />
                                ) : (
                                    <><LogIn size={18} /> Sign In</>
                                )}
                            </button>
                        </form>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                        Default credentials: admin@careerwise.com / admin123
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
