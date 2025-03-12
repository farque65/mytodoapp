import * as THREE from 'three';
import { AABB } from './AABB';

export class Path {
  scene: THREE.Scene;
  segments: { mesh: THREE.Group; aabb: AABB }[] = [];
  pool: { mesh: THREE.Group; aabb: AABB }[] = [];
  initialized: boolean = false;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  generateInitial() {
    if (this.initialized) return;
    for (let i = 0; i < 20; i++) {
      this.spawnSegment(-i * 3);
    }
    this.initialized = true;
  }

  spawnSegment(z: number) {
    let segment;
    if (this.pool.length > 0) {
      segment = this.pool.pop();
      if (segment && segment.mesh) {
        segment.mesh.position.set(0, 0, z);
        if (!this.scene.children.includes(segment.mesh)) {
          this.scene.add(segment.mesh);
        }
      } else {
        segment = this.createNewSegment(z);
      }
    } else {
      segment = this.createNewSegment(z);
    }
    this.segments.push({ mesh: segment.mesh, aabb: new AABB(segment.mesh.position, 3) });
  }

  createNewSegment(z: number) {
    const segment = new THREE.Group();
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.2, 3),
      new THREE.MeshBasicMaterial({ color: 0x666666 })
    );
    const moss = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.2, 3),
      new THREE.MeshBasicMaterial({ color: 0x00CC00 })
    );
    moss.position.y = 0.2;
    segment.add(base, moss);
    segment.position.set(0, 0, z);
    this.scene.add(segment);
    return { mesh: segment, aabb: new AABB(segment.position, 3) };
  }

  update(speed: number, playerZ: number) {
    this.segments.forEach(segment => {
      segment.mesh.position.z += speed;
    });
    this.segments = this.segments.filter(segment => {
      if (segment.mesh.position.z > 10) {
        this.scene.remove(segment.mesh);
        this.pool.push(segment);
        return false;
      }
      return true;
    });

    if (this.segments.length > 0 && playerZ < this.segments[this.segments.length - 1].mesh.position.z - 20) {
      this.spawnSegment(this.segments[this.segments.length - 1].mesh.position.z - 3);
    }
  }

  reset() {
    this.segments.forEach((segment, index) => {
      segment.mesh.position.set(0, 0, -index * 3);
      segment.aabb = new AABB(segment.mesh.position, 3);
    });
  }
}