import useTypingTest from './hooks/useTypingTest'
import './App.css'

function App() {
  const {
    countdown, 
    textInput, 
    status, 
    handleKeyDown, 
    currInput, 
    handleChange, 
    start, 
    words, 
    getCharClass, 
    correct, 
    incorrect
  } = useTypingTest()

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
          onChange={handleChange} 
        />
        <button 
          className="start-btn" 
          onClick={start}
          disabled={status === "started"}
        >
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
