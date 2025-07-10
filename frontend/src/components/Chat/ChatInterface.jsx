import React, { useEffect, useState } from 'react';
import { MessageCircle, History, Bot, Loader2, Send } from 'lucide-react';
import api from '../../services/api';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const response = await api.chat.getHistory();
      setHistory(response.chats || []);
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await api.chat.send(inputMessage);
      const botMessage = { text: response.response, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);
      loadChatHistory();
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { text: 'Sorry, something went wrong.', sender: 'bot' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadHistoryConversation = (chat) => {
    setMessages([
      { text: chat.message, sender: 'user' },
      { text: chat.response, sender: 'bot' },
    ]);
    setShowHistory(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MessageCircle className="w-5 h-5" /> Chat AI
        </h2>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
        >
          <History className="w-5 h-5" />
        </button>
      </div>

      {showHistory && (
        <div className="border-b bg-gray-50 p-4">
          <h3 className="font-medium mb-2">Chat History</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {history.map((chat, index) => (
              <button
                key={index}
                onClick={() => loadHistoryConversation(chat)}
                className="w-full text-left p-2 bg-white rounded border hover:bg-gray-50 text-sm"
              >
                <div className="truncate">{chat.message}</div>
                <div className="text-xs text-gray-500">
                  {new Date(chat.timestamp).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Start a conversation with Hask AI</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 px-4 py-2 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;