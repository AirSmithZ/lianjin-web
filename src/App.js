import { useState } from 'react';
import StartScreen from './pages/StartScreen';
import PlayScreen from './pages/PlayScreen';
import { DEFAULT_DIFFICULTY_KEY } from './constants/difficulty';
import './App.css';

const DEFAULT_SETTINGS = {
  difficulty: DEFAULT_DIFFICULTY_KEY,
  rounds: 3,
};

function App() {
  const [stage, setStage] = useState('start');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [playKey, setPlayKey] = useState(0);

  const handleStartGame = (config) => {
    setSettings(config);
    setStage('play');
    setPlayKey((prev) => prev + 1);
  };

  const handleBackHome = () => {
    setStage('start');
  };

  const handleRestart = () => {
    setSettings(DEFAULT_SETTINGS);
    setPlayKey((prev) => prev + 1);
  };

  return (
    <div className="app-shell">
      <div className="phone-frame">
        {stage === 'start' ? (
          <StartScreen settings={settings} onUpdateSettings={setSettings} onStartGame={handleStartGame} />
        ) : (
          <PlayScreen
            key={playKey}
            settings={settings}
            onBackHome={handleBackHome}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}

export default App;
