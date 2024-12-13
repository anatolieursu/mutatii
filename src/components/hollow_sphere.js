import * as THREE from "three";

export function createHollowSphere(radius, thickness, material) {
    const outerSphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
    const outerSphere = new THREE.Mesh(outerSphereGeometry, material);

    const innerSphereGeometry = new THREE.SphereGeometry(radius - thickness, 32, 32);
    const innerMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
    const innerSphere = new THREE.Mesh(innerSphereGeometry, innerMaterial);

    const hollowSphere = new THREE.Group();
    hollowSphere.add(outerSphere);
    hollowSphere.add(innerSphere);

    return hollowSphere;
}

