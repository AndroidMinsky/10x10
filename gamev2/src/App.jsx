import React, { useState, useEffect } from 'react';

const useSharedState = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  const [channel] = useState(() => new BroadcastChannel('app-state'));

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.key === key) {
        setValue(event.data.value);
      }
    };

    channel.addEventListener('message', handleMessage);
    return () => {
      channel.removeEventListener('message', handleMessage);
    };
  }, [channel, key]);

  const setSharedValue = (newValue) => {
    const actualNewValue = typeof newValue === 'function' ? newValue(value) : newValue;
    localStorage.setItem(key, JSON.stringify(actualNewValue));
    channel.postMessage({ key, value: actualNewValue });
    setValue(actualNewValue);
  };

  return [value, setSharedValue];
};

const IndexPage = ({ gameState, gameQuestion }) => {

  return (
    <div className="min-h-screen bg-purple-900 p-4 text-black">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-black/50 text-white px-4 py-1 rounded-lg font-bold">{gameState.team1Name}</div>
          <div className="bg-purple-400 text-white px-4 py-1 rounded-lg">{gameState.team1Score}</div>
        </div>
        <div className="text-xl text-white text-center">
          {gameQuestion.name || 'Waiting for the game to start...'}
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-purple-400 text-white px-4 py-1 rounded-lg">{gameState.team2Score}</div>
          <div className="bg-black/50 text-white px-4 py-1 rounded-lg font-bold">{gameState.team2Name}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-4">
        {/* Left Multipliers */}
        <div className="w-1/4 space-y-2">
          {gameQuestion.team1words.map((item, index) => (
            <div key={index} className={`flex justify-between items-center px-3 py-2 rounded-lg ${item?.highlighted ? 'bg-amber-200' : 'bg-sky-500'}`}>
              <span className="text-sm">{item.name}</span>
              <span className="font-bold">X{item.multiplier}</span>
            </div>
          ))}
          {gameState.stageOne && <div>
            <div className="flex justify-between items-center px-3 py-2 rounded-lg bg-sky-100 text-black mt-2">Оставшиеся попытки: {gameQuestion.team1attempts}</div>
          </div>}
        </div>

        {/* Center List */}
        {gameState.stageOne && <div className="flex-1 space-y-2">
          {gameQuestion.openWords.map((word, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                ?
              </div>
              <div className="flex-1 bg-sky-500 text-white py-2 px-4 rounded-lg flex justify-between items-center">
                <span></span>{word.text}{word.score ? <span className="font-bold">{word.score}</span> : <span></span>}
              </div>
            </div>
          ))}
        </div>}

        {gameState.stageTwo && <div className="flex-1 space-y-2">
          {gameQuestion.hiddenWords.map((word, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>
              {!word.hidden && <div className="flex-1 bg-sky-500 text-black py-2 px-4 rounded-lg flex justify-between items-center">
                <span></span>{word.text}{word.score ? <span className="font-bold">{word.score}</span> : <span></span>}
              </div>}
              {word.hidden && <div className="flex-1 bg-sky-500 text-white py-2 px-4 rounded-lg flex justify-center items-center">
              ⚡⚡⚡
              </div>}
            </div>
          ))}
        </div>}

        {/* Right Multipliers */}
        <div className="w-1/4 space-y-2">
          {gameQuestion.team2words.map((item, index) => (
            <div key={index} className={`flex justify-between items-center px-3 py-2 rounded-lg ${item?.highlighted ? 'bg-amber-200' : 'bg-sky-500'}`}>
              <span className="text-sm">{item.name}</span>
              <span className="font-bold">X{item.multiplier}</span>
            </div>
          ))}
          {gameState.stageOne && <div>
            <div className="flex justify-between items-center px-3 py-2 rounded-lg bg-sky-100 text-black mt-2">Оставшиеся попытки: {gameQuestion.team2attempts}</div>
          </div>}
        </div>
      </div>
    </div>
  );
};

const AdminPage = ({ gameState, setGameState, gameQuestion, setGameQuestion }) => {
  const questions = [
    { id: 1, text: 'IMDb Top 10 Movies', isOpen: false, answers: [ { position: 1, text: 'The Shawshank Redemption' }, { position: 2, text: 'The Godfather' }, { position: 3, text: 'The Dark Knight' }, { position: 4, text: 'The Godfather Part II' }, { position: 5, text: '12 Angry Men' }, { position: 6, text: 'The Lord of the Rings: The Return of the King' }, { position: 7, text: 'Schindler\'s List' }, { position: 8, text: 'The Lord of the Rings: The Fellowship of the Ring' }, { position: 9, text: 'The Good, the Bad and the Ugly' }, { position: 10, text: 'Fight Club' } ]},
    { id: 2, text: 'Billboard\'s Top 10 Artists of 2024', isOpen: false, answers: [ { position: 1, text: 'Taylor Swift' }, { position: 2, text: 'Morgan Wallen' }, { position: 3, text: 'Zach Bryan' }, { position: 4, text: 'Drake' }, { position: 5, text: 'Sabrina Carpenter' }, { position: 6, text: 'Billie Eilish' }, { position: 7, text: 'SZA' }, { position: 8, text: 'Luke Combs' }, { position: 9, text: 'Post Malone' }, { position: 10, text: 'Kendrick Lamar' } ]},
    { id: 3, text: 'Most popular New Year\'s resolutions in the US for 2025', isOpen: false, answers: [ { position: 1, text: 'Save more money' }, { position: 2, text: 'Eat healthier' }, { position: 3, text: 'Get more exercise' }, { position: 4, text: 'Lose weight' }, { position: 5, text: 'Spend more time with family and friends' }, { position: 6, text: 'Quit smoking' }, { position: 7, text: 'Reduce spendings' }, { position: 8, text: 'Spend less time on social media' }, { position: 9, text: 'Improve performance at work' }, { position: 10, text: 'Reduce stress' } ]},
    { id: 4, text: 'Top 10 Highest-Grossing Movies Of 2024', isOpen: false, answers: [ { position: 1, text: 'Inside Out 2' }, { position: 2, text: 'Deadpool & Wolverine' }, { position: 3, text: 'Wicked' }, { position: 4, text: 'Despicable Me 4' }, { position: 5, text: 'Moana 2' }, { position: 6, text: 'Beetlejuice Beetlejuice' }, { position: 7, text: 'Dune: Part Two' }, { position: 8, text: 'Twisters' }, { position: 9, text: 'Godzilla x Kong: The New Empire' }, { position: 10, text: 'Kung Fu Panda 4' } ]},
    { id: 5, text: 'Most searched people of 2024?', isOpen: false, answers: [ { position: 1, text: 'Donald Trump' }, { position: 2, text: 'Kate Middleton' }, { position: 3, text: 'Kamala Harris' }, { position: 4, text: 'Imane Khelif' }, { position: 5, text: 'Joe Biden' }, { position: 6, text: 'Mike Tyson' }, { position: 7, text: 'JD Vance' }, { position: 8, text: 'Lamine Yamal' }, { position: 9, text: 'Simone Biles' }, { position: 10, text: 'Diddy' } ]},
    { id: 6, text: 'Most searched slang words of 2024?', isOpen: false, answers: [ { position: 1, text: 'Demure' }, { position: 2, text: 'Sigma' }, { position: 3, text: 'Skibidi' }, { position: 4, text: 'Hawk tuah' }, { position: 5, text: 'Sobriquet' }, { position: 6, text: 'Shmaltz' }, { position: 7, text: 'Sen' }, { position: 8, text: 'Katz' }, { position: 9, text: 'Oeuvre' }, { position: 10, text: 'Preen' } ]},
    { id: 7, text: 'Какие неологизмы искали в 2024 году?', isOpen: false, answers: [ { position: 1, text: 'Докс' }, { position: 2, text: 'Скуф' }, { position: 3, text: 'Пикми' }, { position: 4, text: 'Нормис' }, { position: 5, text: 'Вонёнизм' }, { position: 6, text: 'Сигма' }, { position: 7, text: 'Анк' }, { position: 8, text: 'Делулу' }, { position: 9, text: 'Пов' }, { position: 10, text: 'Тюбик' } ]},
  ];

  const handleTeamChange = (field, value) => {
    setGameState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const [showQuestion, setShowQuestion] = useState(questions);

  const toggleQuestion = (key) => { 
    const updatedQuestion = showQuestion.map((question) => { 
        if (question.id === key) { 
            return { ...question, isOpen: !question.isOpen }; 
        } else { 
            return { ...question, isOpen: false }; 
        } 
    }); 

    setShowQuestion(updatedQuestion); 
}; 

  const handleStageOne = (field,value) => {

    const updatedHiddenWords = value.answers.map((answer, index) => {
      return {text: answer.text, hidden: true, score: (index + 1) * 100}
    })

    setGameState(prev => ({
      ...prev,
      stageOne: true,
      stageTwo: false
    }));
    setGameQuestion(prev => ({
      ...prev,
      [field]: value.text,
      team1attempts: 5,
      team2attempts: 5,
      openWords: [{text: '⚡⚡⚡', score: 0}, {text: '⚡⚡⚡', score: 0}, {text: '⚡⚡⚡', score: 0}, {text: '⚡⚡⚡', score: 0}, {text: '⚡⚡⚡', score: 0}, {text: '⚡⚡⚡', score: 0}, {text: '⚡⚡⚡', score: 0}, {text: '⚡⚡⚡', score: 0}, {text: '⚡⚡⚡', score: 0}, {text: '⚡⚡⚡', score: 0}],
      hiddenWords: updatedHiddenWords,
      team1words: [],
      team2words: [],
    }));
  };

  const handleStageTwo = (field,value) => {

    const openWordsArr = gameQuestion.openWords.map(word => word.text)
    const hiddenWordsArr = gameQuestion.hiddenWords.map(word => word.text)

    const additionalWords = hiddenWordsArr.filter(word => !openWordsArr.includes(word)).sort(() => Math.random() - 0.5);

    const additionalWordsTeam1 = additionalWords.splice(0, 5 - gameQuestion.team1words.length).map(word => {
      return {name: word, multiplier: 3, highlighted: false}
    })
    const additionalWordsTeam2 = additionalWords.splice(0, 5 - gameQuestion.team2words.length).map(word => {
      return {name: word, multiplier: 3, highlighted: false}
    })


    setGameQuestion(prev => ({
      ...prev,
      team1words: [...prev.team1words, ...additionalWordsTeam1],
      team2words: [...prev.team2words, ...additionalWordsTeam2],
    }));

    setGameState(prev => ({
      ...prev,
      stageTwo: true,
      stageOne: false
    }));
  }

  const handleReset = () => {
    setGameState(prev => ({
      ...prev,
      stageOne: false,

    }));
    setGameQuestion(prev => ({
      ...prev,
      name: null,
      team1words: [],
      team2words: [],
      openWords: [],
      team1attempts: 5,
      team2attempts: 5,
    }));
  };

  const handleMinus = (field) => {
    setGameQuestion(prev => ({
      ...prev,
      [field]: prev[field] - 1
    }));
  }

  const handleMultiplier = (field, name) => {

    const updatedMultiplier = gameQuestion[field].map(el => {
      if (el.name === name) {
        return {...el, multiplier: el.multiplier - 1}
      } else {
        return el
      }
    })
    setGameQuestion(prev => ({
      ...prev,
      [field]: updatedMultiplier
    }));
  }

  const handleAddingWordTeam1 = (value) => {
    const condition = (el) => el.text === '⚡⚡⚡';
    const index = gameQuestion.openWords.findIndex(condition);
    const updatedOpenWords = gameQuestion.openWords.map((word, i) => {
      if (i === index) {
        word.text = value;
        if (i === 0 || i === 1) {
          word.score = 100;
        } else if (i === 2 || i === 3) {
          word.score = 200;
        } else if (i === 4 || i === 5) {
          word.score = 300;
        } else if (i === 6 || i === 7) {
          word.score = 400;
        } else if (i === 8 || i === 9) {
          word.score = 500;
        }
        setGameState(prev => ({
          ...prev,
          team1Score: prev.team1Score + word.score
        }));
        return word;
      } else {
        return word;
      }
    })
    
    setGameQuestion(prev => ({
      ...prev,
      team1words: [...prev.team1words, {name: value, multiplier: 3, highlighted: true}],
      openWords: updatedOpenWords,
      team1attempts: prev.team1attempts - 1,
    }));
  }

  const handleAddingWordTeam2 = (value) => {
    const condition = (el) => el.text === '⚡⚡⚡';
    const index = gameQuestion.openWords.findIndex(condition);
    const updatedOpenWords = gameQuestion.openWords.map((word, i) => {
      if (i === index) {
        word.text = value;
        if (i === 0 || i === 1) {
          word.score = 100;
        } else if (i === 2 || i === 3) {
          word.score = 200;
        } else if (i === 4 || i === 5) {
          word.score = 300;
        } else if (i === 6 || i === 7) {
          word.score = 400;
        } else if (i === 8 || i === 9) {
          word.score = 500;
        }
        setGameState(prev => ({
          ...prev,
          team2Score: prev.team2Score + word.score
        }));
        return word;
      } else {
        return word;
      }
    })

    setGameQuestion(prev => ({
      ...prev,
      team2words: [...prev.team2words, {name: value, multiplier: 3, highlighted: true}],
      openWords: updatedOpenWords,
      team2attempts: prev.team2attempts - 1,
    }));

  }

  const handleReveal = (field, name, multiplier, scoreField, field2) => {
    const updatedHiddenWords = gameQuestion.hiddenWords.map(el => {
      if (el.text === name) {
        return {...el, hidden: false, score: el.score * multiplier}
      } else {
        return el
      }
    })

    function parameterTest(bool, bool2) {
      if (bool2 !== undefined) {
        const updatedTeamWords = gameQuestion[bool2].filter(el => {
          if (el.name !== name) return el
        })  
    
        setGameQuestion(prev => ({
          ...prev,
          hiddenWords: updatedHiddenWords,
          [bool2]: updatedTeamWords
        }));
      } else {
        const updatedTeamWords = gameQuestion[bool].filter(el => {
          if (el.name !== name) return el
        })  
    
        setGameQuestion(prev => ({
          ...prev,
          hiddenWords: updatedHiddenWords,
          [bool]: updatedTeamWords
        }));
      }
    }

    parameterTest(field, field2)

    const newScore = gameQuestion.hiddenWords.find(el => el.text === name).score * multiplier

    setGameState(prev => ({
      ...prev,
      [scoreField]: prev[scoreField] + newScore
    }));


  }


  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Game Admin</h1>
        
        {/* Team 1 Controls */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Team 1</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Team Name:</label>
              <input
                type="text"
                value={gameState.team1Name}
                onChange={(e) => handleTeamChange('team1Name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Score:</label>
              <input
                type="number"
                value={gameState.team1Score}
                onChange={(e) => handleTeamChange('team1Score', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              />
            </div>
          </div>
        </div>

        {/* Team 2 Controls */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Team 2</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Team Name:</label>
              <input
                type="text"
                value={gameState.team2Name}
                onChange={(e) => handleTeamChange('team2Name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Score:</label>
              <input
                type="number"
                value={gameState.team2Score}
                onChange={(e) => handleTeamChange('team2Score', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              />
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={() => setGameState({
            team1Name: 'Team 1',
            team2Name: 'Team 2',
            team1Score: 0,
            team2Score: 0
          })}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 mb-8"
        >
          Reset Game
        </button>

        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Questions</h2>  
            {showQuestion.map((question) => (
              <div key={question.id} className="space-y-8 mt-8">
                <h2 className="text-s font-bold bg-sky-500 text-white px-3 py-2 rounded-lg" onClick={() => toggleQuestion(question.id)}>{question.text}</h2>
                {question.isOpen && (
                  <div className="space-y-8 mt-8 bg-sky-200 p-4 rounded-lg">
                    {question.answers.map((answer) => (
                      gameQuestion.openWords.find(el => el.text === answer.text) 
                        ? <div className={`flex justify-between items-center px-3 py-2 rounded-lg bg-sky-100 text-black text-sm ${gameState.stageTwo ? 'hidden' : ''}`} key={answer.position}>{answer.position}. {answer.text}{gameState.stageOne && <div className="pointer-events-none opacity-50"><button onClick={() => handleAddingWordTeam1(answer.text)} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">{gameState.team1Name}</button><button onClick={() => handleAddingWordTeam2(answer.text)} className="bg-blue-500 text-white py-2 px-4 ml-2 rounded-md hover:bg-blue-600">{gameState.team2Name}</button><button className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 ml-2">↺</button></div>}</div>
                        : <div className={`flex justify-between items-center px-3 py-2 rounded-lg bg-sky-100 text-black text-sm ${gameState.stageTwo ? 'hidden' : ''}`} key={answer.position}>{answer.position}. {answer.text}{gameState.stageOne && <div><button onClick={() => handleAddingWordTeam1(answer.text)} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">{gameState.team1Name}</button><button onClick={() => handleAddingWordTeam2(answer.text)} className="bg-blue-500 text-white py-2 px-4 ml-2 rounded-md hover:bg-blue-600">{gameState.team2Name}</button><button className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 ml-2">↺</button></div>}</div>
                    ))}
                    
                    {gameState.stageOne && <div className="space-y-8 mt-8 bg-sky-300 p-4 rounded-lg">Attempts:
                      <div className="flex justify-between items-center px-3 py-2 rounded-lg bg-sky-100 text-black mt-2">
                        <span className="text-sm">{gameState.team1Name}</span>
                        <span className="font-bold">{gameQuestion.team1attempts}<button onClick={() => handleMinus('team1attempts')} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 ml-2">━</button></span>
                        
                      </div>
                      <div className="flex justify-between items-center px-3 py-2 rounded-lg bg-sky-100 text-black">
                        <span className="text-sm">{gameState.team2Name}</span>
                        <span className="font-bold">{gameQuestion.team2attempts}<button onClick={() => handleMinus('team2attempts')} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 ml-2">━</button></span>
                      </div>
                    </div>}

                    {gameState.stageTwo && <div className="space-y-8 mt-8 bg-sky-300 p-4 rounded-lg text-sm"><span className="font-bold text-xl">{gameState.team1Name}</span>{gameQuestion.team1words.map(el => <div key={el.name} className={`flex justify-between items-center ${el.highlighted ? 'bg-amber-200' : 'bg-sky-100'} px-3 py-2 rounded-lg text-black`}>{el.name} - {question.answers.find(answer => answer.text === el.name)?.position} <span className="font-bold">{!el.highlighted ? <><button onClick={() => handleReveal('team1words', el.name, el.multiplier, 'team1Score')} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">{gameState.team1Name}</button><button onClick={() => handleReveal('team2words', el.name, el.multiplier,'team2Score','team1words')} className="bg-blue-500 text-white py-2 px-4 ml-2 rounded-md hover:bg-blue-600">{gameState.team2Name}</button></> : <button onClick={() => handleReveal('team1words', el.name, el.multiplier, 'team1Score')}className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">{gameState.team1Name}</button>}<button onClick={() => handleMultiplier('team1words', el.name)} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 ml-2">{el.multiplier}</button></span></div>)}</div>}

                    {gameState.stageTwo && <div className="space-y-8 mt-8 bg-sky-300 p-4 rounded-lg text-sm"><span className="font-bold text-xl">{gameState.team2Name}</span>{gameQuestion.team2words.map(el => <div key={el.name} className={`flex justify-between items-center ${el.highlighted ? 'bg-amber-200' : 'bg-sky-100'} px-3 py-2 rounded-lg text-black`}>{el.name} - {question.answers.find(answer => answer.text === el.name)?.position} <span className="font-bold">{!el.highlighted ? <><button onClick={() => handleReveal('team2words', el.name, el.multiplier, 'team2Score')} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">{gameState.team2Name}</button><button onClick={() => handleReveal('team1words', el.name, el.multiplier,'team1Score','team2words')} className="bg-blue-500 text-white py-2 px-4 ml-2 rounded-md hover:bg-blue-600">{gameState.team1Name}</button></> : <button onClick={() => handleReveal('team2words', el.name, el.multiplier, 'team2Score')}className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">{gameState.team2Name}</button>}<button onClick={() => handleMultiplier('team2words', el.name)} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 ml-2">{el.multiplier}</button></span></div>)}</div>}

                    <button onClick={() => handleStageOne('name', question)} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mr-2">Start Stage 1</button>
                    <button onClick={() => handleStageTwo('name', question)} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mr-2">Start Stage 2</button>
                    <button onClick={handleReset} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">Reset</button>
                  </div>
                )}
                
                
              </div>
            ))}
            
        </div>

      </div>
    </div>
  );
};

const App = () => {
  
  const [gameState, setGameState] = useSharedState('gameState', {
    team1Name: 'Team 1',
    team2Name: 'Team 2',
    team1Score: 0,
    team2Score: 0,
    stageOne: false,
    stageTwo: false,
  });

  const [gameQuestion, setGameQuestion] = useSharedState('gameQuestion', 
    {
      name: null,
      team1words: [],
      team2words: [],
      openWords: [{text: '⚡⚡⚡', score: 0}, {text: '⚡⚡⚡', score: 0}, {text: '⚡⚡⚡', score: 0}, {text: '⚡⚡⚡', score: 0}, {text: '⚡⚡⚡', score: 0}, {text: '⚡⚡⚡', score: 0}, {text: '⚡⚡⚡', score: 0}, {text: '⚡⚡⚡', score: 0}, {text: '⚡⚡⚡', score: 0}, {text: '⚡⚡⚡', score: 0}],
      hiddenWords: [],
      team1attempts: 5,
      team2attempts: 5,
    }
  );
  
  const [currentPath] = useState(window.location.pathname);

  return currentPath === '/admin' 
    ? <AdminPage gameState={gameState} setGameState={setGameState} gameQuestion={gameQuestion} setGameQuestion={setGameQuestion} />
    : <IndexPage gameState={gameState} gameQuestion={gameQuestion} />;
};

export default App;