import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { Send, Plus, Trash2, Pin, FileText, Brain, Lightbulb, AlertCircle, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const CaseGenerator = () => {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);
  const [lastFailedMessage, setLastFailedMessage] = useState(null);
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
      const response = await api.get('/ai-chat/sessions?assistantType=case-generator');
      setSessions(response.data);

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
      const response = await api.post('/ai-chat/sessions', {
        assistantType: 'case-generator',
        title: 'New Clinical Case'
      });
      setSessions([response.data, ...sessions]);
      setCurrentSession(response.data);
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create new case. Please try again.');
    }
  };

  const deleteSession = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this case?')) return;

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

  const sendMessage = async (e, retryMessage = null) => {
    if (e) e.preventDefault();

    const userMessage = retryMessage || message;
    if (!userMessage.trim() || !currentSession) return;

    setMessage('');
    setSendingMessage(true);
    setError(null);
    setLastFailedMessage(null);

    // Optimistically add user message to UI
    const optimisticSession = {
      ...currentSession,
      messages: [
        ...currentSession.messages,
        {
          role: 'user',
          content: userMessage,
          timestamp: new Date().toISOString()
        }
      ]
    };
    setCurrentSession(optimisticSession);

    try {
      const response = await api.post(
        `/ai-chat/sessions/${currentSession._id}/message`,
        { content: userMessage },
        { timeout: 60000 } // 60 second timeout for AI generation
      );

      setCurrentSession(response.data);
      setSessions(sessions.map(s => s._id === response.data._id ? response.data : s));
      setError(null);
    } catch (error) {
      console.error('Error sending message:', error);

      // Revert optimistic update on error
      setCurrentSession(currentSession);

      // Set error message based on error type
      let errorMessage = 'Failed to send message. ';
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMessage += 'The request timed out. The AI might be busy - please try again.';
      } else if (error.response?.status === 429) {
        errorMessage += 'Too many requests. Please wait a moment and try again.';
      } else if (error.response?.status >= 500) {
        errorMessage += 'Server error. Please try again in a moment.';
      } else if (!navigator.onLine) {
        errorMessage += 'No internet connection. Please check your network.';
      } else {
        errorMessage += 'Please try again.';
      }

      setError(errorMessage);
      setLastFailedMessage(userMessage);
    } finally {
      setSendingMessage(false);
    }
  };

  const retryLastMessage = () => {
    if (lastFailedMessage) {
      sendMessage(null, lastFailedMessage);
    }
  };

  const quickPrompts = [
    // Periodontics
    "Generate a case about generalized chronic periodontitis with systemic factors",
    "Create a case involving aggressive periodontitis in a young patient",
    "Generate a periodontal abscess case with emergency presentation",

    // Endodontics
    "Create a case about irreversible pulpitis requiring root canal treatment",
    "Generate an endodontic case with periapical abscess and swelling",
    "Create a case involving a cracked tooth with pulpal involvement",

    // Prosthodontics
    "Generate a case about complete denture fabrication for an edentulous patient",
    "Create a case involving fixed partial denture (bridge) planning",
    "Generate an implant-supported crown case with bone grafting needs",

    // Oral Surgery
    "Create a case involving impacted wisdom tooth extraction",
    "Generate a case about dental trauma with tooth avulsion",
    "Create a case involving jaw fracture from trauma",

    // Restorative Dentistry
    "Generate a case about extensive caries requiring multiple restorations",
    "Create a case involving anterior esthetic restoration",
    "Generate a case about tooth wear and erosion management",

    // Orthodontics
    "Create a case involving Class II malocclusion requiring orthodontic treatment",
    "Generate a case about crowding and extraction decisions",
    "Create a case involving crossbite correction in a growing patient",

    // Pediatric Dentistry
    "Generate a case about early childhood caries in a 4-year-old",
    "Create a case involving pulp therapy for a primary molar",
    "Generate a case about space management after premature tooth loss",

    // Oral Pathology
    "Create a case involving oral cancer detection and biopsy",
    "Generate a case about oral lichen planus diagnosis",
    "Create a case involving salivary gland pathology",

    // Emergency Cases
    "Generate an emergency case with severe toothache and facial swelling",
    "Create a case involving dental trauma with multiple fractured teeth",
    "Generate a case about Ludwig's angina requiring immediate intervention",

    // Complex Cases
    "Create a medically compromised patient case (diabetes, hypertension, anticoagulants)",
    "Generate a case involving full mouth rehabilitation planning",
    "Create a case about TMJ disorder diagnosis and management"
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Case Sessions */}
      <div className="w-full md:w-80 bg-white dark:bg-gray-800 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 flex flex-col max-h-48 md:max-h-none overflow-hidden">
        {/* Header */}
        <div className="p-3 md:p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              <span className="hidden sm:inline">Case Generator</span>
              <span className="sm:hidden">Cases</span>
            </h2>
          </div>
          <button
            onClick={createNewSession}
            className="w-full bg-purple-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            New Case
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-3 md:p-4 text-center text-gray-500 dark:text-gray-400">
              <FileText className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 opacity-50" />
              <p className="text-xs md:text-sm">No cases yet</p>
              <p className="text-xs mt-1 hidden md:block">Generate your first clinical case!</p>
            </div>
          ) : (
            <div className="p-1 md:p-2 space-y-1 md:space-y-2">
              {sessions.slice(0, 3).map((session) => (
                <div
                  key={session._id}
                  onClick={() => setCurrentSession(session)}
                  className={`p-2 md:p-3 rounded-lg cursor-pointer transition-colors group ${
                    currentSession?._id === session._id
                      ? 'bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-600'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm md:text-base font-medium text-gray-900 dark:text-white truncate">
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
                          session.isPinned ? 'text-purple-600' : 'text-gray-400'
                        }`}
                      >
                        <Pin className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session._id);
                        }}
                        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Case Area */}
      <div className="flex-1 flex flex-col">
        {currentSession ? (
          <>
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 md:p-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                {currentSession.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                AI-powered clinical case generation
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4">
              {currentSession.messages.length === 0 && !sendingMessage ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-2xl">
                    <FileText className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Welcome to Case Generator!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Generate realistic clinical cases to enhance your diagnostic and treatment planning skills.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-6">
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <Brain className="w-8 h-8 text-purple-600 mb-2" />
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          Clinical Reasoning
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Practice differential diagnosis and treatment planning
                        </p>
                      </div>
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <Lightbulb className="w-8 h-8 text-purple-600 mb-2" />
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          Custom Scenarios
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Request cases on specific topics or conditions
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Quick Start Prompts:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {quickPrompts.map((prompt, index) => (
                          <button
                            key={index}
                            onClick={() => setMessage(prompt)}
                            className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {currentSession.messages.map((msg, index) => (
                    <MessageBubble key={index} message={msg} />
                  ))}
                  {sendingMessage && (
                    <div className="flex justify-start">
                      <div className="max-w-3xl px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">AI is generating your case...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
              {/* Error Message */}
              {error && (
                <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                  </div>
                  {lastFailedMessage && (
                    <button
                      onClick={retryLastMessage}
                      className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Retry
                    </button>
                  )}
                  <button
                    onClick={() => setError(null)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                  >
                    ✕
                  </button>
                </div>
              )}

              <form onSubmit={sendMessage} className="flex gap-2 md:gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe the case..."
                  className="flex-1 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  disabled={sendingMessage}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || sendingMessage}
                  className="bg-purple-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                >
                  <Send className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">{sendingMessage ? 'Sending...' : 'Send'}</span>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Select a case or create a new one to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-3xl px-4 py-3 rounded-lg ${
          isUser
            ? 'bg-purple-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-4 mb-2 text-gray-900 dark:text-white" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-3 mb-2 text-gray-900 dark:text-white" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-base font-semibold mt-2 mb-1 text-gray-900 dark:text-white" {...props} />,
                p: ({node, ...props}) => <p className="mb-2 text-gray-900 dark:text-white" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 text-gray-900 dark:text-white" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 text-gray-900 dark:text-white" {...props} />,
                li: ({node, ...props}) => <li className="mb-1 text-gray-900 dark:text-white" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-gray-900 dark:text-white" {...props} />,
                em: ({node, ...props}) => <em className="italic text-gray-900 dark:text-white" {...props} />,
                code: ({node, inline, ...props}) =>
                  inline
                    ? <code className="bg-gray-300 dark:bg-gray-600 px-1 rounded text-sm text-gray-900 dark:text-white" {...props} />
                    : <code className="block bg-gray-300 dark:bg-gray-600 p-2 rounded text-sm mb-2 text-gray-900 dark:text-white" {...props} />,
                hr: ({node, ...props}) => <hr className="my-3 border-gray-400 dark:border-gray-500" {...props} />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        <p className={`text-xs mt-2 ${isUser ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'}`}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default CaseGenerator;

