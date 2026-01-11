import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';
import { User, Mail, Briefcase, Clock, FileText, ChevronRight, Download, Trash2, Edit2, TrendingUp, Calendar, ShieldCheck, Star, AlertTriangle, Award, Zap, Diamond, BookOpen, Gem } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { authenticatedFetch } from '../utils/apiUtils';
import { API_ENDPOINTS } from '../config/api';

const Profile = () => {
    const { user: authUser, updateUser } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
    const [warningModal, setWarningModal] = useState({ show: false, message: '' });
    const [selectedCompare, setSelectedCompare] = useState([]);
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState({
        name: "Guest User",
        email: "guest@example.com",
        title: "Aspiring Professional",
        location: "iTi",
        joined: "Just now",
        plan: "Premium"
    });

    useEffect(() => {
        if (authUser) {
            setUser(prev => ({
                ...prev,
                name: authUser.name || prev.name,
                email: authUser.email || prev.email,
                plan: authUser.plan || prev.plan,
                title: authUser.title || prev.title,
                location: authUser.location || prev.location,
                joined: authUser.joined || prev.joined // Update joined date
            }));
        }
    }, [authUser]);

    const handleSaveProfile = async () => {
        try {
            await updateUser({
                name: user.name,
                email: user.email, // Added email to updates
                title: user.title,
                location: user.location
            });
            setIsEditing(false);
        } catch (error) {
            alert("Failed to update profile: " + error.message);
        }
    };

    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState({
        totalAnalyses: 0,
        averageScore: 0,
        bestScore: 0,
        latestScore: 0,
        trend: 'neutral',
        improvement: 0
    });

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await authenticatedFetch(`${API_ENDPOINTS.analysis}/history`);

                if (response.ok) {
                    const data = await response.json();
                    // Process dates for display
                    const processedHistory = data.map(item => ({
                        ...item,
                        title: item.fileName || "Resume Analysis",
                        date: new Date(item.createdAt).toLocaleDateString(),
                        type: item.fileName?.endsWith('.docx') ? 'DOCX' : 'PDF'
                    })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by newest first

                    setHistory(processedHistory);
                } else {
                    console.error('Failed to fetch history');
                }
            } catch (error) {
                console.error('Error fetching history:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchStats = async () => {
            try {
                const response = await authenticatedFetch(`${API_ENDPOINTS.analysis}/stats`);

                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                } else {
                    console.error('Failed to fetch stats');
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        if (authUser) {
            fetchHistory();
            fetchStats();
        }
    }, [authUser]);

    // Badge Calculation Logic
    const badges = [
        {
            id: 'rookie',
            label: 'Rookie',
            icon: <FileText size={20} />,
            color: '#10B981', // Emerald
            bg: '#D1FAE5',
            condition: stats.totalAnalyses >= 1,
            description: "Completed your first analysis"
        },
        {
            id: 'rising_star',
            label: 'Rising Star',
            icon: <TrendingUp size={20} />,
            color: '#3B82F6', // Blue
            bg: '#DBEAFE', // Blue
            condition: stats.improvement > 0,
            description: "Improved your resume score"
        },
        {
            id: 'pro',
            label: 'Pro Candidate',
            icon: <Star size={20} />,
            color: '#F59E0B', // Amber
            bg: '#FEF3C7',
            condition: stats.bestScore >= 80,
            description: "Achieved a score of 80+"
        },
        {
            id: 'dedicated',
            label: 'Dedicated',
            icon: <BookOpen size={20} />,
            color: '#8B5CF6', // Violet
            bg: '#EDE9FE',
            condition: stats.totalAnalyses >= 5,
            description: "Analyzed 5+ resumes"
        },
        {
            id: 'diamond',
            label: 'Diamond CV',
            icon: <Gem size={20} />,
            color: '#06B6D4', // Cyan
            bg: '#CFFAFE',
            condition: stats.bestScore >= 95,
            description: "Achieved a near-perfect score (95+)"
        }
    ];

    // Create chart data with better labels
    const chartData = history.map((h, index) => ({
        name: `#${history.length - index}`,
        score: h.score,
        fileName: h.title
    })).reverse(); // Show oldest to newest

    const getScoreStyle = (score) => {
        if (score >= 90) return { color: '#059669', backgroundColor: '#D1FAE5', border: '1px solid #10B981' };
        if (score >= 70) return { color: '#2563EB', backgroundColor: '#DBEAFE', border: '1px solid #3B82F6' };
        if (score >= 50) return { color: '#D97706', backgroundColor: '#FEF3C7', border: '1px solid #F59E0B' };
        return { color: '#E11D48', backgroundColor: '#FFE4E6', border: '1px solid #EF4444' };
    };

    // Show delete confirmation modal
    const handleDeleteClick = (id, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        console.log('Delete clicked for ID:', id);
        setDeleteConfirm({ show: true, id });
    };

    // Actually perform the delete
    const confirmDelete = async () => {
        const id = deleteConfirm.id;
        setDeleteConfirm({ show: false, id: null });

        try {
            const token = sessionStorage.getItem('access_token');
            const deleteUrl = `${API_ENDPOINTS.analysis}/${id}`;
            console.log('Sending DELETE request to:', deleteUrl);
            console.log('Token exists:', !!token);

            const response = await fetch(deleteUrl, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (response.ok) {
                console.log('Delete successful, removing from state');
                setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
            } else {
                let errorMessage = 'Failed to delete analysis';
                try {
                    const errorData = await response.json();
                    console.log('Error response:', errorData);
                    errorMessage = errorData.message || errorMessage;
                } catch (parseError) {
                    console.error("Error parsing response", parseError);
                }
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete analysis. Please try again.');
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm({ show: false, id: null });
    };

    // Handle Checkbox Selection
    const toggleSelection = (id) => {
        if (selectedCompare.includes(id)) {
            setSelectedCompare(prev => prev.filter(itemId => itemId !== id));
        } else {
            if (selectedCompare.length < 2) {
                setSelectedCompare(prev => [...prev, id]);
            } else {
                // If 2 already selected, replace the first one (optional, or just do nothing)
                // Let's just do nothing to enforce "deselect first"
                setWarningModal({ show: true, message: "You can only compare 2 analyses at a time. Please deselect one first." });
            }
        }
    };

    // Handle Compare Navigation
    const handleCompare = async () => {
        if (selectedCompare.length !== 2) return;

        // Find the full objects from history
        const item1 = history.find(h => h.id === selectedCompare[0]);
        const item2 = history.find(h => h.id === selectedCompare[1]);

        if (item1 && item2) {
            // Need to fetch full details if they are not fully populated in history list? 
            // The history list usually has minimal info. Let's fetch both to be safe.
            try {
                const [res1, res2] = await Promise.all([
                    authenticatedFetch(`${API_ENDPOINTS.analysis}/${item1.id}`),
                    authenticatedFetch(`${API_ENDPOINTS.analysis}/${item2.id}`)
                ]);

                if (res1.ok && res2.ok) {
                    const data1 = await res1.json();
                    const data2 = await res2.json();

                    // Navigate to Compare page
                    navigate('/compare', {
                        state: {
                            analysis1: data1,
                            analysis2: data2
                        }
                    });
                } else {
                    alert("Failed to fetch full analysis data for comparison.");
                }
            } catch (err) {
                console.error("Comparison fetch error:", err);
                alert("Error loading comparison data.");
            }
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

            {/* Analytics Summary Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}
            >
                {/* Total Analyses */}
                <Card style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{
                        width: '50px', height: '50px',
                        borderRadius: '50%',
                        background: '#EEF2FF',
                        color: '#4F46E5',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1rem',
                        fontSize: '1.25rem'
                    }}>
                        <FileText size={24} />
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{stats.totalAnalyses}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Analyses</div>
                </Card>

                {/* Average Score */}
                <Card style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{
                        width: '50px', height: '50px',
                        borderRadius: '50%',
                        background: '#FEF3C7',
                        color: '#D97706',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1rem',
                        fontSize: '1.25rem'
                    }}>
                        <TrendingUp size={24} />
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{stats.averageScore}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Average Score</div>
                </Card>

                {/* Best Score */}
                <Card style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{
                        width: '50px', height: '50px',
                        borderRadius: '50%',
                        background: '#DCFCE7',
                        color: '#059669',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1rem',
                        fontSize: '1.25rem'
                    }}>
                        <Star size={24} />
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#059669' }}>{stats.bestScore}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Best Score</div>
                </Card>

                {/* Score Trend */}
                <Card style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{
                        width: '50px', height: '50px',
                        borderRadius: '50%',
                        background: stats.trend === 'improving' ? '#DCFCE7' : stats.trend === 'declining' ? '#FEE2E2' : '#F3F4F6',
                        color: stats.trend === 'improving' ? '#059669' : stats.trend === 'declining' ? '#DC2626' : '#6B7280',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1rem',
                        fontSize: '1.25rem'
                    }}>
                        <TrendingUp size={24} style={{ transform: stats.trend === 'declining' ? 'rotate(180deg)' : 'none' }} />
                    </div>
                    <div style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: stats.trend === 'improving' ? '#059669' : stats.trend === 'declining' ? '#DC2626' : '#6B7280',
                        textTransform: 'capitalize'
                    }}>
                        {stats.trend === 'improving' ? `+${stats.improvement}` : stats.trend === 'declining' ? stats.improvement : '—'}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Score Trend</div>
                    {/* Achievements Section */}
                </Card>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{ marginBottom: '2rem' }}
            >
                <Card>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Award size={20} color="#F59E0B" /> Achievements
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {badges.map(badge => (
                            <div key={badge.id} style={{
                                flex: '1 1 150px',
                                padding: '1rem',
                                borderRadius: '12px',
                                background: badge.condition ? badge.bg : '#F3F4F6',
                                border: badge.condition ? `1px solid ${badge.color}` : '1px solid #E5E7EB',
                                opacity: badge.condition ? 1 : 0.6,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                transition: 'all 0.3s ease',
                                transform: badge.condition ? 'scale(1)' : 'scale(0.95)',
                                filter: badge.condition ? 'none' : 'grayscale(100%)',
                                position: 'relative',
                                cursor: 'help'
                            }} title={badge.description}>
                                <div style={{
                                    color: badge.condition ? badge.color : '#9CA3AF',
                                    marginBottom: '0.5rem'
                                }}>
                                    {badge.icon}
                                </div>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: badge.condition ? 'var(--text-main)' : '#9CA3AF' }}>
                                    {badge.label}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: badge.condition ? 'var(--text-muted)' : '#9CA3AF', marginTop: '0.25rem', lineHeight: '1.2' }}>
                                    {badge.description}
                                </div>
                                {!badge.condition && (
                                    <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>Locked</div>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
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
                                <Mail size={18} color="var(--text-muted)" />
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={user.email}
                                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                                        style={{ flex: 1, padding: '0.25rem', border: '1px solid var(--border)', borderRadius: '4px' }}
                                    />
                                ) : user.email}
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
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value, name, props) => [value, 'Score']}
                                        labelFormatter={(label, payload) => {
                                            if (payload && payload[0]) {
                                                return payload[0].payload.fileName || label;
                                            }
                                            return label;
                                        }}
                                    />
                                    <Area type="monotone" dataKey="score" stroke="var(--accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        {history.length >= 2 ? (
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem' }}>
                                {(() => {
                                    const scores = history.map(h => h.score);
                                    const firstScore = scores[scores.length - 1]; // Oldest
                                    const lastScore = scores[0]; // Newest
                                    const change = lastScore - firstScore;
                                    const changePercent = firstScore > 0 ? Math.round((change / firstScore) * 100) : 0;

                                    if (change > 0) {
                                        return <>Your score has improved by <span style={{ color: 'var(--success)', fontWeight: 600 }}>+{changePercent}%</span> since your first analysis!</>;
                                    } else if (change < 0) {
                                        return <>Your score decreased by <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{changePercent}%</span>. Keep improving!</>;
                                    } else {
                                        return <>Your score is consistent. Keep up the good work!</>;
                                    }
                                })()}
                            </p>
                        ) : (
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem' }}>
                                Upload more resumes to see your progress over time.
                            </p>
                        )}
                    </Card>
                </div>

                {/* Right Column: History Table */}
                <Card style={{ flex: 1, height: 'fit-content' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <h3 style={{ fontSize: '1.5rem' }}>Analysis History</h3>
                            {selectedCompare.length > 0 && (
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    ({selectedCompare.length}/2 selected)
                                </span>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {selectedCompare.length === 2 && (
                                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                    <Button size="sm" variant="primary" onClick={handleCompare}>
                                        Compare Selected
                                    </Button>
                                </motion.div>
                            )}
                            <Link to="/analyze">
                                <Button size="sm" variant="accent">+ New Analysis</Button>
                            </Link>
                        </div>
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
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={selectedCompare.includes(item.id)}
                                                onChange={() => toggleSelection(item.id)}
                                                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                                            />
                                        </div>
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
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                style={{ padding: '0.5rem' }}
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    try {
                                                        const response = await authenticatedFetch(`${API_ENDPOINTS.analysis}/${item.id}`);
                                                        if (response.ok) {
                                                            const analysisData = await response.json();
                                                            navigate('/results', {
                                                                state: {
                                                                    analysisResult: analysisData,
                                                                    fileName: item.title
                                                                }
                                                            });
                                                        } else {
                                                            alert('Failed to load analysis');
                                                        }
                                                    } catch (error) {
                                                        console.error('Error loading analysis:', error);
                                                        alert('Failed to load analysis');
                                                    }
                                                }}
                                            >
                                                <ChevronRight size={18} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                style={{ padding: '0.5rem', color: 'var(--danger)' }}
                                                onClick={(e) => handleDeleteClick(item.id, e)}
                                            >
                                                <Trash2 size={18} />
                                            </Button>
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
            </div >

            {/* Custom Delete Confirmation Modal */}
            {
                deleteConfirm.show && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999
                    }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 'var(--radius-lg)',
                                padding: '2rem',
                                maxWidth: '400px',
                                width: '90%',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    backgroundColor: '#FEE2E2',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Trash2 size={24} color="#DC2626" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>Delete Analysis?</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>This action cannot be undone.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <Button variant="outline" fullWidth onClick={cancelDelete}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    fullWidth
                                    onClick={confirmDelete}
                                    style={{ backgroundColor: '#DC2626', border: 'none' }}
                                >
                                    Delete
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )
            }

            {/* Warning Modal */}
            {
                warningModal.show && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999
                    }} onClick={() => setWarningModal({ show: false, message: '' })}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 'var(--radius-lg)',
                                padding: '2rem',
                                maxWidth: '400px',
                                width: '90%',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                textAlign: 'center'
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{
                                width: '60px', height: '60px',
                                borderRadius: '50%',
                                backgroundColor: '#FEF3C7',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem'
                            }}>
                                <AlertTriangle size={32} color="#D97706" />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Limit Reached</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{warningModal.message}</p>
                            <Button variant="primary" fullWidth onClick={() => setWarningModal({ show: false, message: '' })}>
                                Got it
                            </Button>
                        </motion.div>
                    </div>
                )
            }
        </div >
    );
};

export default Profile;
