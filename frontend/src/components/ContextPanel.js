import React, { useContext } from 'react';
import { ColorModeContext } from '../context/ThemeContext';
import SmartInputArea from './SmartInputArea';
import '../css/ContextPanel.css';

const ContextPanel = ({
    contextMode,
    message,
    onMessageChange,
    onSendMessage,
    onInputFocus,
    onInputBlur,
    imageFile,
    onImageSelect,
    onImageUpload,
    docFile,
    onDocSelect,
    onDocUpload,
    showEmojiPicker,
    onEmojiPickerToggle,
    targetLanguage,
    onLanguageChange,
    showThemeSelector,
    onThemeSelectorToggle,
    themeOptions,
    onThemeSelect,
    selectedMessage,
    onCloseSelection,
}) => {
    const { mode } = useContext(ColorModeContext);

    const renderContent = () => {
        switch (contextMode) {
            case 'typing':
                return (
                    <div className="context-content typing-mode">
                        <h3>Compose Message</h3>
                        <SmartInputArea
                            message={message}
                            onMessageChange={onMessageChange}
                            onSendMessage={onSendMessage}
                            onInputFocus={onInputFocus}
                            onInputBlur={onInputBlur}
                            imageFile={imageFile}
                            onImageSelect={onImageSelect}
                            onImageUpload={onImageUpload}
                            docFile={docFile}
                            onDocSelect={onDocSelect}
                            onDocUpload={onDocUpload}
                            showEmojiPicker={showEmojiPicker}
                            onEmojiPickerToggle={onEmojiPickerToggle}
                            targetLanguage={targetLanguage}
                            onLanguageChange={onLanguageChange}
                            showThemeSelector={showThemeSelector}
                            onThemeSelectorToggle={onThemeSelectorToggle}
                            themeOptions={themeOptions}
                            onThemeSelect={onThemeSelect}
                        />
                    </div>
                );

            case 'selection':
                return (
                    <div className="context-content selection-mode">
                        <div className="selection-header">
                            <h3>Message Details</h3>
                            <button className="close-button" onClick={onCloseSelection}>×</button>
                        </div>
                        {selectedMessage && (
                            <div className="message-details">
                                <div className="detail-content">
                                    {selectedMessage.message && (
                                        <p className="detail-text">{selectedMessage.message}</p>
                                    )}
                                    {selectedMessage.imageUrl && (
                                        <img src={selectedMessage.imageUrl} alt="detail" className="detail-image" />
                                    )}
                                </div>
                                <div className="detail-meta">
                                    <span className="detail-time">
                                        {new Date(selectedMessage.createdAt || selectedMessage.timestamp).toLocaleString()}
                                    </span>
                                    <div className="detail-actions">
                                        <button className="action-button">Copy</button>
                                        {/* <button className="action-button">React</button> */}
                                        {/* <button className="action-button">Delete</button> */}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'idle':
            default:
                return (
                    <div className="context-content idle-mode">
                        <div className="idle-header">
                            <h3>Chat Info</h3>
                        </div>
                        <div className="idle-content">
                            <p className="idle-message">Select a message to view details or start typing to compose a new message</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className={`context-panel ${mode === 'dark' ? 'dark' : 'light'}`}>
            {renderContent()}
        </div>
    );
};

export default ContextPanel;
