import resultTop from '../assets/result/resultTop.png';
import resultMiddle from '../assets/result/resultmiddle.png';
import resultBottom from '../assets/result/resultBottom.png';
import tryAgainImg from '../assets/result/tryAgain.png';
import winImg from '../assets/result/win.png';

export default function ResultModal({ winnerInfo, onBackHome, onRestart }) {
  if (!winnerInfo) return null;

  const isDraw = winnerInfo.winner === '무승부';

  return (
    <div className="modal-mask">
      <div className="result-modal">
        <img src={resultTop} alt="result top" className="result-top" />
        <img src={resultMiddle} alt="result middle" className="result-middle" />
        <img src={resultBottom} alt="result bottom" className="result-bottom" />

        <div className="result-content">
          {!isDraw && <img src={winImg} alt="win" className="result-win" />}
            <div className="result-player-badge">
            <span className="result-player-name">{winnerInfo.winner}</span>
          </div>
        </div>

        <img onClick={onBackHome} src={tryAgainImg} alt="try again" className="result-try-again" />
      </div>
    </div>
  );
}

