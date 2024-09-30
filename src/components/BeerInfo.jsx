// import './BeerInfo.css'
import Object3D from './Object3D.jsx';


function BeerInfo(props) {
    return (
        <section id={props.title} className={`beerSection ${props.color}`}>
            
            {/* <img src={props.image} alt="" /> */}
            
            <Object3D />

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