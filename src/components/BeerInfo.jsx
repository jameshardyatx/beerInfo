// import './BeerInfo.css'
import Object3D from './Object3D.jsx';
import React, {useRef, useEffect, useState} from "react";


const useElementOnScreen = (options) => {
    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    const callback = (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
    }



useEffect(() => {
    const observer = new IntersectionObserver(callback, options);
    if (containerRef.current) {
        observer.observe(containerRef.current);
    }
    
    return () => {
      if(containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    }
  }, [containerRef, options]);

  return [containerRef, isVisible]
}


function BeerInfo(props) {

    // const fadeOut = (event) => {
    //     const element = event.target;
    //     element.classList.add("fadeIn");
    // }

    const [containerRef, isVisible] = useElementOnScreen({
        root: null,
        rootMargin: "0px",
        threshold: 0.5
    });

        return (
        <section id={props.title} className={`beerSection ${props.color}`} ref={containerRef}>
            
            {/* <img src={props.image} alt="" /> */}
            
            <Object3D />
            <div className={(isVisible ? "isVisible" : "invisible") + " textWrapper"}>
                <h2>{props.title}</h2>
                {props.text.map((text, index) => (
                    <p key={index}>{text}</p>
                ))}
            </div>

        </section>
    );
}

export default BeerInfo