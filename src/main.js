import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import {createLysosomes} from "./components/lizozomi";
import {createMitochondrion} from "./components/mitocondria";
import {createNucleus} from "./components/nucleus";
import {createEndoplasmicReticulum} from "./components/endoplasmatic_reticulum";
import {createGolgiApparatus} from "./components/ag";
import {createRibosomes} from "./components/ribosomes";
import {createHollowSphere} from "./components/hollow_sphere";

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

    scene.add( new THREE.AmbientLight( 0xFFFF00 ) );

    // point light

    const light = new THREE.PointLight( 0xffffff, 2.5, 0, 0 );
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

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
    group.rotation.y += 0.005;
    if (ngroup) {
        ngroup.rotation.y += 0.005;

        const center = new THREE.Vector3(0, 0, 0);
        const radius = Cell_Radius - data.membrana.grosime;

        ngroup.children.forEach((child) => {
            child.visible = isInsideSphere(child, center, radius);
        });
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

function isInsideSphere(object, center, radius) {
    const distance = object.position.distanceTo(center);
    return distance <= radius;
}
