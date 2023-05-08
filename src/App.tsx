import { useState, useEffect, ChangeEvent } from "react";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Character from "./components/Character/character-component";
import { PointersObject } from "./pointersObjectType";
import { v4 as uuidv4 } from "uuid";
import './App.css';

const iconSx = {
  fontSize: "50px",
  color: "#0075ff",
  backgroundColor: "#b0d4fd",
  padding: "5px",
  borderRadius: "100%",
  cursor: "pointer",
  '&:hover': {
    backgroundColor: '#9ec6ff'
  }
}

function App() {
  const str = 'banana';
  const s = `<-${str.toUpperCase().split('').join('-')}->`;
  const [speed, setSpeed] = useState<number>(500);
  const [nextIteration, setNextIteration] = useState<Boolean>(false);
  const [startAnimation, setStartAnimation] = useState<Boolean>(false);
  const [finishedAnimation, setFinishedAnimation] = useState<Boolean>(false);
  const [palindrome, setPalindrome] = useState<String>("");
  const [pointers, setPointers] = useState<PointersObject>({
    iPointer: 1,
    center: 0,
    rightBoundary: 0,
    pldrmLength: new Array(s.length).fill(0)
  });

  useEffect(() => {
    if (nextIteration) moveIPointer();
    else if (finishedAnimation) updateCenterAndRightBoundary();
    else if (startAnimation) setTimeout(() => expand(), speed);
  }, [finishedAnimation, startAnimation, pointers.pldrmLength]);

  const updateCenterAndRightBoundary = () => {
    if (pointers.iPointer + pointers.pldrmLength[pointers.iPointer] > pointers.rightBoundary) {
      setPointers(prev => (
        {
          ...prev,
          iPointer: prev.iPointer + 1,
          center: pointers.iPointer,
          rightBoundary: pointers.iPointer + pointers.pldrmLength[pointers.iPointer]
        }));
    } else {
      setPointers(prev => ({ ...prev, iPointer: prev.iPointer + 1 }));
    }
    setFinishedAnimation(!finishedAnimation);
    setNextIteration(true);
  };

  const expand = () => {
    if (s[pointers.iPointer - 1 - pointers.pldrmLength[pointers.iPointer]] === s[pointers.iPointer + 1 + pointers.pldrmLength[pointers.iPointer]]) {
      const pldrmLen = [...pointers.pldrmLength];
      pldrmLen[pointers.iPointer]++;
      setPointers(prev => ({ ...prev, pldrmLength: pldrmLen }));
    } else {
      setStartAnimation(false);
      setFinishedAnimation(true);
    }
  };

  const moveIPointer = () => {
    setNextIteration(false);
    if (pointers.iPointer < s.length - 1) {
      const i_mirror = 2 * pointers.center - pointers.iPointer;
      if (pointers.iPointer < pointers.rightBoundary) {
        const pldrmLen = [...pointers.pldrmLength]
        pldrmLen[pointers.iPointer] = Math.min(pointers.rightBoundary - pointers.iPointer, pointers.pldrmLength[i_mirror]);
        setPointers(prev => ({ ...prev, pldrmLength: pldrmLen }));
      }
      setStartAnimation(true);
    } else {
      let maxLen = 0;
      let centerOfPldrmIdx = 0;
      for (let i = 1; i < s.length - 1; i++) {
        if (pointers.pldrmLength[i] > maxLen) {
          maxLen = pointers.pldrmLength[i];
          centerOfPldrmIdx = i;
        }
      }
      const startIdx = (centerOfPldrmIdx - maxLen) / 2;
      const endIdx = startIdx + maxLen;
      const palindrome = str.substring(startIdx, endIdx);
      setPalindrome(palindrome);
    }
  };

  const start = () => moveIPointer();

  const restart = () => {
    setPointers(() => ({
      iPointer: 1,
      center: 0,
      rightBoundary: 0,
      pldrmLength: new Array(s.length).fill(0)
    }));
    setNextIteration(true);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const speed = parseInt(e.target.value);
    setSpeed(speed);
  };

  return (
    <div className="App">
      <div className="container">
        <header>
          <div className="header-actions">
            <div className="range-input-wrapper">
              <form>
                <label htmlFor="speed">Animation Speed</label>
                <input
                  type="range"
                  id="speed"
                  name="speed"
                  min="0"
                  max="1000"
                  value={speed}
                  onChange={handleChange}
                />
              </form>
            </div>
            <div>{speed} ms</div>
          </div>
          <div className="start-button-wrapper">
            {pointers.iPointer === 1 ?
              <PlayArrowIcon sx={iconSx} onClick={() => start()} />
              :
              <RestartAltIcon sx={iconSx} onClick={() => restart()} />
            }
          </div>
        </header>
        <div className="wrapper">
          <div className="animationDesc">
            <div className="desc-wrapper">
              <p className="lt-gt-hifen-wrapper">
                <span className="lt-gt lt-gt-hifen">&lt; &gt;</span>
                and
                <span className="hifen lt-gt-hifen">-</span>
                to make the string of odd length
              </p>
            </div>
            <div className="desc-wrapper">
              <div className="square center-square"></div>
              <p>center of the substring</p>
            </div>
            <div className="desc-wrapper">
              <div className="square expand-square"></div>
              <p>equal characters</p>
            </div>
            <div className="desc-wrapper">
              <div className="square computed-square"></div>
              <p>already computed palindrome</p>
            </div>
          </div>
          <div className="palindrome-wrapper">
            {s.split('').map((char, idx) => (
              <Character pointers={pointers} idx={idx} char={char} str={s} key={uuidv4()} />
            ))}
          </div>
          {palindrome.length > 0 &&
            <div>
              <div>
                <p>
                  <span className="palindrome-substring">{palindrome.toUpperCase()}</span>
                  is the longest palindrome substring
                </p>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default App;
