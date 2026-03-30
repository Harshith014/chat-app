import React, { useState, useContext } from 'react';
import { getUserIdFromToken } from '../utils/Auth';
import { ColorModeContext } from '../context/ThemeContext';
import DocumentPreview from './DocPreview';
import VoiceMessage from './VoiceMsg';
import '../css/MessageBubble.css';

const MessageBubble = ({ message, onClick }) => {
    const userId = getUserIdFromToken();
    const [showTime, setShowTime] = useState(false);
    const { mode } = useContext(ColorModeContext);

    const isOwnMessage = message.sender === userId;
    const timestamp = new Date(message.createdAt || message.timestamp).toLocaleTimeString();

    const renderMessageContent = () => {
        // Text message
        if (message.message) {
            return <p className="message-text">{message.message}</p>;
        }

        // Image message
        if (message.imageUrl) {
            return (
                <img
                    src={message.imageUrl}
                    alt="shared"
                    className="message-image"
                />
            );
        }

        // Document message
        if (message.docUrl) {
            return <DocumentPreview docUrl={message.docUrl} />;
        }

        // Audio message
        if (message.voiceMessageUrl) {
            return <VoiceMessage audioUrl={message.voiceMessageUrl} />;
        }

        return null;
    };

    return (
        <div
            className={`message-bubble ${isOwnMessage ? 'sent' : 'received'} ${mode === 'dark' ? 'dark' : 'light'}`}
            onClick={onClick}
            onMouseEnter={() => setShowTime(true)}
            onMouseLeave={() => setShowTime(false)}
        >
            <div className="message-content">
                {renderMessageContent()}
            </div>
            {showTime && (
                <span className="message-time">{timestamp}</span>
            )}
        </div>
    );
};

export default MessageBubble;
