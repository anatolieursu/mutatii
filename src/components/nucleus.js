import * as THREE from "three";

export function createNucleus() {
    const nucleusGeometry = new THREE.SphereGeometry(3);
    const nucleusMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000, opacity: 0.5 });
    return new THREE.Mesh(nucleusGeometry, nucleusMaterial);
}