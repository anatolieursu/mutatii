import * as THREE from "three";

export function createLysosomes(group, count, minPosition, maxPosition) {
    const lysosomeGeometry = new THREE.SphereGeometry(0.2, 16, 16); // Lizozomi mai mari decât ribozomii
    const lysosomeMaterial = new THREE.MeshLambertMaterial({ color: 0xffcc00 });

    for (let i = 0; i < count; i++) {
        const lysosome = new THREE.Mesh(lysosomeGeometry, lysosomeMaterial);

        // Setează o poziție aleatorie pentru fiecare lizozom
        lysosome.position.set(
            THREE.MathUtils.randFloat(minPosition.x, maxPosition.x),
            THREE.MathUtils.randFloat(minPosition.y, maxPosition.y),
            THREE.MathUtils.randFloat(minPosition.z, maxPosition.z)
        );

        // Adaugă lizozomul la grupul principal
        group.add(lysosome);
    }
}