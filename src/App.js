//CSS
import './App.css';

//React
import { useCallback, useEffect, useState } from "react";

//data
import { wordsList } from "./data/words";

//components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" }
]

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  /*console.log(words)*/

  const [pickedWord, setPickedWord] = useState('')
  const [pickedCategory, setPickedCategory] = useState('')
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(3)
  const [score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    //pick a random catergory
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]
    //console.log(category)
    //pick a random word inside category

    const word = words[category][Math.floor(Math.random() * Object.keys(words).length)]
    //console.log(word)

    return { word, category }
  }, [words]);

  //start the game

  const startGame = useCallback(() => {
    //clear last game
    clearLetterStates();

    //pick word and category

    const { word, category } = pickWordAndCategory();

    //create an array of letter
    let wordLetters = word.split('');
    wordLetters = wordLetters.map((letter) => letter.toLowerCase())
    //console.log(wordLetters)

    //fill states

    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    //console.log(word, category)
    setGameStage(stages[1].name)
  },[pickWordAndCategory]);

  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase();

      //check if the letter has already been used
    if(
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
      ) {
        return
      }

    // push guessed letter or remove a chance
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        letter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const clearLetterStates = () =>{
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  useEffect(()=>{
    if (guesses <= 0) {
      setGameStage(stages[2].name)
      //reset all states
      clearLetterStates();
    }
  }, [guesses])

  useEffect(() => {

    const uniqueLetters = [...new Set(letters)]

    //win condition
    if (guessedLetters.length === uniqueLetters.length) {
      //add score

      setScore((actualScore) => actualScore += 100)

      //restart game with a new word
      startGame();
    }

  }, [guessedLetters, letters, startGame])


  const retry = () => {
    setScore(0);
    setGuesses(3);

    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && <Game verifyLetter={verifyLetter} pickedWord={pickedWord} pickedCategory={pickedCategory} letters={letters} guessedLetters={guessedLetters} wrongLetters={wrongLetters} guesses={guesses} score={score}/>}
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
