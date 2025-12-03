
export default function ResultModal({ winnerInfo, onBackHome, onRestart }) {
  if (!winnerInfo) return null;

  const isDraw = winnerInfo.winner === '무승부';

  return (
    <div className="modal-mask">
      <div className="result-modal">
        <img src="/assets/result/resultTop.png" alt="result top" className="result-top" />
        <img src="/assets/result/resultmiddle.png" alt="result middle" className="result-middle" />
        <img src="/assets/result/resultBottom.png" alt="result bottom" className="result-bottom" />

        <div className="result-content">
          {!isDraw && <img src="/assets/result/win.png" alt="win" className="result-win" />}
            <div className="result-player-badge">
            <span className="result-player-name">{winnerInfo.winner}</span>
          </div>
        </div>

        <img onClick={onBackHome} src="/assets/result/tryAgain.png" alt="try again" className="result-try-again" />
      </div>
    </div>
  );
}

