
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
import React from "react";
import plantData from "../../data";

export default function HomePage (){
    const [plant , setPlant] = React.useState(plantData)
    return (
        <>
        <Header  number = {plant.length}/>
        <Main />
        <Footer />
        </>
    )
}