import React from 'react';

interface HUDProps {
  score: number;
  coins: number;
  gameState: 'waiting' | 'running' | 'gameOver';
}

const HUD: React.FC<HUDProps> = ({ score, coins, gameState }) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between items-center text-white pointer-events-none">
      <div className="flex flex-col items-center mt-4">
        <div className="text-lg md:text-2xl">Score: {score}</div>
        <div className="text-lg md:text-2xl">Coins: {coins}</div>
      </div>
      {gameState === 'waiting' && (
        <div className="text-xl md:text-3xl">Swipe to Start</div>
      )}
    </div>
  );
};

export default HUD;