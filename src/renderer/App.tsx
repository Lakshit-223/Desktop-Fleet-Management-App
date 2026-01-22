import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './languageContext'; // Import Provider & Hook
import './styles/App.css'; // Assuming your CSS is here
import Dashboard from './components/Dashboard';
import Vehicles from './components/Vehicles';
import Trips from './components/Trips';
import Diesel from './components/Diesel';
import Transactions from './components/Transactions';
import SpareParts from './components/SpareParts';

type TabName = 'dashboard' | 'vehicles' | 'trips' | 'diesel' | 'transactions' | 'parts';

// This is the content component that USES the hook
function AppContent() {
  const { t, toggleLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabName>('dashboard');

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'vehicles': return <Vehicles />;
      case 'trips': return <Trips />;
      case 'diesel': return <Diesel />;
      case 'transactions': return <Transactions />;
      case 'parts': return <SpareParts />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>Fleet Manager</h2>
        
        {/* Language Toggle Button */}
        <button className="nav-btn lang-toggle" onClick={toggleLanguage}>
          {t('language')}
        </button>

        <hr style={{borderColor: 'rgba(255,255,255,0.2)'}} />

        <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>{t('dashboard')}</button>
        <button className={`nav-btn ${activeTab === 'vehicles' ? 'active' : ''}`} onClick={() => setActiveTab('vehicles')}>{t('vehicles')}</button>
        <button className={`nav-btn ${activeTab === 'trips' ? 'active' : ''}`} onClick={() => setActiveTab('trips')}>{t('trips')}</button>
        <button className={`nav-btn ${activeTab === 'diesel' ? 'active' : ''}`} onClick={() => setActiveTab('diesel')}>{t('diesel')}</button>
        <button className={`nav-btn ${activeTab === 'parts' ? 'active' : ''}`} onClick={() => setActiveTab('parts')}>{t('parts')}</button>
        <button className={`nav-btn ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>{t('transactions')}</button>
      </div>
      <div className="content">
        {renderContent()}
      </div>
    </div>
  );
}

// This is the MAIN export that PROVIDES the context
function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;