import React, {useEffect, useRef, useState} from "react";
import '../style/theme.css'
function Compteur(props) {



    return (
        <div className="container" onContextMenu={props.handleRightClick} >
            <h1 className="tracker-title">{props.title}</h1>
            <div className="count-text">Run: {props.count}</div>
        </div>
    );
}

export default Compteur;