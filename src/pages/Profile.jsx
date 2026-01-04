import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';
import { User, Mail, Briefcase, Clock, FileText, ChevronRight, Download, Trash2, Edit2, TrendingUp, Calendar, ShieldCheck, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user: authUser, updateUser } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    const [user, setUser] = useState({
        name: "Guest User",
        email: "guest@example.com",
        title: "Aspiring Professional",
        location: "Unknown",
        joined: "Just now",
        plan: "Free"
    });

    useEffect(() => {
        if (authUser) {
            setUser(prev => ({
                ...prev,
                name: authUser.name || prev.name,
                email: authUser.email || prev.email,
                plan: authUser.plan || prev.plan,
                title: authUser.title || prev.title,
                location: authUser.location || prev.location
            }));
        }
    }, [authUser]);

    const handleSaveProfile = () => {
        updateUser({
            name: user.name,
            title: user.title,
            location: user.location
        });
        setIsEditing(false);
    };

    // Mock History Data
    const [history, setHistory] = useState([
        { id: 1, date: "2024-05-12", title: "Product Manager Resume", score: 78, type: "PDF" },
        { id: 2, date: "2024-04-28", title: "Tech Lead Resume", score: 92, type: "DOCX" },
        { id: 3, date: "2024-04-10", title: "General Resume V2", score: 65, type: "PDF" },
        { id: 4, date: "2024-03-15", title: "Old Resume", score: 45, type: "PDF" },
    ]);

    const chartData = [
        { name: 'Mar', score: 45 },
        { name: 'Apr', score: 65 },
        { name: 'Apr', score: 92 },
        { name: 'May', score: 78 },
        { name: 'Jun', score: 85 }, // Simulated projection
    ];

    const getScoreStyle = (score) => {
        if (score >= 90) return { color: '#059669', backgroundColor: '#D1FAE5', border: '1px solid #10B981' };
        if (score >= 70) return { color: '#2563EB', backgroundColor: '#DBEAFE', border: '1px solid #3B82F6' };
        if (score >= 50) return { color: '#D97706', backgroundColor: '#FEF3C7', border: '1px solid #F59E0B' };
        return { color: '#E11D48', backgroundColor: '#FFE4E6', border: '1px solid #EF4444' };
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this analysis?")) {
            setHistory(history.filter(item => item.id !== id));
        }
    };

    return (
        <div className="container section-padding">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: '3rem' }}
            >
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Your Career Dashboard</h1>
                <p style={{ color: 'var(--text-muted)' }}>Track your progress and manage your resume versions.</p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>

                {/* Left Column: Profile & Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* User Profile Card */}
                    <Card style={{ position: 'relative', overhead: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '80px', background: 'var(--primary-gradient)', zIndex: 0 }}></div>
                        <div style={{ position: 'relative', zIndex: 1, marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{
                                width: '100px', height: '100px',
                                borderRadius: '50%', border: '4px solid white',
                                background: '#f1f5f9', color: 'var(--primary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '2.5rem', fontWeight: 700,
                                boxShadow: 'var(--shadow-md)', marginBottom: '1rem'
                            }}>
                                {user.name.charAt(0)}
                            </div>

                            {isEditing ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', alignItems: 'center' }}>
                                    <input
                                        type="text"
                                        value={user.name}
                                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                                        style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: 700, padding: '0.25rem', border: '1px solid var(--border)', borderRadius: '4px', width: '80%' }}
                                    />
                                    <input
                                        type="text"
                                        value={user.title}
                                        onChange={(e) => setUser({ ...user, title: e.target.value })}
                                        placeholder="Job Title"
                                        style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '0.25rem', border: '1px solid var(--border)', borderRadius: '4px', width: '80%' }}
                                    />
                                </div>
                            ) : (
                                <>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{user.name}</h2>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{user.title}</p>
                                </>
                            )}

                            <span style={{
                                background: 'var(--accent)', color: 'white',
                                fontSize: '0.75rem', fontWeight: 600,
                                padding: '0.25rem 0.75rem', borderRadius: '999px',
                                display: 'flex', alignItems: 'center', gap: '0.25rem',
                                marginTop: '0.5rem'
                            }}>
                                <Star size={12} fill="white" /> {user.plan} Member
                            </span>
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-main)' }}>
                                <Mail size={18} color="var(--text-muted)" /> {user.email}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-main)' }}>
                                <Briefcase size={18} color="var(--text-muted)" />
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={user.location}
                                        onChange={(e) => setUser({ ...user, location: e.target.value })}
                                        placeholder="Location"
                                        style={{ flex: 1, padding: '0.25rem', border: '1px solid var(--border)', borderRadius: '4px' }}
                                    />
                                ) : user.location}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-main)' }}>
                                <Calendar size={18} color="var(--text-muted)" /> Member since {user.joined}
                            </div>
                        </div>
                        <div style={{ marginTop: '1.5rem' }}>
                            {isEditing ? (
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <Button variant="outline" fullWidth size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                                    <Button variant="primary" fullWidth size="sm" onClick={handleSaveProfile}>Save</Button>
                                </div>
                            ) : (
                                <Button variant="outline" fullWidth size="sm" onClick={() => setIsEditing(true)}><Edit2 size={14} /> Edit Profile</Button>
                            )}
                        </div>
                    </Card>

                    {/* Progress Chart */}
                    <Card>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <TrendingUp size={20} color="var(--success)" /> Score Progression
                        </h3>
                        <div style={{ height: '200px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                                    <YAxis hide domain={[0, 100]} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="score" stroke="var(--accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem' }}>
                            Your average score has increased by <span style={{ color: 'var(--success)', fontWeight: 600 }}>+42%</span> since joined.
                        </p>
                    </Card>
                </div>

                {/* Right Column: History Table */}
                <Card style={{ flex: 1, height: 'fit-content' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.5rem' }}>Analysis History</h3>
                        <Link to="/analyze">
                            <Button size="sm" variant="accent">+ New Analysis</Button>
                        </Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {history.length > 0 ? (
                            history.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '1rem',
                                        background: 'white',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border)',
                                        transition: 'transform 0.2s',
                                        cursor: 'pointer'
                                    }}
                                    className="hover-lift"
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '40px', height: '40px',
                                            background: item.type === 'PDF' ? '#FEE2E2' : '#EFF6FF',
                                            color: item.type === 'PDF' ? '#EF4444' : '#3B82F6',
                                            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 700, fontSize: '0.75rem'
                                        }}>
                                            {item.type}
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.2rem' }}>{item.title}</h4>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                <Clock size={14} /> {item.date}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <span style={{
                                            ...getScoreStyle(item.score),
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '999px',
                                            fontWeight: 700,
                                            fontSize: '0.9rem'
                                        }}>
                                            {item.score}
                                        </span>

                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Link to="/results" state={{ fileName: item.title }}>
                                                <Button variant="ghost" size="sm" style={{ padding: '0.5rem' }}>
                                                    <ChevronRight size={18} />
                                                </Button>
                                            </Link>
                                            <div onClick={() => handleDelete(item.id)}>
                                                <Button variant="ghost" size="sm" style={{ padding: '0.5rem', color: 'var(--danger)' }}>
                                                    <Trash2 size={18} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                <FileText size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <p>No resumes analyzed yet.</p>
                                <Link to="/analyze" style={{ marginTop: '1rem', display: 'inline-block' }}>
                                    <Button variant="outline">Upload First Resume</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
