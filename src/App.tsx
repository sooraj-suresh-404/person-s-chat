import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { AIPersonality } from './types';
import { DarkModeProvider } from './contexts/DarkModeContext';
import Layout from './components/Layout';
import { personalities } from './data/personalities';

function App() {
  const [selectedPersonality, setSelectedPersonality] = useState<AIPersonality | null>(null);

  return (
    <DarkModeProvider>
      <Layout>
        <div className="flex h-screen">
          <Sidebar
            onSelectPersonality={setSelectedPersonality}
            selectedPersonality={selectedPersonality}
            personalities={personalities}
          />
          <ChatWindow personality={selectedPersonality} />
        </div>
      </Layout>
    </DarkModeProvider>
  );
}

export default App;