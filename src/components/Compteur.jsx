import React, {useEffect, useRef, useState} from "react";
import '../style/theme.css'
function Compteur(props) {

    const [count, setCount] = useState(0);

    return (
        <div className="container" onContextMenu={props.handleRightClick} >
            <h1 className="tracker-title">{props.title}</h1>
            <div className="count-text">Run: {count}</div>
            <button onClick={() => setCount(count > 0 ? count - 1 : 0)} className="count-button"> - </button>
            <button onClick={() => setCount(count + 1 )} className="count-button"> + </button>
        </div>
    );
}

export default Compteur;