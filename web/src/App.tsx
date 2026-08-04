import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ProfilePage } from './pages/ProfilePage';
import { LearningLibraryPage } from './pages/LearningLibraryPage';
import { CommunityBrowsePage } from './pages/CommunityBrowsePage';
import { AlternativesComparisonPage } from './pages/AlternativesComparisonPage';

export function App() {
  const [activeTab, setActiveTab] = useState<'profile' | 'learning' | 'community' | 'compare'>('profile');
  const [userName, setUserName] = useState<string>('Harish Parthiban');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userName={userName}
      />

      {/* Main Page Routing */}
      <main>
        {activeTab === 'profile' && (
          <ProfilePage onProfileUpdated={updated => setUserName(updated.name)} />
        )}

        {activeTab === 'learning' && (
          <LearningLibraryPage />
        )}

        {activeTab === 'community' && (
          <CommunityBrowsePage />
        )}

        {activeTab === 'compare' && (
          <AlternativesComparisonPage />
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '24px 0', marginTop: '60px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <div className="container">
          Nutri Lens Platform • Team CODESTRIX • Smart India Hackathon 2026 (Person B Web Dashboard)
        </div>
      </footer>
    </div>
  );
}

export default App;
