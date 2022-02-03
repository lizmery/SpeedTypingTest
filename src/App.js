import { useState, useEffect } from 'react'
import randomWords from 'random-words'
import './App.css'

const NUM_OF_WORDS = 200
const SECONDS = 60

function App() {
  const [words, setWords] = useState([])
  const [countdown, setCountdown] = useState(SECONDS)
  const [currInput, setCurrInput] = useState("")
  const [currWordIndex, setCurrWordIndex] = useState(0)

  useEffect(() => {
    setWords(generateWords())
  }, [])

  function generateWords() {
    return new Array(NUM_OF_WORDS).fill(null).map(() => randomWords())
  }

  function start() {
    let interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if(prevCountdown === 0) {
          clearInterval(interval)
        } else {
          return prevCountdown - 1
        }
      })
    } , 1000)
  }

  function handleKeyDown({keyCode}) {
    // if spacebar is pressed
    if(keyCode === 32) {
      checkMatch()
      setCurrInput("")
      setCurrWordIndex(currWordIndex + 1)
    }
  }

  function checkMatch() {
    const wordToCompare = words[currWordIndex]
    const doesItMatch = wordToCompare === currInput.trim()
  }

  return (
    <div className="App">
      <h1 className="heading">Speed Typing Test</h1>
      <h3 className="countdown">{countdown}</h3>
      <div className="form">
        <input 
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
      <div className="card">
        <div className="card-content">
          {words.map((word, i) => (
              <span key={i}>
                <span>
                  {word.split("").map((char, idx) => (
                    <span key={idx}>{char}</span>
                  ))} 
                </span>
                <span> </span>
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
