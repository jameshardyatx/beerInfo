// beerfacts.info?

// import { useState } from 'react'
// import './App.css'
import BeerInfo from './components/BeerInfo.jsx'
import Header from './components/Header.jsx'
import beerStock from './assets/beerStock.jpg'
// import * as THREE from 'three';

// history.scrollRestoration = "manual";

const beers = [
  {
    title: "Ales",
    text: [
      "Ales are a type of beer made with yeast that prefers room-temperature environments. The yeast sits at the top of the fermenting vessel, so ales are also known as “top-fermented” beers. This is the opposite of lagers, which prefer cold temperatures and sit on the bottom of the vessel. Ales include a wide arrange of colors, aromas, and flavors but tend to lie on the heavier and darker side of flavor profiles.",
    ],
    image: beerStock,
    color: "red",
  },
  {
    title: "Cream Ale",
    text: [
      "Cream Ale is very light in color and flavor, a refreshing style of ale similar to pale lagers. Cream ales are made to be appealing and easy to drink. They don’t actually contain any cream - the term is thought to be only a marketing gimmick.",
    ],
    image: beerStock,
    color: "blue",
  },
  {
    title: "Pale Ale",
    text: [
      "Pale Ales are, like the name implies, a pale golden or amber color made with a pale malt. They are similar to Pilsners, but made with ale yeast and fermented at warm temperatures. They are made to be appealing and easy to drink like other light colored beers, but tend to feature bitter and hoppy flavors. There are several distinct varieties of pale ale including British-style, Belgian-style, American Pale Ale (APA), and Indian Pale Ale (IPA).",
      "British-style ales les tend to be lighter in flavor and bitterness than other varieties with mild floral, woody, and fruity flavors.",
      "Belgian-style pale ales are similarly light and mildly bitter like the British-style pale ales, but tend to have more caramel and malt flavors.",
      "American Pale Ales have a more intense flavor profile than their European cousins. They are more bitter, and they feature bold spicey and fruity flavors. They are also darker in color than other styles of pale ale.",
      "Indian Pale Ales tend to be the most bitter and intense in flavor of all styles of pale ale. This style of beer is extremely popular in in the US craft beer market. American IPAs focus on hops to drive their flavor profile and have strong floral and fruity notes. Double, triple, or quadruple IPAs push the hops profile even further",
    ],
    image: beerStock,
    color: "yellow",
  },
  {
    title: "Lagers",
    text: [
      "Lagers and ales can be differentiated by the type of yeast they use. Lagers use yeast that prefers the cold, as opposed to ales which are fermented at room temperature. Lager yeast sits on the bottom of the brewing vessel while fermenting. They are also known as “bottom-fermented” beers because of this. Lagers tend to be refreshing and thirst quenching, but lagers with darker flavors exist as well.",
    ],
    image: beerStock,
    color: "red",
  },
  {
    title: "Pale Lager",
    text: [
      "Pale Lagers are crisp and light and a pale gold in color. They are dry and grainy, having low bitterness and light spicy, floral, and earthy aromas."
    ],
    image: beerStock,
    color: "blue",
  },
  {
    title: "Pilsner",
    text: [
      "Pilsners are a type of pale lager, and have a similar light gold color and crispness. Pilsners have a more heavy hop profile than pale lagers, as well as a heavier spice notes. They are named “pilsner” after the pilsner malt use in their brewing.",
    ],
    image: beerStock,
    color: "yellow",
  },
  {
    title: "Red Lager",
    text: [
      "Red lager (or amber lager) is made with toasted malted barley, giving the lager a reddish hue. Red lagers are light and crisp like pale lagers but also contain notes of caramel, toffee, and toast due to the toasted barley.",
    ],
    image: beerStock,
    color: "red",
  },
  {
    title: "Dark Lager",
    text: [
      "Dark lagers (or black lagers) are dark brown in hue. Most dark beers, like porters or stouts, are in the ale family, but this one is an exception. Dark Lagers are made with the same yeast as other lagers, but use roasted malts that give it its unique color and flavor profile. Dark lagers have tasting notes of malt, chocolate, coffee, toast, and caramel.",
    ],
    image: beerStock,
    color: "blue",
  },
  {
    title: "Kölsch",
    text: [
      "Kölsch beers are a hybrid between ale and lager styles. They are fermented using ale yeast at room temperature, but then finished in a cold environment like a lager.",
    ],
    image: beerStock,
    color: "blue",
  },
]

// let beerPositions = [];
// document.addEventListener("DOMContentLoaded", function() {
//   let sections = document.getElementsByTagName("section");
//   for (let i = 0; i < sections.length; i++) {
//     beerPositions.push( sections[i].getBoundingClientRect().top | 0 );
//   }
//   console.log(beerPositions)
// });

// let currentPosition = 0;
// const nextBeer = () => {
//   window.scroll(0, beerPositions[currentPosition]);
//   currentPosition = (currentPosition + 1) % beerPositions.length;
// }

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    <Header />
      {beers.map((beers, index) => (
        <BeerInfo 
        key={index}
        title={beers.title}
        text={beers.text}
        image={beers.image}
        color={beers.color}
        />
      )
      )}
    {/* <div id="jumper" className="noselect" onClick={nextBeer}>⬇️</div> */}
    </>
  );
}

export default App
