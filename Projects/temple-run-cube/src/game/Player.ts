import * as THREE from 'three';
import { AABB } from './AABB';

export class Player {
  mesh: THREE.Group;
  aabb: AABB;
  velocityY: number = 0;
  isJumping: boolean = false;
  isSliding: boolean = false;

  constructor(scene: THREE.Scene) {
    this.mesh = new THREE.Group();
    const bodyGeo = new THREE.BoxGeometry(1, 2, 1);
    const bodyMat = new THREE.MeshBasicMaterial({ color: 0xFF3333 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1;
    this.mesh.add(body);

    this.mesh.position.y = 0.375;
    this.aabb = new AABB(this.mesh.position, 1);
    scene.add(this.mesh);
  }

  update() {
    if (this.isJumping) {
      this.mesh.position.y += this.velocityY;
      this.velocityY -= 0.01;
      if (this.mesh.position.y <= 0.375) {
        this.mesh.position.y = 0.375;
        this.isJumping = false;
        this.velocityY = 0;
      }
    } else if (this.isSliding) {
      this.mesh.position.y = 0;
    } else {
      this.mesh.position.y = 0.375;
    }
    this.updateAABB();
  }

  updateAABB() {
    this.aabb = new AABB(this.mesh.position, 1);
  }

  jump() {
    if (!this.isJumping && !this.isSliding) {
      this.velocityY = 0.2;
      this.isJumping = true;
    }
  }

  slide() {
    if (!this.isJumping) {
      this.isSliding = true;
      setTimeout(() => (this.isSliding = false), 300);
    }
  }

  moveLeft() {
    this.mesh.position.x = Math.max(-1, this.mesh.position.x - 1);
  }

  moveRight() {
    this.mesh.position.x = Math.min(1, this.mesh.position.x + 1);
  }

  reset() {
    this.mesh.position.set(0, 0.375, 0);
    this.velocityY = 0;
    this.isJumping = false;
    this.isSliding = false;
  }
}