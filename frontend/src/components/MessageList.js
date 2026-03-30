import React from 'react';
import MessageBubble from './MessageBubble';
import '../css/MessageList.css';

const MessageList = ({ messages = [], onMessageClick }) => {
    if (!messages || messages.length === 0) {
        return (
            <div className="empty-chat">
                <p>No messages yet. Start the conversation!</p>
            </div>
        );
    }

    // Group messages by date
    const groupedMessages = messages.reduce((acc, msg, index) => {
        const msgDate = new Date(msg.createdAt || msg.timestamp).toLocaleDateString();
        if (!acc[msgDate]) {
            acc[msgDate] = [];
        }
        acc[msgDate].push({ ...msg, index });
        return acc;
    }, {});

    return (
        <div className="message-list">
            {Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date}>
                    <div className="date-divider">
                        <span>{date}</span>
                    </div>
                    {msgs.map((msg) => (
                        <MessageBubble
                            key={msg._id || msg.index}
                            message={msg}
                            onClick={() => onMessageClick(msg)}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default MessageList;
