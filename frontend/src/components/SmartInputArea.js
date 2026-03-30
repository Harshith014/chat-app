import React, { useRef, useState, useContext } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { ColorModeContext } from '../context/ThemeContext';
import '../css/SmartInputArea.css';

const SmartInputArea = ({
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
}) => {
    const imageInputRef = useRef(null);
    const docInputRef = useRef(null);
    const inputRef = useRef(null);
    const { mode } = useContext(ColorModeContext);

    const handleEmojiClick = (emojiObject) => {
        const newMessage = message + emojiObject.emoji;
        onMessageChange(newMessage);
        onEmojiPickerToggle(false);
    };

    const handleImageSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            onImageSelect(e.target.files[0]);
        }
    };

    const handleDocSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            onDocSelect(e.target.files[0]);
        }
    };

    const handleSendClick = () => {
        if (imageFile) {
            onImageUpload();
        } else if (docFile) {
            onDocUpload();
        } else {
            onSendMessage();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendClick();
        }
    };

    return (
        <div className={`smart-input-area ${mode === 'dark' ? 'dark' : 'light'}`}>
            {/* File Preview */}
            {imageFile && (
                <div className="file-preview">
                    <img src={URL.createObjectURL(imageFile)} alt="preview" />
                    <span>{imageFile.name}</span>
                    <button onClick={() => onImageSelect(null)} className="remove-file">×</button>
                </div>
            )}
            {docFile && (
                <div className="file-preview">
                    <span className="doc-icon">📄</span>
                    <span>{docFile.name}</span>
                    <button onClick={() => onDocSelect(null)} className="remove-file">×</button>
                </div>
            )}

            {/* Input Row */}
            <div className="input-row">
                {/* Emoji Picker Toggle */}
                <button
                    className="icon-button"
                    onClick={() => onEmojiPickerToggle(!showEmojiPicker)}
                    title="Emoji"
                >
                    😊
                </button>

                {/* File Input Buttons */}
                <button
                    className="icon-button"
                    onClick={() => imageInputRef.current?.click()}
                    title="Image"
                >
                    🖼️
                </button>
                <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{ display: 'none' }}
                />

                <button
                    className="icon-button"
                    onClick={() => docInputRef.current?.click()}
                    title="Document"
                >
                    📎
                </button>
                <input
                    ref={docInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.xlsx"
                    onChange={handleDocSelect}
                    style={{ display: 'none' }}
                />

                {/* Text Input */}
                <textarea
                    ref={inputRef}
                    className="message-input"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => onMessageChange(e.target.value)}
                    onFocus={onInputFocus}
                    onBlur={onInputBlur}
                    onKeyPress={handleKeyPress}
                    rows="3"
                />

                {/* Language Selector */}
                <select
                    className="language-selector"
                    value={targetLanguage}
                    onChange={(e) => onLanguageChange(e.target.value)}
                    title="Translate to language"
                >
                    <option value="en">EN</option>
                    <option value="es">ES</option>
                    <option value="fr">FR</option>
                    <option value="de">DE</option>
                    <option value="zh">ZH</option>
                </select>

                {/* Theme Selector Button */}
                <button
                    className="icon-button"
                    onClick={() => onThemeSelectorToggle(!showThemeSelector)}
                    title="Theme"
                >
                    🎨
                </button>

                {/* Send Button */}
                <button
                    className="send-button"
                    onClick={handleSendClick}
                    disabled={!message.trim() && !imageFile && !docFile}
                    title="Send message"
                >
                    📤
                </button>
            </div>

            {/* Emoji Picker Popup */}
            {showEmojiPicker && (
                <div className="emoji-picker-container">
                    <EmojiPicker onEmojiClick={handleEmojiClick} theme={mode} />
                </div>
            )}

            {/* Theme Selector Popup */}
            {showThemeSelector && (
                <div className="theme-selector-popup">
                    {themeOptions.map((theme) => (
                        <div
                            key={theme.name}
                            className="theme-option"
                            style={{
                                backgroundColor: theme.backgroundColor,
                                color: theme.textColor,
                            }}
                            onClick={() => {
                                onThemeSelect(theme);
                                onThemeSelectorToggle(false);
                            }}
                        >
                            {theme.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SmartInputArea;
