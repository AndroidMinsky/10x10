import React, { useState, useEffect } from 'react';

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

  
  export default IndexPage; 