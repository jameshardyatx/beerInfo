import './BeerInfo.css'
// import * as THREE from 'three';
// import { div } from 'three/webgpu';

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.addEventListener("DOMContentLoaded", function() {
//   document.getElementById("root").appendChild(renderer.domElement);
// });

// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

// camera.position.z = 5;

// let increasing = true;

// function animate() {
//   cube.rotation.x += 0.01;
//   cube.rotation.y += 0.01;
  

//   if (increasing) {
//     cube.scale.x += .01;
//     cube.scale.y += .01;
//     cube.scale.z += .01;
//   } else {
//     cube.scale.x -= .01;
//     cube.scale.y -= .01;
//     cube.scale.z -= .01;
//   }

//   if(cube.scale.x > 1.5) {
//     increasing = false;
//   }
//   if(cube.scale.x < .5) {
//     increasing = true;
//   }

//   // console.log(cube.scale.x)
  
// 	renderer.render( scene, camera );
// }
// renderer.setAnimationLoop( animate );


function BeerInfo(props) {
    return (
        <section id={props.title} className={`beerSection ${props.color}`}>
            <img src={props.image} alt="" />
            <div className="textWrapper">
                <h2>{props.title}</h2>
                {props.text.map((text, index) => (
                    <p key={index}>{text}</p>
                ))}
            </div>
        </section>
    );
}

export default BeerInfo