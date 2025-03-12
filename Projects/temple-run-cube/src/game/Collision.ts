import { Collectibles } from './Collectibles';
import { Obstacles } from './Obstacles';
import { Path } from './Path';
import { Player } from './Player';

export class Collision {
  player: Player;
  path: Path;
  obstacles: Obstacles;
  collectibles: Collectibles;

  constructor(player: Player, path: Path, obstacles: Obstacles, collectibles: Collectibles) {
    this.player = player;
    this.path = path;
    this.obstacles = obstacles;
    this.collectibles = collectibles;
  }

  check(): 'running' | 'gameOver' | 'coin' {
    this.player.updateAABB();

    for (const obstacle of this.obstacles.obstacles) {
      if (this.player.aabb.intersects(obstacle.aabb) && !this.player.isSliding) {
        return 'gameOver';
      }
    }

    for (let i = this.collectibles.coins.length - 1; i >= 0; i--) {
      const coin = this.collectibles.coins[i];
      if (this.player.aabb.intersects(coin.aabb)) {
        this.collectibles.coins.splice(i, 1);
        this.scene.remove(coin.mesh);
        this.collectibles.pool.push(coin);
        return 'coin';
      }
    }

    if (!this.player.isJumping) {
      let onPath = false;
      for (const segment of this.path.segments) {
        if (this.player.aabb.intersects(segment.aabb)) {
          onPath = true;
          break;
        }
      }
      if (!onPath) return 'gameOver';
    }

    return 'running';
  }

  get scene() {
    return this.collectibles.scene; // Assuming all use the same scene
  }
}