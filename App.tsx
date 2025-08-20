import React, { useState, useEffect } from 'react';
import OrchestratorPanel from './components/AgentsPanel';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import LandingPage from './components/LandingPage';

type View = 'landing' | 'app' | 'terms' | 'privacy';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('landing');

  useEffect(() => {
    if (currentView === 'landing') {
      document.body.classList.add('landing-page-active');
    } else {
      document.body.classList.remove('landing-page-active');
    }
    // Cleanup on unmount
    return () => {
       document.body.classList.remove('landing-page-active');
    }
  }, [currentView]);


  const renderContent = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onLaunch={() => setCurrentView('app')} />;
      case 'terms':
        return <TermsOfService onClose={() => setCurrentView('app')} />;
      case 'privacy':
        return <PrivacyPolicy onClose={() => setCurrentView('app')} />;
      case 'app':
      default:
        return <OrchestratorPanel />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-transparent text-[var(--text-color)] font-sans">
      <header className={`flex items-center justify-between p-4 border-b ${currentView === 'landing' ? 'border-transparent' : 'bg-black/30 backdrop-blur-lg border-[var(--neon-purple)]'}`}>
        <div className="flex items-center gap-3">
          <a href="/" aria-label="Home">
            <img
              src="https://andiegogiap.com/assets/aionex-icon-256.png"
              alt="AIONEX logo"
              width="128"
              height="128"
              style={{height: '40px', width: 'auto', display: 'block'}}
              loading="eager"
              decoding="async"
            />
          </a>
          <h1 className="text-2xl font-bold tracking-wider" style={{textShadow: '0 0 5px var(--neon-purple)'}}>AIONEX Sandbox</h1>
        </div>
        {/* Settings have been removed as API keys are now handled by environment variables. */}
      </header>
      
      <main className="flex-grow flex flex-col overflow-hidden">
        {renderContent()}
      </main>
      
      <footer className={`p-3 text-center text-xs text-gray-400 border-t ${currentView === 'landing' ? 'border-transparent bg-black/30' : 'bg-black/30 backdrop-blur-lg border-[var(--neon-purple)]'}`}>
        <p className="mb-2">
          This is a live application powered by the Gemini API. Prompts are sent to Google for processing.
        </p>
        <div>
          <button onClick={() => setCurrentView('terms')} className="hover:underline text-[var(--neon-blue)] hover:text-[var(--neon-pink)] mx-2 transition-colors">Terms of Service</button>
          |
          <button onClick={() => setCurrentView('privacy')} className="hover:underline text-[var(--neon-blue)] hover:text-[var(--neon-pink)] mx-2 transition-colors">Privacy Policy</button>
        </div>
      </footer>
    </div>
  );
};

export default App;