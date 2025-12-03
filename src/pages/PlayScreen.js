import { createRef, useCallback, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { v4 as uuidv4 } from 'uuid';
import arrow from '../assets/play/arrow.png';
import correctImg from '../assets/play/correct.png';
import fruitsDetail from '../assets/play/fruitsDetail.png';
import fruitsInfo from '../assets/play/fruitsInfo.png';
import guo from '../assets/play/guo.png';
import playBg from '../assets/play/playground.png';
import play1Bg from '../assets/play/play1Bg.png';
import play2Bg from '../assets/play/play2Bg.png';
import vsImg from '../assets/play/vs.png';
import wrongImg from '../assets/play/wrong.png';
import yaoBg from '../assets/play/yaoBg.png';
import yao1 from '../assets/play/yao1.png';
import yao2 from '../assets/play/yao2.png';
import { BAD_FRUITS, FRUITS, GOOD_FRUITS } from '../data/fruits';
import { BAD_COUNT_BY_DIFFICULTY, DEFAULT_DIFFICULTY_KEY } from '../constants/difficulty';
import ResultModal from '../components/ResultModal';

const DEFAULT_SETTINGS = {
  difficulty: DEFAULT_DIFFICULTY_KEY,
  rounds: 3,
};

const MAX_SELECTION_PER_TURN = 2;

const cloneFruit = (fruit) => ({
  ...fruit,
  instanceId: `${fruit.id}-${uuidv4()}`,
});

const shuffle = (input) => {
  const list = [...input];
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
};

const recipeLabel = (fruits) => fruits.map((item) => item.name).join(' + ');

export default function PlayScreen({ settings = DEFAULT_SETTINGS, onBackHome, onRestart }) {
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [displayFruits, setDisplayFruits] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedFruits, setSelectedFruits] = useState([]);
  const [pendingFruit, setPendingFruit] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [turnBanner, setTurnBanner] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [resultModal, setResultModal] = useState(false);
  const [winnerInfo, setWinnerInfo] = useState(null);
  const [alert, setAlert] = useState('');
  const [turnSeed, setTurnSeed] = useState(0);
  const [turnLocked, setTurnLocked] = useState(false);
  const [dragDisabled, setDragDisabled] = useState(true);
  const cauldronRef = useRef(null);
  const dragNodeRefs = useRef({});
  const fruitGridRef = useRef(null);
  const [fruitGridSize, setFruitGridSize] = useState({ width: 260, height: 120 });

  const difficultyBadCount =
    BAD_COUNT_BY_DIFFICULTY[settings.difficulty] ?? BAD_COUNT_BY_DIFFICULTY[DEFAULT_DIFFICULTY_KEY];

  const handleGameEnd = useCallback(
    (finalScores = scores) => {
      const player1 = finalScores[1];
      const player2 = finalScores[2];
      let winner;
      if (player1 === player2) {
        winner = '무승부';
      } else if (player1 > player2) {
        winner = '무승부 A';
      } else {
        winner = '무승부 B';
      }
      setWinnerInfo({
        winner,
        player1,
        player2,
      });
      setResultModal(true);
    },
    [scores],
  );

  const buildRecipes = useCallback(() => {
    const picks = shuffle(GOOD_FRUITS).slice(0, 4);
    const firstRecipe = [picks[0], picks[1]];
    const secondRecipe = [picks[2], picks[3]];
    return [
      { id: 'recipe-1', fruits: firstRecipe, label: recipeLabel(firstRecipe), result: yao1 },
      { id: 'recipe-2', fruits: secondRecipe, label: recipeLabel(secondRecipe), result: yao2 },
    ];
  }, []);

  const buildRoundDeck = useCallback(
    (activeRecipes) => {
      const recipeFruitIds = new Set(activeRecipes.flatMap((recipe) => recipe.fruits.map((fruit) => fruit.id)));
      const desiredBad = Math.min(3, difficultyBadCount);

      const initialGood = [];
      activeRecipes.forEach((recipe) => {
        recipe.fruits.forEach((fruit) => initialGood.push(cloneFruit(fruit)));
      });

      const remainingGoodPool = shuffle(
        GOOD_FRUITS.filter((fruit) => !recipeFruitIds.has(fruit.id)),
      );

      while (initialGood.length < 7 - desiredBad) {
        const next = remainingGoodPool.pop();
        if (!next) break;
        initialGood.push(cloneFruit(next));
      }

      const badCandidates = shuffle(BAD_FRUITS);
      const badFruits = [];
      for (let i = 0; i < desiredBad && badCandidates.length; i += 1) {
        badFruits.push(cloneFruit(badCandidates.pop()));
      }

      const initialDeck = shuffle([...initialGood, ...badFruits]).slice(0, 7);

      return { initialDeck };
    },
    [difficultyBadCount],
  );

  const scheduleNextTurn = useCallback(
    (messageText) => {
      setTurnLocked(true);
      setTurnBanner(messageText);
      setTimeout(() => {
        setTurnBanner(null);
        setTurnLocked(false);
        if (currentPlayer === 1) {
          setCurrentPlayer(2);
        } else if (currentRound >= settings.rounds) {
          handleGameEnd();
          return;
        } else {
          setCurrentPlayer(1);
          setCurrentRound((prev) => prev + 1);
        }
        setTurnSeed((prev) => prev + 1);
      }, 1000);
    },
    [currentPlayer, currentRound, handleGameEnd, settings.rounds],
  );

  const initTurn = useCallback(() => {
    setDragDisabled(true);
    const nextRecipes = buildRecipes();
    const { initialDeck } = buildRoundDeck(nextRecipes);
    dragNodeRefs.current = {};
    setRecipes(nextRecipes);
    
    // 去重：确保没有重复的 instanceId
    const seenIds = new Set();
    const uniqueDeck = initialDeck.filter((fruit) => {
      if (seenIds.has(fruit.instanceId)) {
        // 如果重复，重新生成instanceId
        fruit.instanceId = `${fruit.id}-${uuidv4()}`;
      }
      seenIds.add(fruit.instanceId);
      return true;
    });
    
    uniqueDeck.forEach((fruit) => {
      dragNodeRefs.current[fruit.instanceId] = createRef();
    });
    setDisplayFruits(uniqueDeck);
    setDragDisabled(false);
    setSelectedFruits([]);
    setPendingFruit(null);
    setFeedback(null);
    setAlert('');
    setTurnLocked(false);
  }, [buildRecipes, buildRoundDeck]);

  useEffect(() => {
    initTurn();
  }, [turnSeed, initTurn]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(''), 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [alert]);

  useEffect(() => {
    const updateSize = () => {
      if (fruitGridRef.current) {
        const rect = fruitGridRef.current.getBoundingClientRect();
        if (rect.width && rect.height) {
          setFruitGridSize({ width: rect.width, height: rect.height });
        }
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleFruitTaken = useCallback(
    (fruit) => {
      if (turnLocked) return;
      if (selectedFruits.find((item) => item.instanceId === fruit.instanceId)) {
        setAlert('이미 이 과일을 투입 하였습니다');
        return;
      }
      if (selectedFruits.length >= MAX_SELECTION_PER_TURN) {
        setAlert('이번 라운드에는 이미 과일 2개가 투입되었다');
        return;
      }

      if (fruit.type === 'bad') {
        setAlert('나쁜 과일을 선택하면, 이번 라운드는 2점을 감점합니다.');
      }

      setPendingFruit(null);
      setSelectedFruits((prev) => [...prev, fruit]);
      setDisplayFruits((prev) => {
        const nextList = prev.filter((item) => item.instanceId !== fruit.instanceId);
        delete dragNodeRefs.current[fruit.instanceId];
        // 不再从 reserveFruits 补充，等待匹配完成后一次性刷新
        return nextList;
      });
    },
    [currentPlayer, selectedFruits, turnLocked],
  );

  const isInsideCauldron = useCallback(
    (node) => {
      if (!cauldronRef.current || !node) return false;
      
      const nodeRect = node.getBoundingClientRect();
      const fruitCenterY = nodeRect.top + nodeRect.height / 2;
      
      // 获取容器（play-screen）的高度
      const playScreen = node.closest('.play-screen');
      if (!playScreen) return false;
      
      const containerRect = playScreen.getBoundingClientRect();
      const containerHeight = containerRect.height;
      
      // 底部1/3区域
      const dropAreaTop = containerRect.top + containerHeight * (2 / 3);
      const dropAreaBottom = containerRect.top + containerHeight;
      
      // 检查水果中心点是否在底部1/3区域内
      return fruitCenterY >= dropAreaTop && fruitCenterY <= dropAreaBottom;
    },
    [],
  );

  const handleDragStop = useCallback(
    (fruit, event, data) => {
      // 清除拖拽状态
      setPendingFruit(null);
      
      // 获取节点引用
      const nodeRef = dragNodeRefs.current[fruit.instanceId];
      const node = nodeRef?.current;
      
      if (node) {
        // 检查是否在热区内
        if (isInsideCauldron(node)) {
          // 在热区内，立即处理水果
          handleFruitTaken(fruit);
        } else {
          // 不在热区内，重置位置
          node.style.transform = 'none';
        }
      }
    },
    [handleFruitTaken, isInsideCauldron],
  );

  const refreshFruits = useCallback(() => {
    setDragDisabled(true);
    // 刷新7个新水果
    const nextRecipes = buildRecipes();
    const { initialDeck } = buildRoundDeck(nextRecipes);
    
    // 清理旧的拖拽引用
    Object.keys(dragNodeRefs.current).forEach((key) => {
      delete dragNodeRefs.current[key];
    });
    
    // 确保没有重复的instanceId
    const seenIds = new Set();
    const uniqueDeck = initialDeck.filter((fruit) => {
      if (seenIds.has(fruit.instanceId)) {
        // 如果重复，重新生成instanceId
        fruit.instanceId = `${fruit.id}-${uuidv4()}`;
      }
      seenIds.add(fruit.instanceId);
      return true;
    });
    
    // 创建新的拖拽引用
    uniqueDeck.forEach((fruit) => {
      dragNodeRefs.current[fruit.instanceId] = createRef();
    });
    
    setDisplayFruits(uniqueDeck);
    setDragDisabled(false);
    setRecipes(nextRecipes);
  }, [buildRecipes, buildRoundDeck]);

  const evaluateSelection = useCallback(
    (selection) => {
      setDragDisabled(true);
      const isLastTurn = currentPlayer === 2 && currentRound === settings.rounds;
      const badCount = selection.filter((fruit) => fruit.type === 'bad').length;
      const currentScore = scores[currentPlayer];
      let delta = 0;
      let overlayImg = wrongImg;
      let bannerText = '匹配失败！0 分';

      if (badCount === 2) {
        delta = -4;
        bannerText = '匹配失败！扣 4 分';
      } else if (badCount === 1) {
        delta = -2;
        bannerText = '匹配失败！扣 2 分';
      } else {
        const normalizedSelection = selection
          .map((fruit) => fruit.id)
          .sort()
          .join('-');
        const matches = recipes.filter((recipe) => {
          const key = recipe.fruits
            .map((fruit) => fruit.id)
            .sort()
            .join('-');
          return key === normalizedSelection;
        });

        if (matches.length === 2) {
          delta = 10;
          bannerText = '匹配成功！+10 分';
          overlayImg = correctImg;
        } else if (matches.length === 1) {
          delta = 5;
          bannerText = '匹配成功！+5 分';
          overlayImg = correctImg;
        } else {
          delta = 0;
          overlayImg = wrongImg;
          bannerText = '匹配失败！0 分';
        }
      }

      const finalScore = currentScore + delta;
      const updatedScores = { ...scores, [currentPlayer]: finalScore };
      setScores(updatedScores);
      setFeedback({ image: delta >= 0 ? overlayImg : wrongImg, text: bannerText });
      if (isLastTurn) {
        setTimeout(() => {
          setFeedback(null);
          handleGameEnd(updatedScores);
        }, 1200);
      } else {
        setTimeout(() => {
          setFeedback(null);
          refreshFruits();
        }, 1200);
        scheduleNextTurn(`切换至무승부 ${currentPlayer === 1 ? 2 : 1}`);
      }
      setSelectedFruits([]);
    },
    [
      currentPlayer,
      currentRound,
      recipes,
      scheduleNextTurn,
      scores,
      refreshFruits,
      settings.rounds,
      handleGameEnd,
    ],
  );

  useEffect(() => {
    if (selectedFruits.length === MAX_SELECTION_PER_TURN) {
      evaluateSelection(selectedFruits);
    }
  }, [evaluateSelection, selectedFruits]);

  return (
    <div className="play-screen">
      <img src={playBg} alt="playground background" className="play-bg" />

      <div className="play-toolbar">
        <button onClick={onBackHome}>돌아가다</button>
        <div className="turn-info">
          Round {currentRound} / {settings.rounds}
        </div>
        {/* <div className="turn-info">当前무승부：{currentPlayer}</div> */}
      </div>

      <div className={`player-card player-1 ${currentPlayer === 1 ? 'active' : ''}`}>
        <img src={play1Bg} alt="player 1" className="player-card-img" />
        <div className="player-content">
          <div className="player-content-inner">
            <div className="player-score-block-1">
              <span className="player-score-value">{scores[1]}</span>
            </div>
            <div className="player-info-block-1">
            <span className="player-label">플레</span>
            <span className="player-label">이어</span>
            <span className="player-label">A</span>
              {/* <span className="player-label">플레</span>
              <span className="player-label">이어</span> */}
              {/* <span className="player-number">1</span> */}
            </div>
          </div>
        </div>
      </div>

      <div className={`player-card player-2 ${currentPlayer === 2 ? 'active' : ''}`}>
        <img src={play2Bg} alt="player 2" className="player-card-img-2" />
        <div className="player-content">
          <div className="player-content-inner">
            <div className="player-score-block">
              <span className="player-score-value">{scores[2]}</span>
            </div>
            <div className="player-info-block">
              <span className="player-label">플레</span>
              <span className="player-label">이어</span>
            <span className="player-label">B</span>
              {/* <span className="player-number">2</span> */}
            </div>
          </div>
        </div>
      </div>

      <img src={vsImg} alt="vs" className="vs-image" />
      <img src={arrow} alt="arrow indicator" className="vs-arrow" />

      <div className="recipe-board">
        {/* <img src={yaoBg} alt="recipe background" className="yao-bg" /> */}
        <div className="recipe-list">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-row">
              <div className="recipe-card">
                <img src={recipe.fruits[0].image} alt={recipe.fruits[0].name} />
              </div>
              <span className="recipe-symbol">+</span>
              <div className="recipe-card">
                <img src={recipe.fruits[1].image} alt={recipe.fruits[1].name} />
              </div>
              <span className="recipe-symbol">=</span>
              <div className="recipe-result">
                <img src={recipe.result} alt="result" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fruit-grid" ref={fruitGridRef}>
        {displayFruits.map((fruit, index) => {
          if (!dragNodeRefs.current[fruit.instanceId]) {
            dragNodeRefs.current[fruit.instanceId] = createRef();
          }
          const nodeRef = dragNodeRefs.current[fruit.instanceId];
          const total = displayFruits.length || 1;
          const { width, height } = fruitGridSize;
          const spacing = width / (total + 1);
          const centerX = width / 2;
          const baseY = height * 0.35;
          const arcHeight = height * 0.18;
          const x = spacing * (index + 1);
          const t = (x - centerX) / centerX; // -1..1
          const y = baseY + arcHeight * (t * t);
          const halfSize = 25; // roughly half of fruit image (40px)
          const style = {
            position: 'absolute',
            left: `${x - halfSize}px`,
            top: `${y - halfSize}px`,
          };
          return (
            <Draggable
              key={fruit.instanceId}
              nodeRef={nodeRef}
              disabled={dragDisabled}
              onStart={() => setPendingFruit(fruit)}
              onStop={(event, data) => handleDragStop(fruit, event, data)}
            >
              <div
                ref={nodeRef}
                className={`fruit-item ${fruit.type === 'bad' ? 'fruit-bad' : ''} ${
                  pendingFruit?.instanceId === fruit.instanceId ? 'fruit-selected' : ''
                }`}
                style={style}
                onClick={() => setPendingFruit(fruit)}
              >
                <img src={fruit.image} alt={fruit.name} />
                <span>{fruit.name}</span>
              </div>
            </Draggable>
          );
        })}
      </div>

      <div
        className="cauldron-zone"
        ref={cauldronRef}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const id = event.dataTransfer.getData('text/plain');
          const fruit = displayFruits.find((item) => item.instanceId === id);
          if (fruit) {
            handleFruitTaken(fruit);
          }
        }}
        onClick={() => {
          if (pendingFruit) {
            handleFruitTaken(pendingFruit);
          }
        }}
      >
        <img src={guo} alt="cauldron" className="guo" draggable="false" />
      </div>

      <button className="fruit-detail-entry" onClick={() => setDetailOpen(true)} aria-label="查看水果详情">
        <img src={fruitsDetail} alt="fruits detail entry" />
      </button>

      {alert && <div className="toast">{alert}</div>}

      {/* {turnBanner && <div className="turn-banner">{turnBanner}</div>} */}

      {feedback && (
        <div className="feedback-overlay">
          <img src={feedback.image} alt="feedback" />
          {/* <p>{feedback.text}</p> */}
        </div>
      )}

      {detailOpen && (
        <div className="modal-mask" onClick={() => setDetailOpen(false)}>
          <div className="fruit-detail-modal">
            <img src={fruitsInfo} alt="fruits info background" className="fruit-info-bg" />
          </div>
        </div>
      )}

      {resultModal && winnerInfo && (
        <ResultModal
          winnerInfo={winnerInfo}
          onBackHome={onBackHome}
          onRestart={() => {
            setCurrentRound(1);
            setCurrentPlayer(1);
            setScores({ 1: 0, 2: 0 });
            setResultModal(false);
            setWinnerInfo(null);
            setTurnSeed((prev) => prev + 1);
            onRestart();
          }}
        />
      )}
    </div>
  );
}

