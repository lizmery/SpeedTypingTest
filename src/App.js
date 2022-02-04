import { useState, useEffect, useRef } from 'react'
import randomWords from 'random-words'
import './App.css'

const NUM_OF_WORDS = 200
const SECONDS = 60

function App() {
  const [words, setWords] = useState([])
  const [countdown, setCountdown] = useState(SECONDS)
  const [currInput, setCurrInput] = useState('')
  const [currWordIndex, setCurrWordIndex] = useState(0)
  const [currCharIndex, setCurrCharIndex] = useState(-1)
  const [currChar, setCurrChar] = useState('')
  const [correct, setCorrect] = useState(0)
  const [incorrect, setIncorrect] = useState(0)
  const [status, setStatus] = useState('waiting')
  const textInput = useRef(null)

  useEffect(() => {
    setWords(generateWords())
  }, [])

  useEffect(() => {
    if(status === 'started') {
      textInput.current.focus()
    }
  }, [status])

  function generateWords() {
    return new Array(NUM_OF_WORDS).fill(null).map(() => randomWords())
  }

  function start() {
    if(status === 'finished') {
      // resets everything back to intial values
      setWords(generateWords())
      setCurrWordIndex(0)
      setCorrect(0)
      setIncorrect(0)
      setCurrCharIndex(-1)
      setCurrChar('')
    }

    if(status !== 'started') {
      setStatus('started')

      let interval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if(prevCountdown === 0) {
            clearInterval(interval)
            setStatus('finished')
            setCurrInput('')
            return SECONDS
          } else {
            return prevCountdown - 1
          }
        })
      } , 1000)
    }
  }

  function handleKeyDown({keyCode, key}) {
    if(keyCode === 32) { // if spacebar is pressed
      checkMatch()
      setCurrInput('')
      setCurrWordIndex(currWordIndex + 1)
      setCurrCharIndex(-1)
    } else if(keyCode === 8) { // if backspace is pressed
      setCurrCharIndex(currCharIndex - 1)
      setCurrChar('') // erases current character
    } else {
      setCurrCharIndex(currCharIndex + 1)
      setCurrChar(key)
    }
  }

  function checkMatch() {
    const wordToCompare = words[currWordIndex]
    const doesItMatch = wordToCompare === currInput.trim()

    if(doesItMatch) {
      setCorrect(correct + 1)
    } else {
      setIncorrect(incorrect + 1)
    }
  }

  function getCharClass(wordIdx, charIdx, char) {
    if(wordIdx === currWordIndex && charIdx === currCharIndex && currChar && status !== 'finished') {
      if(char === currChar) {
        return 'correct'
      } else {
        return 'incorrect'
      }
    } else if(wordIdx === currWordIndex && currCharIndex >= words[currWordIndex].length) {
      return 'incorrect' // if there are extra characters
    } else {
      return ''
    }
  }

  return (
    <div className="App">
      <h1 className="heading">Speed Typing Test</h1>
      <h3 className="countdown">{countdown}</h3>
      <div className="form">
        <input 
          ref={textInput}
          disabled={status !== "started"}
          type="text" 
          className="input" 
          onKeyDown={handleKeyDown} 
          value={currInput} 
          onChange={(e) => setCurrInput(e.target.value)} 
        />
        <button className="start-btn" onClick={start}>
          Start
        </button>
      </div>
      {status === "started" && (
        <div className="card">
        {words.map((word, i) => (
            <span key={i}>
              <span>
                {word.split("").map((char, idx) => (
                  <span 
                    className={getCharClass(i, idx, char)}
                    key={idx}
                  >
                    {char}
                  </span>
                ))} 
              </span>
              <span> </span>
            </span>
        ))}
      </div>
      )}
      {status === "finished" && (
        <div className="results">
          <div className="speed">
            <h3>Words per minute:</h3>
            <p>{correct}</p>
          </div>
          <div className="accuracy">
            <h3>Accuracy:</h3>
            <p>{Math.round((correct / (correct + incorrect)) * 100)}%</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
