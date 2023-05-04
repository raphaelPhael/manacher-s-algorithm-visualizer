import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
// import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import './App.css';

type PointersObject = {
  iPointer: number,
  center: number,
  rightBoundary: number,
  pldrmLength: number[]
}

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
  // const str = 'ovradarvov';
  // const str = 'bananakdnsakddjnlkasxxxbananaxxxovradarvov';
  const str = 'banana';
  // const str = '255.62.6295212656123213';
  const s = `<-${str.toUpperCase().split('').join('-')}->`;
  const [speed, setSpeed] = useState<number>(500);
  const [nextIteration, setNextIteration] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const [finishedAnimation, setFinishedAnimation] = useState(false);
  const [palindrome, setPalindrome] = useState("");
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
  }, [finishedAnimation, startAnimation, pointers.pldrmLength])

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
  }

  const expand = () => {
    if (s[pointers.iPointer - 1 - pointers.pldrmLength[pointers.iPointer]] === s[pointers.iPointer + 1 + pointers.pldrmLength[pointers.iPointer]]) {
      const pldrmLen = [...pointers.pldrmLength];
      pldrmLen[pointers.iPointer]++;
      setPointers(prev => ({ ...prev, pldrmLength: pldrmLen }));
    } else {
      setStartAnimation(false);
      setFinishedAnimation(true);
    }
  }

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
  }

  const renderPointerWrappers = (idx: number) => {
    if (pointers.iPointer === idx || pointers.center === idx || pointers.rightBoundary === idx) {
      return (
        <div className="pointer-wrappers">
          {pointers.rightBoundary === idx &&
            <div className="pointer pointer-r"><p>R</p></div>
          }
          {pointers.center === idx &&
            <div className="pointer pointer-c">
              <p>C</p>
              <ArrowDownwardIcon sx={{ color: "#0e77da" }} />
            </div>
          }
          {pointers.iPointer === idx &&
            <div className="pointer pointer-i"><p>I</p></div>
          }
        </div>
      );
    }

    return null;
  }

  const getClassName = (idx: number) => {
    const iMirror = 2 * pointers.center - pointers.iPointer;
    if (
      pointers.iPointer < pointers.rightBoundary &&
      pointers.pldrmLength[iMirror] > 0 &&
      idx >= pointers.iPointer - pointers.pldrmLength[iMirror] &&
      idx <= pointers.iPointer + pointers.pldrmLength[iMirror]
    ) {
      return 'bgRight';
    } else if (
      idx !== pointers.iPointer &&
      pointers.pldrmLength[pointers.iPointer] > 0 &&
      idx >= pointers.iPointer - pointers.pldrmLength[pointers.iPointer] &&
      idx <= pointers.iPointer + pointers.pldrmLength[pointers.iPointer]
    ) {
      // if (!isAlphabetic) return 'notAlphabetic';
      return 'bgGreen';
    } else if (idx === pointers.iPointer) {
      return 'bgCenter';
      // } else if (
      //   pointers.iPointer < pointers.rightBoundary &&
      //   pointers.pldrmLength[iMirror] > 0 &&
      //   idx >= 2 * pointers.center - pointers.rightBoundary &&
      //   idx <= iMirror +  pointers.pldrmLength[pointers.iPointer] &&
      //   idx >= iMirror - pointers.pldrmLength[iMirror] && 
      //   idx <= iMirror + pointers.pldrmLength[iMirror]
      //   )
      // {
      //   // if (idx === iMirror) return 'bgCenter';
      //   // return 'bgGreen';
      //   return 'bgRight';
    } else {
      return 'palindrome-char-wrapper';
    }
  }

  const animateChar = (char: string, idx: number) => {
    // const regex = new RegExp(/[A-Za-z]/);
    // const isAlphabetic = regex.test(char);
    // const bgColor = getClassName(isAlphabetic, idx);
    const bgColor = getClassName(idx);
    const lastCharacter = idx + 1 < s.length ? false : bgColor;
    const pointerWrappers = renderPointerWrappers(idx);

    return (
      <div className={!lastCharacter ? `${bgColor}` : 'palindrome-char-wrapper'}>
        {/* {!lastCharacter ? pointerWrappers: null} */}
        {/* <div className={!lastCharacter ? `${bgColor}` : ''}> */}
        <div>
          {/* <p className={palindrome.length > 0 ? 'alphabeticChar' : 'notAlphabeticChar'}>{char}</p> */}
          <p className="palindrome-char">{char}</p>
        </div>
      </div>
    )
  }

  const start = () => moveIPointer();
  const restart = () => {
    // setNextIteration(false);
    // setFinishedAnimation(false);
    setPointers(() => ({
      iPointer: 1,
      center: 0,
      rightBoundary: 0,
      pldrmLength: new Array(s.length).fill(0)
    }));
    setNextIteration(true);
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const speed = parseInt(e.target.value);
    setSpeed(speed);
  }

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
              // <button type="button" onClick={() => start()}>START</button>
              <PlayArrowIcon sx={iconSx} onClick={() => start()} />
              :
              <RestartAltIcon sx={iconSx} onClick={() => restart()} />
            }
            {/* <button type="button" disabled={pointers.iPointer !== 1} onClick={() => start()}>START</button> */}
            {/* {pointers.iPointer + 1 === s.length && 
            <RestartAltIcon 
              sx={{
                fontSize: "50px",
                color: "#004eff",
                backgroundColor: "#1c7bff5c",
                padding: "5px",
                borderRadius: "100%",
                cursor: "pointer",
                '&:hover': {
                  backgroundColor: '#1c7bff80'
                }
              }}
              onClick={() => restart()}
            />} */}
          </div>
        </header>
        <div className="wrapper">
          <div className="animationDesc">
            <div className="desc-wrapper">
              <p className="lt-gt-hifen-wrapper">
                {/* <span className="lt-gt lt-gt-hifen">&lt; &gt;</span> */}
                <span className="lt-gt lt-gt-hifen">&lt; &gt;</span>
                and
                <span className="hifen lt-gt-hifen">-</span>
                to make the string of odd length
              </p>
            </div>
            <div className="desc-wrapper">
              <div className="square length-circle"></div>
              <p>length of the substring</p>
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
            {/* <div className="pointer pointer-c">
              <p>C</p>
              <p>center of palindrome</p>
            </div>
            <div className="pointer pointer-r">
              <p>R</p>
              <p>right boundary of palindrome</p>
            </div>
            <div className="pointer pointer-i">
              <p>I : Center of possible palindrome</p>
              <p>pointer that moves to each character expanding and acting as a possible center of a palindrome</p>
            </div> */}
          </div>
          <div className="palindrome-wrapper">
            {s.split('').map((char, idx) => (
              <div className="char-and-length-wrapper">
                {animateChar(char, idx)}
                <div className="char-pldrm-length">{pointers.pldrmLength[idx]}</div>
                {/* <div className="palindrome-char-wrapper">
                  <div className="palindrome-length-wrapper">
                    <p>{pointers.pldrmLength[idx]}</p>
                  </div>
                </div> */}
              </div>
            ))}
          </div>
          {palindrome.length > 0 &&
            <div className="longest-palindrome-wrapper">
              <div className="longest-palindrome-substring-wrapper">
                <p>
                  <span className="palindrome-substring">{palindrome.toUpperCase()}</span>
                  is the longest palindrome substring
                </p>
              </div>
              {/* <div className="longest-palindrome-length-wrapper">
                <p>
                  <span className="substring-length">{Math.max(...pointers.pldrmLength)}</span>
                  substring length
                </p>
              </div> */}
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
