import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Send, Plus, Trash2, Pin, Edit2, MessageSquare, Sparkles, Menu, X, ExternalLink, BookOpen, Video, FileText, Stethoscope, FlaskConical, ClipboardList } from 'lucide-react';

const AIStudyAssistant = () => {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/ai-chat/sessions?assistantType=study-assistant');
      setSessions(response.data);

      // Auto-select first session or create new one
      if (response.data.length > 0) {
        setCurrentSession(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewSession = async () => {
    try {
      console.log('Creating new session...');
      console.log('API Base URL:', import.meta.env.VITE_API_URL);
      console.log('Token:', localStorage.getItem('token') ? 'Present' : 'Missing');

      const response = await api.post('/ai-chat/sessions', {
        assistantType: 'study-assistant',
        title: 'New Chat'
      });

      console.log('Session created:', response.data);
      setSessions([response.data, ...sessions]);
      setCurrentSession(response.data);
    } catch (error) {
      console.error('Error creating session:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);

      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
      alert(`Failed to create new chat: ${errorMessage}`);
    }
  };

  const deleteSession = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this chat?')) return;

    try {
      await api.delete(`/ai-chat/sessions/${sessionId}`);
      setSessions(sessions.filter(s => s._id !== sessionId));
      if (currentSession?._id === sessionId) {
        setCurrentSession(sessions[0] || null);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const togglePin = async (sessionId) => {
    try {
      const session = sessions.find(s => s._id === sessionId);
      const response = await api.put(`/ai-chat/sessions/${sessionId}`, {
        isPinned: !session.isPinned
      });

      setSessions(sessions.map(s => s._id === sessionId ? response.data : s));
      if (currentSession?._id === sessionId) {
        setCurrentSession(response.data);
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !currentSession) return;

    const userMessage = message;
    setMessage('');
    setSendingMessage(true);

    // Optimistic UI update - show user message immediately
    const optimisticUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };

    const optimisticAIMessage = {
      role: 'assistant',
      content: '...',
      timestamp: new Date().toISOString(),
      isTyping: true
    };

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, optimisticUserMessage, optimisticAIMessage]
    };

    setCurrentSession(updatedSession);

    try {
      const response = await api.post(
        `/ai-chat/sessions/${currentSession._id}/message`,
        { content: userMessage }
      );

      setCurrentSession(response.data);
      setSessions(sessions.map(s => s._id === response.data._id ? response.data : s));
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
      // Revert optimistic update on error
      setCurrentSession(currentSession);
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Chat Sessions */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-50
        w-80 md:w-80 bg-white dark:bg-gray-800
        border-r border-gray-200 dark:border-gray-700
        flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-600" />
              AI Study Assistant
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={createNewSession}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Chat
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No chats yet</p>
              <p className="text-xs mt-1">Start a new conversation!</p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {sessions.map((session) => (
                <div
                  key={session._id}
                  onClick={() => {
                    setCurrentSession(session);
                    setSidebarOpen(false);
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                    currentSession?._id === session._id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-600'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-gray-900 dark:text-white truncate">
                        {session.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {session.messageCount} messages
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(session._id);
                        }}
                        className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                          session.isPinned ? 'text-blue-600' : 'text-gray-400'
                        }`}
                      >
                        <Pin className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session._id);
                        }}
                        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentSession ? (
          <>
            {/* Chat Header - Gemini Style */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {currentSession.title}
                </h3>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {currentSession.messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-md">
                    <Sparkles className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Welcome to AI Study Assistant!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      I'm here to help you with your dental studies. Ask me anything about:
                    </p>
                    <ul className="text-left text-gray-600 dark:text-gray-400 space-y-2">
                      <li>• Anatomy and physiology concepts</li>
                      <li>• Clinical procedures and techniques</li>
                      <li>• Study tips and exam preparation</li>
                      <li>• Clarifying difficult topics</li>
                      <li>• Practice questions and explanations</li>
                    </ul>
                  </div>
                </div>
              ) : (
                currentSession.messages.map((msg, index) => (
                  <MessageBubble key={index} message={msg} />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Gemini Style */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="max-w-4xl mx-auto">
                <form onSubmit={sendMessage} className="flex gap-3 items-end">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ask me anything..."
                      className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base"
                      disabled={sendingMessage}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!message.trim() || sendingMessage}
                    className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Empty State Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex-1 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  AI Study Assistant
                </h3>
              </div>
            </div>

            {/* Empty State Content */}
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center max-w-md">
                <Sparkles className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome to AI Study Assistant
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start a new chat to get help with your dental studies
                </p>
                <button
                  onClick={createNewSession}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  Start New Chat
                </button>
              </div>
            </div>
          </>
          </div>
        )}
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex gap-1">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
  </div>
);

// Helper function to parse resource links from AI response
const parseResourceLinks = (text) => {
  const resources = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    const [fullMatch, title, url] = match;
    resources.push({ title, url, fullMatch });
  }

  return resources;
};

// Resource link component
const ResourceLink = ({ title, url }) => {
  const getIcon = () => {
    if (url.includes('/quizzes/')) return <BookOpen className="w-4 h-4" />;
    if (url.includes('/videos/') || url.includes('youtube.com') || url.includes('youtu.be')) return <Video className="w-4 h-4" />;
    if (url.includes('/flashcards')) return <FileText className="w-4 h-4" />;
    if (url.includes('/skills/')) return <Stethoscope className="w-4 h-4" />;
    if (url.includes('/labs/')) return <FlaskConical className="w-4 h-4" />;
    if (url.includes('/osce/')) return <ClipboardList className="w-4 h-4" />;
    return <ExternalLink className="w-4 h-4" />;
  };

  const isExternal = url.startsWith('http');

  if (isExternal) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
      >
        {getIcon()}
        <span>{title}</span>
      </a>
    );
  }

  return (
    <Link
      to={url}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
    >
      {getIcon()}
      <span>{title}</span>
    </Link>
  );
};

// Enhanced message content renderer
const MessageContent = ({ content, isUser }) => {
  const resources = parseResourceLinks(content);

  if (resources.length === 0) {
    return <p className="whitespace-pre-wrap break-words text-base leading-relaxed">{content}</p>;
  }

  // Split content by resource links
  let remainingText = content;
  const parts = [];

  resources.forEach((resource, index) => {
    const splitIndex = remainingText.indexOf(resource.fullMatch);
    if (splitIndex > 0) {
      parts.push({ type: 'text', content: remainingText.substring(0, splitIndex) });
    }
    parts.push({ type: 'resource', ...resource });
    remainingText = remainingText.substring(splitIndex + resource.fullMatch.length);
  });

  if (remainingText) {
    parts.push({ type: 'text', content: remainingText });
  }

  return (
    <div className="space-y-2">
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return <p key={index} className="whitespace-pre-wrap break-words text-base leading-relaxed">{part.content}</p>;
        }
        return <ResourceLink key={index} title={part.title} url={part.url} />;
      })}
    </div>
  );
};

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  const isTyping = message.isTyping;

  return (
    <div className="max-w-4xl mx-auto">
      <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        )}
        <div className={`flex-1 ${isUser ? 'flex justify-end' : ''}`}>
          <div
            className={`inline-block px-4 py-3 rounded-2xl ${
              isUser
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm'
            }`}
          >
            {isTyping ? (
              <TypingIndicator />
            ) : (
              <>
                <MessageContent content={message.content} isUser={isUser} />
                <p className={`text-xs mt-2 ${isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </>
            )}
          </div>
        </div>
        {isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-semibold text-sm">
            U
          </div>
        )}
      </div>
    </div>
  );
};

export default AIStudyAssistant;

