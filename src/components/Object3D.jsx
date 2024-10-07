import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { PMREMGenerator } from 'three/src/extras/PMREMGenerator.js';

function Object3D() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Set up the scene, camera, and renderer
    const scene = new THREE.Scene();
    // const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({alpha : true});


    // Set renderer size to match the window size
    // renderer.setSize(window.innerWidth, window.innerHeight);

    // Append the renderer's canvas to the DOM element using ref
    const currentCanvas = canvasRef.current;
    currentCanvas.appendChild(renderer.domElement);

    const sizeMultiplier = 0.35;
    let renderSize = Math.floor(renderer.domElement.parentElement.parentElement.offsetWidth * sizeMultiplier);

    renderer.domElement.parentElement.style.width = `${renderSize}px`;
    renderer.domElement.parentElement.style.height = `${renderSize}px`;
    renderer.setSize(renderSize, renderSize);

    // Create a cube with geometry and material
    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);

    const loader = new GLTFLoader();
    const hdrLoader = new RGBELoader();

    let model;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    loader.load( './src/assets/scene.gltf', function ( gltf ) {

        model = gltf.scene;
        scene.add( model );
        model.scale.set(35,35,35);
        model.position.set(0,-0.5,0);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        cube.position.set(0, -1, 0);
        cube.scale.set(4, 1 ,4);

        new RGBELoader()
        .setPath('./src/assets/')
        .load('background.hdr', function (texture) {
            const envMap = pmremGenerator.fromEquirectangular(texture).texture;
            
            scene.environment = envMap;
            pmremGenerator.dispose();

            //scene.background = envMap;
        });

        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(5, 10, 7.5); // Set position of the light
        scene.add(directionalLight);

        // Set camera position
        camera.position.z = 5;
        camera.position.y = 2;

        // Animation loop
        function animate() {
            model.rotation.y += 0.01;
            renderer.render(scene, camera);
        }

        // Start the animation loop
        renderer.setAnimationLoop(animate);

    }, undefined, function ( error ) {

        console.error( error );

    } );

    const handleResize = () => {
        renderSize = Math.floor(renderer.domElement.parentElement.parentElement.offsetWidth * sizeMultiplier);
        console.log(renderer.domElement.parentElement.parentElement);
        renderer.domElement.parentElement.style.width = `${renderSize}px`;
        renderer.domElement.parentElement.style.height = `${renderSize}px`;
        renderer.setSize(renderSize, renderSize);
        camera.updateProjectionMatrix();
    }

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      renderer.setAnimationLoop(null); // Stop the animation loop
      currentCanvas.removeChild(renderer.domElement); // Remove the canvas
    };
  }, []);

  return (
    <div ref={canvasRef} className="canvasWrapper"></div>
  );
}

export default Object3D;
