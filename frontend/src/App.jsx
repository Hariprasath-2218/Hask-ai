// frontend/src/App.jsx
import React, { useState } from "react";
import { MessageCircle, Image, LogOut, User, Loader2 } from "lucide-react";
import { useAuth } from "./context/AuthContext";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ChatInterface from "./components/Chat/ChatInterface";
import ImageGenerator from "./components/Image/ImageGenerator";
// import Header from "./components/Layout/Header";
// import Sidebar from "./components/Layout/Sidebar";


const App = () => {
  const [currentView, setCurrentView] = useState('login');
  const [activeTab, setActiveTab] = useState('chat');
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return currentView === 'login' ? (
      <Login onSwitchToRegister={() => setCurrentView('register')} />
    ) : (
      <Register onSwitchToLogin={() => setCurrentView('login')} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Hask</h1>
              <span className="ml-2 text-sm text-gray-500">AI Assistant</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{user.username}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm h-[600px] flex">
          <div className="w-64 border-r">
            <nav className="p-4">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left ${
                    activeTab === 'chat'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat AI</span>
                </button>

                <button
                  onClick={() => setActiveTab('image')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left ${
                    activeTab === 'image'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Image className="w-5 h-5" />
                  <span>Image Generator</span>
                </button>
              </div>
            </nav>
          </div>

          <div className="flex-1">
            {activeTab === 'chat' ? <ChatInterface /> : <ImageGenerator />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
