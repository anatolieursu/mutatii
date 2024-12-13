import * as THREE from "three";

export function createMitochondrion(x, y, z, color = 0xffa500) {
    const mitochondrionGeometry = new THREE.SphereGeometry(0.1, 10, 10);
    const mitochondrionMaterial = new THREE.MeshLambertMaterial({ color: 0xffa500 });

    const mitochondrion = new THREE.Mesh(mitochondrionGeometry, mitochondrionMaterial);

    mitochondrion.scale.set(1, 1, 2);

    mitochondrion.position.set(x, y, z);

    return mitochondrion;
}