import * as THREE from "three";

export function createRibosomes(group, count, minPosition, maxPosition) {
    const ribosomeGeometry = new THREE.SphereGeometry(0.1, 15, 15);
    const ribosomeMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });

    for (let i = 0; i < count; i++) {
        const ribosome = new THREE.Mesh(ribosomeGeometry, ribosomeMaterial);

        ribosome.position.set(
            THREE.MathUtils.randFloat(minPosition.x, maxPosition.x),
            THREE.MathUtils.randFloat(minPosition.y, maxPosition.y),
            THREE.MathUtils.randFloat(minPosition.z, maxPosition.z)
        );

        group.add(ribosome);
    }
}