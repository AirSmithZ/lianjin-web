import { useEffect, useState } from 'react';
import { DEFAULT_DIFFICULTY_KEY, DIFFICULTY_STEPS } from '../constants/difficulty';

const DEFAULT_SETTINGS = {
  difficulty: DEFAULT_DIFFICULTY_KEY,
  rounds: 3,
};

export default function StartScreen({ settings = DEFAULT_SETTINGS, onUpdateSettings, onStartGame }) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const startGame = () => {
    onStartGame(localSettings);
  };

  const closeConfig = () => {
    onUpdateSettings(localSettings);
    setIsConfigOpen(false);
  };

  return (
    <div className="start-screen">
      <img src="/assets/start/homeBg.png" alt="home background" className="start-bg" />
      <div className="start-overlay">
        <img src="/assets/start/start.png" alt="start screen" className="start-hero" draggable={false} />
        <button className="start-button" onClick={startGame} aria-label="开始游戏" />
      </div>

      <button className="config-entry" onClick={() => setIsConfigOpen(true)} aria-label="打开设置">
        <img src="/assets/start/config.png" alt="config" draggable={false} />
      </button>

      {isConfigOpen && (
        <div className="config-modal">
          <div className="config-card">
            <img src="/assets/start/configbg.png" alt="config background" className="config-bg" draggable={false} />
            <img src="/assets/start/diffcult.png" alt="difficulty title" className="config-title" draggable={false} />
            <button className="config-close" onClick={closeConfig} aria-label="关闭设置">
              <img className='config-close-icon' src="/assets/start/close.png" alt="close" draggable={false} />
            </button>
            <div className="config-body">
              <div className="config-field">
                <input
                  type="range"
                  min={0}
                  max={DIFFICULTY_STEPS.length - 1}
                  step={1}
                  value={DIFFICULTY_STEPS.findIndex((item) => item.key === localSettings.difficulty)}
                  onChange={(event) => {
                    const next = DIFFICULTY_STEPS[Number(event.target.value)];
                    setLocalSettings((prev) => ({ ...prev, difficulty: next.key }));
                  }}
                />
                <div className="config-options">
                  {DIFFICULTY_STEPS.map((step) => (
                    <button
                      key={step.key}
                      type="button"
                      className={`config-option ${localSettings.difficulty === step.key ? 'active' : ''}`}
                      onClick={() => setLocalSettings((prev) => ({ ...prev, difficulty: step.key }))}
                    >
                      {step.label}
                    </button>
                  ))}
                </div>
                {/* <p className="config-va?.caption}</p> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

