import React, { useState, useEffect } from "react";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { MessageCircle, MessageCirclePlus, Image, LogOut, User, Loader2 } from "lucide-react"; 
import { useAuth } from "./context/AuthContext";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ChatInterface from "./components/Chat/ChatInterface";
import ImageGenerator from "./components/Image/ImageGenerator";
import HomePage from "./components/HomePage";
import store, { persistor } from "./store/store";


const AppContent = () => {
  const [authView, setAuthView] = useState('homepage'); 
  const [activeTab, setActiveTab] = useState('chat'); 
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    if (user) {
      setActiveTab('chat'); 
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    if (authView === 'homepage') {
      return (
        <HomePage 
          onSwitchToLogin={() => setAuthView('login')} 
          onSwitchToRegister={() => setAuthView('register')} 
        />
      );
    } else if (authView === 'login') {
      return (
        <Login 
          onSwitchToRegister={() => setAuthView('register')} 
        />
      );
    } else { 
      return (
        <Register 
          onSwitchToLogin={() => setAuthView('login')} 
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img 
                src="/Hask.png" 
                alt="Hask AI Logo" 
                className="h-8 w-8 mr-3"
              />
              <h1 className="text-2xl font-bold text-gray-900">Hask <span className="text-blue-600">AI</span></h1>
              <span className="ml-2 text-sm text-gray-500 hidden sm:inline">Your Intelligent Assistant</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{user.username}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-red-500 hover:text-red-700 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-xl md:shadow-sm h-[calc(100vh-130px)] flex overflow-hidden">
          
          <div className="w-16 sm:w-64 border-r bg-gray-50 flex flex-col py-4">
            <nav className="flex-1 px-2 sm:px-4 space-y-2">
              
              <button
                onClick={() => setActiveTab('newChat')}
                className={`w-full flex items-center justify-center sm:justify-start space-x-3 px-2 sm:px-4 py-2 rounded-lg text-left transition-colors duration-200 ${
                  activeTab === 'newChat'
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Chat AI"
              >
                <MessageCirclePlus className="w-5 h-5" />
                <span className="hidden sm:inline">New Chat</span>
              </button>

              <button
                onClick={() => setActiveTab('chat')}
                className={`w-full flex items-center justify-center sm:justify-start space-x-3 px-2 sm:px-4 py-2 rounded-lg text-left transition-colors duration-200 ${
                  activeTab === 'chat'
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Chat AI"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="hidden sm:inline">Chat AI</span>
              </button>

              <button
                onClick={() => setActiveTab('image')}
                className={`w-full flex items-center justify-center sm:justify-start space-x-3 px-2 sm:px-4 py-2 rounded-lg text-left transition-colors duration-200 ${
                  activeTab === 'image'
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Image Generator"
              >
                <Image className="w-5 h-5" />
                <span className="hidden sm:inline">Image Generator</span>
              </button>
            </nav>
          </div>

         
          <div className="flex-1 flex flex-col">
            {activeTab === 'newChat' && <ChatInterface />}
            {activeTab === 'chat' && <ChatInterface />}
            {activeTab === 'image' && <ImageGenerator />}
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate 
        loading={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-gray-600">Loading your personal data...</p>
            </div>
          </div>
        } 
        persistor={persistor}
      >
        <AppContent />
      </PersistGate>
    </Provider>
  );
};

export default App;