import { useState, useEffect, useRef } from 'react'
import randomWords from 'random-words'

const NUM_OF_WORDS = 200
const SECONDS = 60

function useTypingTest() {
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
            textInput.current.focus();

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

    function handleChange(e) {
        const { value } = e.target
        setCurrInput(value)
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

    return {countdown, textInput, status, handleKeyDown, currInput, handleChange, start, words, getCharClass, correct, incorrect}
}

export default useTypingTest