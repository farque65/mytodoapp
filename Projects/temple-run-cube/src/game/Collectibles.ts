import * as THREE from 'three';
import { AABB } from './AABB';

export class Collectibles {
  scene: THREE.Scene;
  coins: { mesh: THREE.Group; aabb: AABB }[] = [];
  pool: { mesh: THREE.Group; aabb: AABB }[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  spawnCoin(z: number) {
    let coin;
    if (this.pool.length > 0) {
      coin = this.pool.pop()!;
      coin.mesh.position.set(0, 0.5, z);
    } else {
      coin = new THREE.Group();
      const mat = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
      const cube = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), mat);
      coin.add(cube);
      coin.position.set(0, 0.5, z);
      this.scene.add(coin);
    }
    this.coins.push({ mesh: coin, aabb: new AABB(coin.position, 0.5) });
  }

  update(speed: number) {
    this.coins.forEach(coin => {
      coin.mesh.position.z += speed;
    });
    this.coins = this.coins.filter(coin => {
      if (coin.mesh.position.z > 10) {
        this.scene.remove(coin.mesh);
        this.pool.push(coin);
        return false;
      }
      return true;
    });

    if (Math.random() < 0.01) {
      this.spawnCoin(this.coins.length ? this.coins[this.coins.length - 1].mesh.position.z - 5 : -5);
    }
  }

  reset() {
    this.coins.forEach(coin => this.scene.remove(coin.mesh));
    this.pool.push(...this.coins);
    this.coins = [];
    this.spawnCoin(-5);
  }
}