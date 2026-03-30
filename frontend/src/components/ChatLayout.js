import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ColorModeContext } from '../context/ThemeContext';
import { getUserIdFromToken } from '../utils/Auth';
import ConversationPanel from './ConversationPanel';
import ContextPanel from './ContextPanel';
import UserSidebar from './UserSidebar';
import '../css/ChatLayout.css';

const themeOptions = [
    { name: 'Default', backgroundColor: '#ffffff', textColor: '#000000' },
    { name: 'Dark Mode', backgroundColor: '#333333', textColor: '#ffffff' },
    { name: 'Ocean Blue', backgroundColor: '#0077cc', textColor: '#ffffff' },
    { name: 'Forest Green', backgroundColor: '#388e3c', textColor: '#ffffff' },
    { name: 'Sunset Orange', backgroundColor: '#ff5722', textColor: '#ffffff' },
];

const ChatLayout = () => {
    const chatHistoryRef = useRef(null);

    // Main chat state
    const [receiver, setReceiver] = useState('');
    const [receiverName, setReceiverName] = useState('');
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState({});
    const [translationsAvailable, setTranslationsAvailable] = useState(true);

    // Input attachment state
    const [imageFile, setImageFile] = useState(null);
    const [docFile, setDocFile] = useState(null);

    // UI state
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showThemeSelector, setShowThemeSelector] = useState(false);
    const [targetLanguage, setTargetLanguage] = useState('en');
    const [selectedThemes, setSelectedThemes] = useState({});

    // Context panel state
    const [contextMode, setContextMode] = useState('idle'); // 'idle', 'typing', 'selection', 'media', 'voice'
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showContextDrawer, setShowContextDrawer] = useState(false);

    // Theme and mode
    const { mode } = useContext(ColorModeContext);

    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    };

    // Fetch chat history when receiver changes
    useEffect(() => {
        if (receiver) {
            fetchChatHistory(receiver);
            fetchThemeFromDB();
        }
    }, [receiver]);

    // Auto-scroll to latest message
    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const fetchChatHistory = async (receiverId) => {
        try {
            const userId = getUserIdFromToken();
            if (!userId) {
                toast.error('User ID not found');
                return;
            }

            const response = await axios.get(
                `${process.env.REACT_APP_URI}/api/chat/${userId}/${receiverId}`,
                { headers: config.headers }
            );

            setChatHistory((prev) => ({
                ...prev,
                [receiverId]: response.data,
            }));
        } catch (err) {
            toast.error('Failed to load chat history');
            console.error(err);
        }
    };

    const fetchThemeFromDB = async () => {
        try {
            const userId = getUserIdFromToken();
            if (!userId) {
                toast.error('User ID not found');
                return;
            }

            const response = await axios.get(
                `${process.env.REACT_APP_URI}/api/chat/theme?sender=${userId}&receiver=${receiver}`
            );
            const themeFromDB = response.data.theme;
            setSelectedThemes((prevThemes) => ({ ...prevThemes, [receiver]: themeFromDB }));
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setSelectedThemes((prevThemes) => ({ ...prevThemes, [receiver]: 'defaultTheme' }));
            } else {
                console.error(error);
            }
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim() && !imageFile && !docFile) {
            return;
        }

        try {
            const userId = getUserIdFromToken();
            if (!userId) {
                toast.error('User ID not found');
                return;
            }

            const data = {
                sender: userId,
                receiver: receiver,
                message: message,
                targetLanguage: targetLanguage,
            };

            const res = await axios.post(
                `${process.env.REACT_APP_URI}/api/chat/send`,
                data,
                { headers: config.headers }
            );

            const translationsAvailable = res.data.translationsAvailable;
            setTranslationsAvailable(translationsAvailable);

            if (translationsAvailable) {
                setMessage('');
                fetchChatHistory(receiver);
                setContextMode('idle');
            } else {
                setTargetLanguage('en');
            }
        } catch (err) {
            toast.error(err.message || 'Failed to send message');
        }
    };

    const handleImageUpload = async () => {
        if (!imageFile) {
            toast.error('No image selected');
            return;
        }

        try {
            const userId = getUserIdFromToken();
            if (!userId) {
                toast.error('User ID not found');
                return;
            }

            const formData = new FormData();
            formData.append('sender', userId);
            formData.append('receiver', receiver);
            formData.append('image', imageFile);

            await axios.post(
                `${process.env.REACT_APP_URI}/api/chat/image`,
                formData,
                {
                    headers: {
                        ...config.headers,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setImageFile(null);
            fetchChatHistory(receiver);
            setContextMode('idle');
            toast.success('Image sent successfully');
        } catch (err) {
            toast.error(err.message || 'Failed to upload image');
        }
    };

    const handleDocUpload = async () => {
        if (!docFile) {
            toast.error('No document selected');
            return;
        }

        try {
            const userId = getUserIdFromToken();
            if (!userId) {
                toast.error('User ID not found');
                return;
            }

            const formData = new FormData();
            formData.append('sender', userId);
            formData.append('receiver', receiver);
            formData.append('file', docFile);

            await axios.post(
                `${process.env.REACT_APP_URI}/api/chat/docs`,
                formData,
                {
                    headers: {
                        ...config.headers,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setDocFile(null);
            fetchChatHistory(receiver);
            setContextMode('idle');
            toast.success('Document sent successfully');
        } catch (err) {
            toast.error(err.message || 'Failed to upload document');
        }
    };

    const handleThemeSelect = async (theme) => {
        try {
            const userId = getUserIdFromToken();
            if (!userId) {
                toast.error('User ID not found');
                return;
            }

            const response = await axios.post(
                `${process.env.REACT_APP_URI}/api/chat/theme`,
                {
                    sender: userId,
                    receiver: receiver,
                    theme: theme,
                },
                { headers: config.headers }
            );

            setSelectedThemes((prevThemes) => ({ ...prevThemes, [receiver]: theme }));
            toast.success('Theme updated successfully');
        } catch (error) {
            console.error('Error selecting theme:', error);
            toast.error('Failed to save theme');
        }
    };

    const handleUserClick = (userId, userName) => {
        setReceiver(userId);
        setReceiverName(userName);
        setShowContextDrawer(false);
    };

    const handleMessageClick = (msg) => {
        setSelectedMessage(msg);
        setContextMode('selection');
        setShowContextDrawer(true);
    };

    const handleInputFocus = () => {
        setContextMode('typing');
        setShowContextDrawer(true);
    };

    const handleInputBlur = () => {
        if (!selectedMessage) {
            setContextMode('idle');
            setShowContextDrawer(false);
        }
    };

    return (
        <div className={`chat-layout ${mode === 'dark' ? 'dark' : 'light'}`}>
            {/* User Sidebar - Hidden on mobile by default */}
            <div className="user-sidebar-container">
                <UserSidebar
                    receiver={receiver}
                    onUserClick={handleUserClick}
                />
            </div>

            {receiver ? (
                <>
                    {/* Conversation Panel */}
                    <div className="conversation-panel-container">
                        <ConversationPanel
                            receiver={receiver}
                            receiverName={receiverName}
                            chatHistory={chatHistory[receiver] || []}
                            chatHistoryRef={chatHistoryRef}
                            selectedTheme={selectedThemes[receiver]}
                            onMessageClick={handleMessageClick}
                            onBackClick={() => {
                                setReceiver('');
                                setReceiverName('');
                                setSelectedMessage(null);
                                setContextMode('idle');
                            }}
                        />
                    </div>

                    {/* Context Panel - Dynamic right sidebar */}
                    <div className={`context-panel-container ${showContextDrawer ? 'show' : ''}`}>
                        <ContextPanel
                            contextMode={contextMode}
                            message={message}
                            onMessageChange={setMessage}
                            onSendMessage={handleSendMessage}
                            onInputFocus={handleInputFocus}
                            onInputBlur={handleInputBlur}
                            imageFile={imageFile}
                            onImageSelect={setImageFile}
                            onImageUpload={handleImageUpload}
                            docFile={docFile}
                            onDocSelect={setDocFile}
                            onDocUpload={handleDocUpload}
                            showEmojiPicker={showEmojiPicker}
                            onEmojiPickerToggle={setShowEmojiPicker}
                            targetLanguage={targetLanguage}
                            onLanguageChange={setTargetLanguage}
                            showThemeSelector={showThemeSelector}
                            onThemeSelectorToggle={setShowThemeSelector}
                            themeOptions={themeOptions}
                            onThemeSelect={handleThemeSelect}
                            selectedMessage={selectedMessage}
                            onCloseSelection={() => {
                                setSelectedMessage(null);
                                setContextMode('idle');
                                setShowContextDrawer(false);
                            }}
                        />
                    </div>

                    {/* Mobile drawer overlay */}
                    {showContextDrawer && (
                        <div
                            className="context-drawer-overlay"
                            onClick={() => {
                                setShowContextDrawer(false);
                                if (!selectedMessage) setContextMode('idle');
                            }}
                        />
                    )}
                </>
            ) : (
                <div className="no-conversation">
                    <p>Select a user to start chatting</p>
                </div>
            )}

            {/* Toast notifications */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={mode}
            />
        </div>
    );
};

export default ChatLayout;
