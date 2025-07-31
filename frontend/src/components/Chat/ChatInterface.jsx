import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MessageCircle, History, Bot, Loader2, Send, User } from 'lucide-react';
import api from '../../services/api';
import { processMessage } from '../../utils/messageProcessor';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const dispatch = useDispatch();
  const personalDetails = useSelector((state) => state.personalDetails);

  useEffect(() => {
    console.log('Personal details updated:', personalDetails);
  }, [personalDetails]);

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

  // Enhanced format function to handle all programming languages and formats
  const formatResponse = (text) => {
    if (!text) return '';
    
    // First, handle code blocks with language specification
    let formatted = text.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, language, code) => {
      const lang = language || 'text';
      const trimmedCode = code.trim();
      
      // Language-specific styling
      const getLanguageClass = (lang) => {
        const langMap = {
          'javascript': 'language-javascript',
          'js': 'language-javascript',
          'python': 'language-python',
          'py': 'language-python',
          'html': 'language-html',
          'css': 'language-css',
          'java': 'language-java',
          'cpp': 'language-cpp',
          'c': 'language-c',
          'php': 'language-php',
          'ruby': 'language-ruby',
          'go': 'language-go',
          'rust': 'language-rust',
          'typescript': 'language-typescript',
          'ts': 'language-typescript',
          'json': 'language-json',
          'xml': 'language-xml',
          'sql': 'language-sql',
          'bash': 'language-bash',
          'shell': 'language-shell',
          'powershell': 'language-powershell',
          'yaml': 'language-yaml',
          'yml': 'language-yaml',
          'markdown': 'language-markdown',
          'md': 'language-markdown'
        };
        return langMap[lang.toLowerCase()] || 'language-text';
      };

      const langClass = getLanguageClass(lang);
      const langDisplay = lang.toUpperCase();
      
      return `<div class="code-block my-2 sm:my-4 border border-gray-200 rounded-lg overflow-hidden">
        <div class="bg-gray-800 text-white px-2 sm:px-4 py-2 text-xs font-mono flex justify-between items-center">
          <span>${langDisplay}</span>
          <button class="copy-btn text-gray-300 hover:text-white text-xs px-1 sm:px-2 py-1 rounded hover:bg-gray-700" onclick="copyToClipboard(this)">Copy</button>
        </div>
        <pre class="bg-gray-50 p-2 sm:p-4 overflow-x-auto text-xs sm:text-sm font-mono"><code class="${langClass}">${escapeHtml(trimmedCode)}</code></pre>
      </div>`;
    });

    // Handle inline code (after code blocks to avoid conflicts)
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 sm:px-2 py-1 rounded text-xs sm:text-sm font-mono text-red-600">$1</code>');

    // Handle other markdown formatting
    formatted = formatted
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      // Italic text
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-base sm:text-lg font-semibold mt-3 sm:mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-lg sm:text-xl font-semibold mt-3 sm:mt-4 mb-2">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-xl sm:text-2xl font-bold mt-3 sm:mt-4 mb-2">$1</h1>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank">$1</a>')
      // Strikethrough
      .replace(/~~(.*?)~~/g, '<del class="line-through">$1</del>');

    // Handle lists (after other formatting)
    const lines = formatted.split('\n');
    const processedLines = [];
    let inList = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Numbered lists
      if (/^\d+\.\s/.test(line)) {
        if (!inList) {
          processedLines.push('<ol class="list-decimal ml-4 sm:ml-6 mb-2">');
          inList = 'ol';
        }
        const content = line.replace(/^\d+\.\s/, '');
        processedLines.push(`<li class="mb-1">${content}</li>`);
      }
      // Bullet points
      else if (/^[-*+]\s/.test(line)) {
        if (!inList) {
          processedLines.push('<ul class="list-disc ml-4 sm:ml-6 mb-2">');
          inList = 'ul';
        }
        const content = line.replace(/^[-*+]\s/, '');
        processedLines.push(`<li class="mb-1">${content}</li>`);
      }
      // Regular line
      else {
        if (inList) {
          processedLines.push(`</${inList}>`);
          inList = false;
        }
        if (line) {
          processedLines.push(line);
        } else {
          processedLines.push('<br>');
        }
      }
    }
    
    // Close any remaining list
    if (inList) {
      processedLines.push(`</${inList}>`);
    }

    return processedLines.join('\n');
  };

  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const copyToClipboard = (button) => {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('code').textContent;
    navigator.clipboard.writeText(code).then(() => {
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = 'Copy';
      }, 2000);
    });
  };

  useEffect(() => {
    window.copyToClipboard = copyToClipboard;
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    
    console.log('Sending message:', inputMessage);
    console.log('Current Redux state before processing:', personalDetails);
    
    const processResult = processMessage(inputMessage, personalDetails, dispatch);
    
    console.log('Process result:', processResult);
    
    if (processResult) {

      const botMessage = { 
        text: processResult.response, 
        sender: 'bot',
        isLocal: true 
      };
      setMessages((prev) => [...prev, botMessage]);
      setInputMessage('');
      return;
    }


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
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-white shadow-sm">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-gray-800">
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" /> 
          <span className="hidden xs:inline">Chat AI</span>
          <span className="xs:hidden">Chat</span>
        </h2>
        <div className="flex items-center gap-2">
          {/* Debug info */}
          <div className="text-xs text-gray-500 hidden sm:block">
            Stored: {personalDetails.name ? `Name: ${personalDetails.name}` : 'No name'}
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <History className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {showHistory && (
        <div className="border-b bg-white p-3 sm:p-4 shadow-sm">
          <h3 className="font-medium mb-2 text-gray-800 text-sm sm:text-base">Chat History</h3>
          <div className="space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
            {history.map((chat, index) => (
              <button
                key={index}
                onClick={() => loadHistoryConversation(chat)}
                className="w-full text-left p-2 sm:p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 text-xs sm:text-sm transition-colors"
              >
                <div className="truncate font-medium text-gray-800">{chat.message}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(chat.timestamp).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8 sm:py-12">
            <Bot className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-base sm:text-lg">Start a conversation with Hask AI</p>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">
              Ask me anything and I'll help you! You can also share personal details like your name, age, location, etc.
            </p>
            {/* Debug info */}
            <div className="mt-4 text-xs text-gray-400">
              Debug: Current stored name = "{personalDetails.name || 'empty'}"
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 sm:gap-3 ${
              message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
              message.sender === 'user' 
                ? 'bg-blue-600 text-white' 
                : message.isLocal
                ? 'bg-green-500 text-white'
                : 'bg-gray-300 text-gray-600'
            }`}>
              {message.sender === 'user' ? (
                <User className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
            </div>

            <div
              className={`max-w-[280px] xs:max-w-xs sm:max-w-sm lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-sm text-sm sm:text-base ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-sm'
                  : message.isLocal
                  ? 'bg-green-50 text-gray-800 border border-green-200 rounded-tl-sm'
                  : 'bg-white text-gray-800 border rounded-tl-sm'
              }`}
            >
              {message.sender === 'bot' ? (
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatResponse(message.text) }}
                />
              ) : (
                <div className="whitespace-pre-wrap">{message.text}</div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center">
              <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
            <div className="bg-white px-3 sm:px-4 py-2 sm:py-3 rounded-2xl rounded-tl-sm shadow-sm border">
              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin text-gray-500" />
            </div>
          </div>
        )}
      </div>

      <div className="p-2 sm:p-4 bg-white border-t">
        <div className="flex gap-2 sm:gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(e)}
            placeholder="Type your message... (Try: 'My name is Hari' or 'What is my name?')"
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !inputMessage.trim()}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
          >
            <Send className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;