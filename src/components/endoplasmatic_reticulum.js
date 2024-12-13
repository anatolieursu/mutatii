import * as THREE from "three";
import {data} from "../main";

export function createEndoplasmicReticulum() {
    const material = new THREE.MeshLambertMaterial({ color: 0x00ff7f, side: THREE.DoubleSide });

    class CustomSinCurve extends THREE.Curve {
        constructor(scale) {
            super();
            this.scale = scale;
        }

        getPoint(t) {
            const tx = Math.sin(2 * Math.PI * t) * this.scale;
            const ty = Math.cos(4 * Math.PI * t) * this.scale * 0.5;
            const tz = t * this.scale * 5 - this.scale * 2.5; // Lungime pe axa Z
            return new THREE.Vector3(tx, ty, tz);
        }
    }

    const path = new CustomSinCurve(2);
    const geometry = new THREE.TubeGeometry(path, 10, data.re.radius, 4, false);

    const reticulumMesh = new THREE.Mesh(geometry, material);

    const group = new THREE.Group();
    group.add(reticulumMesh);

    const numBranches = 20;
    for (let i = 0; i < numBranches; i++) {
        const branch = reticulumMesh.clone();

        const scale = Math.random() * 0.6 + 0.4;
        branch.scale.set(scale, scale, scale);

        branch.position.set(
            Math.random() * 10 - 5,
            Math.random() * 5 - 2.5,
            Math.random() * 5 - 2.5
        );

        branch.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        group.add(branch);
    }

    return group;
}