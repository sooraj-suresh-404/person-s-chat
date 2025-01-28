import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { AIPersonality } from './types';

function App() {
  const [selectedPersonality, setSelectedPersonality] = useState<AIPersonality | null>(null);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        onSelectPersonality={setSelectedPersonality}
        selectedPersonality={selectedPersonality}
      />
      <ChatWindow personality={selectedPersonality} />
    </div>
  );
}

export default App;