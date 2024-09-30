import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

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

    let renderSize = Math.floor(renderer.domElement.parentElement.parentElement.offsetWidth * .25);

    renderer.domElement.parentElement.style.width = `${renderSize}px`;
    renderer.domElement.parentElement.style.height = `${renderSize}px`;
    renderer.setSize(renderSize, renderSize);

    // Create a cube with geometry and material
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Set camera position
    camera.position.z = 5;

    // Animation variables
    let increasing = true;

    // Animation loop
    function animate() {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      // Adjust cube scaling
      if (increasing) {
        cube.scale.x += 0.01;
        cube.scale.y += 0.01;
        cube.scale.z += 0.01;
      } else {
        cube.scale.x -= 0.01;
        cube.scale.y -= 0.01;
        cube.scale.z -= 0.01;
      }

      if (cube.scale.x > 1.5) increasing = false;
      if (cube.scale.x < 0.5) increasing = true;

      renderer.render(scene, camera);
    }

    // Start the animation loop
    renderer.setAnimationLoop(animate);

    const handleResize = () => {
        renderSize = Math.floor(renderer.domElement.parentElement.parentElement.offsetWidth * .25);
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
