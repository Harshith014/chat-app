import React, { useContext } from 'react';
import { ColorModeContext } from '../context/ThemeContext';
import MessageList from './MessageList';
import '../css/ConversationPanel.css';

const ConversationPanel = ({
    receiver,
    receiverName,
    chatHistory,
    chatHistoryRef,
    selectedTheme,
    onMessageClick,
    onBackClick,
}) => {
    const { mode } = useContext(ColorModeContext);

    const getThemeStyle = () => {
        if (!selectedTheme || selectedTheme === 'defaultTheme') {
            return {};
        }

        const theme = selectedTheme;
        if (typeof theme === 'object') {
            return {
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
            };
        }
        return {};
    };

    return (
        <div
            className={`conversation-panel ${mode === 'dark' ? 'dark' : 'light'}`}
            style={getThemeStyle()}
        >
            {/* Header */}
            <div className="conversation-header">
                <button className="back-button" onClick={onBackClick}>
                    ←
                </button>
                <div className="header-info">
                    <h2 className="receiver-name">{receiverName}</h2>
                </div>
                <button
                    className="context-toggle-mobile"
                    onClick={() => {/* Toggle context drawer */}}
                >
                    ⋮
                </button>
            </div>

            {/* Message List */}
            <div className="message-container" ref={chatHistoryRef}>
                <MessageList
                    messages={chatHistory}
                    onMessageClick={onMessageClick}
                />
            </div>
        </div>
    );
};

export default ConversationPanel;
