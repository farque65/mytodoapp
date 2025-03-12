import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { Player } from '../game/Player';
import { Path } from '../game/Path';
import { Obstacles } from '../game/Obstacles';
import { Collectibles } from '../game/Collectibles';
import { Collision } from '../game/Collision';
import HUD from './HUD';
import GameOver from './GameOver';

const Game: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<'waiting' | 'running' | 'gameOver'>('waiting');
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const playerRef = useRef<Player | null>(null);
  const pathRef = useRef<Path | null>(null);
  const obstaclesRef = useRef<Obstacles | null>(null);
  const collectiblesRef = useRef<Collectibles | null>(null);
  const collisionRef = useRef<Collision | null>(null);
  const speedRef = useRef(0.1);
  const distanceRef = useRef(0);

  useEffect(() => {
    // Setup Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current?.appendChild(renderer.domElement);

    // Initialize game objects
    playerRef.current = new Player(scene);
    pathRef.current = new Path(scene);
    obstaclesRef.current = new Obstacles(scene);
    collectiblesRef.current = new Collectibles(scene);
    collisionRef.current = new Collision(
      playerRef.current,
      pathRef.current,
      obstaclesRef.current,
      collectiblesRef.current
    );

    pathRef.current.generateInitial();
    obstaclesRef.current.spawn(-10);
    collectiblesRef.current.spawnCoin(-5);

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Touch controls
    let touchStartX = 0;
    let touchStartY = 0;
    const touchThreshold = 50;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX < touchThreshold && absDeltaY < touchThreshold) return;

      if (gameState === 'waiting') {
        setGameState('running');
      }

      if (gameState === 'running' && playerRef.current) {
        if (absDeltaX > absDeltaY) {
          deltaX > 0 ? playerRef.current.moveRight() : playerRef.current.moveLeft();
        } else {
          deltaY > 0 ? playerRef.current.slide() : playerRef.current.jump();
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    // Keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'waiting' && e.key === 'ArrowUp') {
        setGameState('running');
      }

      if (gameState === 'running' && playerRef.current) {
        switch (e.key) {
          case 'ArrowLeft':
            playerRef.current.moveLeft();
            break;
          case 'ArrowRight':
            playerRef.current.moveRight();
            break;
          case 'ArrowUp':
            playerRef.current.jump();
            break;
          case 'ArrowDown':
            playerRef.current.slide();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (gameState === 'running') {
        distanceRef.current += speedRef.current;
        setScore(Math.floor(distanceRef.current * 10));
        speedRef.current += 0.0001;

        playerRef.current?.update();
        pathRef.current?.update(speedRef.current, playerRef.current?.mesh.position.z || 0);
        obstaclesRef.current?.update(speedRef.current);
        collectiblesRef.current?.update(speedRef.current);

        const collisionResult = collisionRef.current?.check();
        if (collisionResult === 'gameOver') {
          setGameState('gameOver');
        } else if (collisionResult === 'coin') {
          setCoins(prev => prev + 1);
        }

        camera.position.z = (playerRef.current?.mesh.position.z || 0) + 5;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [gameState]); // Re-run effect if gameState changes

  const handleReplay = () => {
    setGameState('waiting');
    setScore(0);
    setCoins(0);
    speedRef.current = 0.1;
    distanceRef.current = 0;
    playerRef.current?.reset();
    pathRef.current?.reset();
    obstaclesRef.current?.reset();
    collectiblesRef.current?.reset();
  };

  return (
    <div ref={mountRef} className="w-full h-full relative">
      {gameState !== 'gameOver' && (
        <HUD score={score} coins={coins} gameState={gameState} />
      )}
      {gameState === 'gameOver' && (
        <GameOver score={score} onReplay={handleReplay} />
      )}
    </div>
  );
};

export default Game;