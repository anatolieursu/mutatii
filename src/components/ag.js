import * as THREE from "three";
import {data} from "../main";

export function createGolgiApparatus() {
    const material = new THREE.MeshLambertMaterial({ color: 0xffd700, side: THREE.DoubleSide });

    const group = new THREE.Group();

    const numCisternae = data.ag.numCisterne;
    const initialRadius = 0.15;
    const tubeRadius = 0.2;
    const separation = 0.2;

    for (let i = 0; i < numCisternae; i++) {
        const radius = initialRadius + i * 0.5;
        const geometry = new THREE.TorusGeometry(radius, tubeRadius, 16, 100, Math.PI);
        const mesh = new THREE.Mesh(geometry, material);

        mesh.rotation.x = Math.PI / 2;
        mesh.position.y = i * separation;

        group.add(mesh);
    }
    group.position.set(1, 0, 0);

    return group;
}
