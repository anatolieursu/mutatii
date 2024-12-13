import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

let group, camera, scene, renderer, ngroup, hollowCell;

const Cell_Radius = 10;

export let data = {
    mitocondrii: {
        n: 100
    },
    membrana:{
        grosime: 1
    },
    lizozomi: {
        n: 100
    },
    ribozomi: {
        n: 1000
    },
    ag: {
        numCisterne: 5
    },
    re: {
        radius: 0.3
    }
}

let geometries = {};
init();



export function init() {


    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );
    document.body.appendChild( renderer.domElement );

    // camera

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 15, 20, 30 );
    scene.add( camera );

    // controls

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 20;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2;

    // ambient light

    scene.add( new THREE.AmbientLight( 0x666666 ) );

    // point light

    const light = new THREE.PointLight( 0xffffff, 3, 0, 0 );
    camera.add( light );

    // helper


    // textures

    const loader = new THREE.TextureLoader();
    const texture = loader.load( 'textures/sprites/disc.png' );
    texture.colorSpace = THREE.SRGBColorSpace;

    group = new THREE.Group();
    scene.add( group );

    // points


    let the_cell = new THREE.SphereGeometry(Cell_Radius);

    the_cell.userData = the_cell.userData || {};  // Creează un obiect userData, dacă nu există
    the_cell.userData.id = "the_cell";
    geometries["the_cell"] = the_cell;
    // if normal and uv attributes are not removed, mergeVertices() can't consolidate indentical vertices with different normal/uv data

    the_cell.deleteAttribute( 'normal' );
    the_cell.deleteAttribute( 'uv' );

    the_cell = BufferGeometryUtils.mergeVertices( the_cell );

    const vertices = [];
    const positionAttribute = the_cell.getAttribute( 'position' );

    for ( let i = 0; i < positionAttribute.count; i ++ ) {

        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute( positionAttribute, i );
        vertices.push( vertex );

    }

    const pointsMaterial = new THREE.PointsMaterial( {
        color: 0x0af3ff,
        map: texture,
        size: 1,
        alphaTest: 0.5
    } );

    const pointsGeometry = new THREE.BufferGeometry().setFromPoints( vertices );

    const points = new THREE.Points( pointsGeometry, pointsMaterial );
    group.add( points );

    // convex hull

    const meshMaterial = new THREE.MeshLambertMaterial( {
        color: 0xffffff,
        opacity: 0.4,
        side: THREE.DoubleSide,
        transparent: true
    } );

    const meshGeometry = new ConvexGeometry( vertices );

    const mesh = new THREE.Mesh( meshGeometry, meshMaterial );
    group.add( mesh );
    //ngroup.add(mesh);



    basic_cell()



    window.addEventListener( 'resize', onWindowResize );

}
export function basic_cell(){

    let CellR = Cell_Radius - data.membrana.grosime;
    const cellMaterial = new THREE.MeshLambertMaterial({ color: 0x00aaff, opacity: 0.4, transparent: true });
    hollowCell = createHollowSphere(Cell_Radius, data.membrana.grosime, cellMaterial);

    hollowCell.position.set(0, 0, 0);
    group.add(hollowCell);


    ngroup = new THREE.Group();
    scene.add(ngroup)



    ngroup.children.forEach((child) => {
        const distance = child.position.distanceTo(new THREE.Vector3(0, 0, 0));
        child.visible = distance <= Cell_Radius - data.membrana.grosime; // Vizibil doar în interiorul sferei
    });


    // Mitocondrii
    for(let i = 0; i<data.mitocondrii.n; i++){

        const limitCell = Cell_Radius-data.membrana.grosime-0.5;
        let y = getRandomFloat(-limitCell, limitCell);

        const l = Math.sqrt(CellR*CellR - y*y)-3;
        let x = getRandomFloat(-l, l);
        let z = getRandomFloat(-l, l);

        ngroup.add(createMitochondrion(x,y,z));
    }

    const reticulum = createEndoplasmicReticulum();
    reticulum.position.set(0, 0, 0);
    ngroup.add(reticulum);

    const golgiApparatus = createGolgiApparatus();
    golgiApparatus.position.set(-5, 0, -1);
    ngroup.add(golgiApparatus);

    createRibosomes(ngroup, data.ribozomi.n, { x: -5, y: -7, z: -5 }, { x: 7, y: 7, z: 5 });
    createLysosomes(ngroup, data.lizozomi.n, { x: -5, y: -7, z: -5 }, { x: 5, y: 7, z: 5 });


    // nucleu
    ngroup.add(createNucleus())
}
function createLysosomes(group, count, minPosition, maxPosition) {
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
function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function createNucleus() {
    const nucleusGeometry = new THREE.SphereGeometry(3);
    const nucleusMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000, opacity: 0.5 });
    return new THREE.Mesh(nucleusGeometry, nucleusMaterial);
}
function createMitochondrion(x, y, z, color = 0xffa500) {
    const mitochondrionGeometry = new THREE.SphereGeometry(0.1, 10, 10);
    const mitochondrionMaterial = new THREE.MeshLambertMaterial({ color: 0xffa500 });

    const mitochondrion = new THREE.Mesh(mitochondrionGeometry, mitochondrionMaterial);

    mitochondrion.scale.set(1, 1, 2);

    mitochondrion.position.set(x, y, z);

    return mitochondrion;
}
function createEndoplasmicReticulum() {
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

function createGolgiApparatus() {
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

function createRibosomes(group, count, minPosition, maxPosition) {
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

function createHollowSphere(radius, thickness, material) {
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



function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    group.rotation.y += 0.005;
    if (ngroup) {
        ngroup.rotation.y += 0.005
    }

    renderer.render(scene, camera);
}


export function deleteCell() {
    console.log(geometries)

    group.remove(hollowCell)
    scene.remove(ngroup)

}
function getGeometryByID(id) {
    return geometries[id] || null;
}