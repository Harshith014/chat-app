import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ColorModeContext } from '../context/ThemeContext';
import { getUserIdFromToken } from '../utils/Auth';
import '../css/UserSidebar.css';

const UserSidebar = ({ receiver, onUserClick }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { mode } = useContext(ColorModeContext);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const userId = getUserIdFromToken();
            if (!userId) {
                console.error('User ID not found');
                return;
            }

            const response = await axios.get(
                `${process.env.REACT_APP_URI}/api/auth/users/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            setUsers(response.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`user-sidebar ${mode === 'dark' ? 'dark' : 'light'}`}>
            {/* Header */}
            <div className="sidebar-header">
                <h2 className="sidebar-title">Contacts</h2>
            </div>

            {/* Search Bar */}
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* User List */}
            <div className="user-list">
                {loading ? (
                    <div className="loading">Loading users...</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="empty-state">No users found</div>
                ) : (
                    filteredUsers.map((user) => (
                        <div
                            key={user._id}
                            className={`user-card ${receiver === user._id ? 'active' : ''}`}
                            onClick={() => onUserClick(user._id, user.name)}
                        >
                            <div className="user-avatar">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="user-info">
                                <p className="user-name">{user.name}</p>
                                <p className="user-email">{user.email}</p>
                            </div>
                            <div className="user-status">
                                <span className="status-indicator online"></span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UserSidebar;
