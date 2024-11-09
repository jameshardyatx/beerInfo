import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { PMREMGenerator } from 'three/src/extras/PMREMGenerator.js';
import { div } from 'three/webgpu';

function Object3D(props) {
    const canvasRef = useRef(null);
    const modelRef = useRef(null);
    const glassInitialX = -15;

  useEffect(() => {
    const scene = new THREE.Scene();
    // const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({alpha : true}, {antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio * 1.5 );

    // Set renderer size to match the window size
    // renderer.setSize(window.innerWidth, window.innerHeight);

    const currentCanvas = canvasRef.current;
    currentCanvas.appendChild(renderer.domElement);

    const sizeMultiplier = 0.4;
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

    const modelFilename = "./src/assets/" + props.glass;

    loader.load( modelFilename, function ( gltf ) {

        model = gltf.scene;
        scene.add( model );
        model.scale.set(20,20,20);

        const liquid = model.getObjectByName("liquid");
        const foam = model.getObjectByName("foam");
        liquid.morphTargetInfluences[0] = 1;
        foam.morphTargetInfluences[0] = 1;
        liquid.visible = false;
        foam.visible = false;

        //change color based on the beer
        //liquid.material.color.set(0xff0000);

        //z - left/right rotation
        //x - forward/back rotation
        //y - center rotation
        //model.position.set(0, -0.5, 0);
        model.position.set(glassInitialX, -0.5, 0);

        modelRef.current = model;
        
        
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x333333 });
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

        const almostEqual = (v1, v2, epsilon) => {
            if(epsilon == null) {
                epsilon = 0.01;
            }
            return Math.abs(v1 - v2) < epsilon;
        }

        const sineWave = (base, amplitude, time, frequency) => {
            return (
                base + amplitude * Math.sin(time * frequency)
            )
        }

        const cropCamera = (renderer, camera) => {
            // use renderSize
            let desiredSize = renderSize / 4;
            const currentSize = renderer.getSize(new THREE.Vector2());
            const x = (currentSize.x / 4) - (desiredSize / 4);
            const y = (currentSize.y / 2) - (desiredSize / 2);
            renderer.setSize(desiredSize, desiredSize, false);
            camera.setViewOffset(currentSize.x, currentSize.y, x, y, desiredSize, desiredSize);
        }

        //let time = 0;
        function animate() {
            // Constant central rotation
            //model.rotation.y -= 0.01;
            
            // Regulates the x and z rotation back to 0 gently
            if(almostEqual(model.rotation.x, 0)) {
                model.rotation.x = 0;
            } else if(model.rotation.x > 0) {
                    model.rotation.x -= 0.01;
            } else if (model.rotation.x < 0) {
                model.rotation.x += 0.01;
            }

            if(almostEqual(model.rotation.z, 0)) {
                model.rotation.z = 0;
            } else if(model.rotation.z > 0) {
                model.rotation.z -= 0.01;
            } else if (model.rotation.z < 0) {
                model.rotation.z += 0.01;
            }

            //cropCamera(renderer, camera);

            renderer.render(scene, camera);
        }

        renderer.setAnimationLoop(animate);

    }, undefined, function ( error ) {

        console.error( error );

    } );

    const handleResize = () => {
        renderSize = Math.floor(renderer.domElement.parentElement.parentElement.offsetWidth * sizeMultiplier);
        renderer.domElement.parentElement.style.width = `${renderSize}px`;
        renderer.domElement.parentElement.style.height = `${renderSize}px`;
        renderer.setSize(renderSize, renderSize);
        camera.updateProjectionMatrix();
    }

    window.addEventListener('resize', handleResize);

    let initialMouseX = 0;
    let initialMouseY = 0;
    let newMouseX = 0;
    let newMouseY = 0;

    const handleMouseMove = (event) => {
        newMouseX = event.clientX;
        newMouseY = event.clientY;
        if(newMouseX > initialMouseX && model.rotation.z < 0.5) {
            model.rotation.z += 0.02;
        } else if (newMouseX < initialMouseX && model.rotation.z > -0.5) {
            model.rotation.z -= 0.02;
        }

        if(newMouseY > initialMouseY && model.rotation.x < 0.5) {
            model.rotation.x += 0.02;
        } else if(newMouseY < initialMouseY && model.rotation.z > -0.5) {
            model.rotation.x -= 0.02;
        }

        initialMouseX = newMouseX;
        initialMouseY = newMouseY;
    }

    window.addEventListener("mousemove", handleMouseMove);

    const getSmoothedValue = (n, nMax = window.innerWidth) => {
        let normalizedN = Math.max(0, Math.min(1, n /nMax));

        return 0.5 * Math.sin(normalizedN * Math.PI / 2);
    }

    let clientX;
    let clientY;

    window.addEventListener("touchstart", (event) => {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
        console.log(clientX + " " + clientY);
    });

    window.addEventListener("touchend", (event) => {
        let deltaX;
        let deltaY;

        deltaX = event.changedTouches[0].clientX;
        deltaY = event.changedTouches[0].clientY;

        console.log("delta: " + deltaX + " " + deltaY)
        if(deltaX > clientX && model.rotation.z < 0.5) {
            model.rotation.z += getSmoothedValue(deltaX - clientX);
        } else if (deltaX < clientX && model.rotation.z > -0.5) {
            model.rotation.z -= getSmoothedValue(deltaX - clientX);
        }

        if(deltaY > clientY && model.rotation.x < 0.5) {
            model.rotation.x += getSmoothedValue(deltaY - clientY);
        } else if(deltaY < clientY && model.rotation.z > -0.5) {
            model.rotation.x -= getSmoothedValue(deltaY - clientY);
        }
    });


    // Cleanup on unmount
    return () => {
      renderer.setAnimationLoop(null); // Stop the animation loop
      currentCanvas.removeChild(renderer.domElement); // Remove the canvas
    };
  }, []);

useEffect(() => {
    let slideInFrameId;
    let animateLiquidFrameId;
    let animateFoamFrameId;

    const animateSlideIn = (model, duration = 250, target = 0) => {
        const startPosition = -10;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1); // Clamp progress to 1

            // Update position based on progress
            model.position.x = startPosition + progress * (target - startPosition);

            if (progress < 1) {
                slideInFrameId = requestAnimationFrame(animate);
            }
        };

        slideInFrameId = requestAnimationFrame(animate);
    };

    const fillGlass = (model, duration) => {
        
        const liquid = model.getObjectByName("liquid");
        const foam = model.getObjectByName("foam");
        liquid.visible = true;
        foam.visible = false;

        const raiseLiquid = () => {
            let startTime = performance.now();

            const animateLiquid = () => {
                let elapsed = performance.now() - startTime;
                let progress = Math.min(elapsed / duration, 1);
                liquid.morphTargetInfluences[0] = 1 - progress;

                if(progress < 1) {
                    animateLiquidFrameId = requestAnimationFrame(animateLiquid);
                } else {
                    foam.visible = true;
                    foam.morphTargetInfluences[0] = 1;
                    raiseFoam();
                }
            };
            animateLiquid();
        };

        const raiseFoam = () => {
            let startTime = performance.now();

            const animateFoam = () => {
                let elapsed = performance.now() - startTime;
                let progress = Math.min(elapsed / (duration / 2), 1);
                foam.morphTargetInfluences[0] = 1 - progress;
    
                if(progress < 1) {
                    animateFoamFrameId = requestAnimationFrame(animateFoam);
                }
            };

            animateFoam();
        }
        raiseLiquid();
    };

    if (modelRef.current) {
        if (props.visibility) {
            modelRef.current.position.x = glassInitialX;
            animateSlideIn(modelRef.current);
            fillGlass(modelRef.current, 1000);
        } else {
            cancelAnimationFrame(slideInFrameId);
            cancelAnimationFrame(animateLiquidFrameId);
            cancelAnimationFrame(animateFoamFrameId);

            modelRef.current.position.x = glassInitialX;
        }
    }

    return () => {
        cancelAnimationFrame(slideInFrameId);
        cancelAnimationFrame(animateLiquidFrameId);
        cancelAnimationFrame(animateFoamFrameId);
    } // Clean up on unmount
}, [props.visibility]);



  return (
    <>
        <div ref={canvasRef} className="canvasWrapper">
        </div>
    </>
  );
}

export default Object3D;
