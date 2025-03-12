import * as THREE from 'three';

export class AABB {
  min: THREE.Vector3;
  max: THREE.Vector3;

  constructor(position: THREE.Vector3, size: number) {
    const safePosition = position || new THREE.Vector3(0, 0, 0);
    this.min = new THREE.Vector3(safePosition.x - size / 2, safePosition.y - size / 2, safePosition.z - size / 2);
    this.max = new THREE.Vector3(safePosition.x + size / 2, safePosition.y + size / 2, safePosition.z + size / 2);
  }

  intersects(other: AABB): boolean {
    return (
      this.min.x <= other.max.x && this.max.x >= other.min.x &&
      this.min.y <= other.max.y && this.max.y >= other.min.y &&
      this.min.z <= other.max.z && this.max.z >= other.min.z
    );
  }
}