import React, {useEffect, useRef, useState} from "react";
import '../style/theme.css'
function Compteur(props) {



    return (
        <div className="container" onContextMenu={props.handleRightClick} >
            <h1 className="tracker-title">{props.title}</h1>
            <div className="count-text">Run: {props.count}</div>
            <button onClick={() => props.setCount(props.count > 0 ? props.count - 1 : 0)} className="count-button"> - </button>
            <button onClick={() => props.setCount(props.count + 1 )} className="count-button"> + </button>
        </div>
    );
}

export default Compteur;