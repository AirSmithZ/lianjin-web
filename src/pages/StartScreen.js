import { useEffect, useMemo, useState } from 'react';
import homeBg from '../assets/start/homeBg.png';
import startIllustration from '../assets/start/start.png';
import configIcon from '../assets/start/config.png';
import configBg from '../assets/start/configbg.png';
import diffcultTitle from '../assets/start/diffcult.png';
import closeIcon from '../assets/start/close.png';
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

  const activeDifficulty = useMemo(
    () => DIFFICULTY_STEPS.find((item) => item.key === localSettings.difficulty) ?? DIFFICULTY_STEPS[0],
    [localSettings.difficulty],
  );

  const startGame = () => {
    onStartGame(localSettings);
  };

  const closeConfig = () => {
    onUpdateSettings(localSettings);
    setIsConfigOpen(false);
  };

  return (
    <div className="start-screen">
      <img src={homeBg} alt="home background" className="start-bg" />
      <div className="start-overlay">
        <img src={startIllustration} alt="start screen" className="start-hero" draggable={false} />
        <button className="start-button" onClick={startGame} aria-label="开始游戏" />
      </div>

      <button className="config-entry" onClick={() => setIsConfigOpen(true)} aria-label="打开设置">
        <img src={configIcon} alt="config" draggable={false} />
      </button>

      {isConfigOpen && (
        <div className="config-modal">
          <div className="config-card">
            <img src={configBg} alt="config background" className="config-bg" draggable={false} />
            <img src={diffcultTitle} alt="difficulty title" className="config-title" draggable={false} />
            <button className="config-close" onClick={closeConfig} aria-label="关闭设置">
              <img className='config-close-icon' src={closeIcon} alt="close" draggable={false} />
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
                {/* <p className="config-value">{activeDifficulty?.caption}</p> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

