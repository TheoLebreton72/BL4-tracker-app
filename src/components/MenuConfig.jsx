import React from 'react';
import { Menu, MenuItem, Submenu } from "@tauri-apps/api/menu";
import {useEffect, useRef, useState} from "react";
import Compteur from "./Compteur.jsx";
import RightClickMenu from "./RightClickMenu.jsx";

function MenuConfig(props) {
    const [title, setTitle] = React.useState("titre");


    const modifyTitle = () => {
        const saisieTitre = prompt("Modifier le titre", title);
        if (saisieTitre !== null && saisieTitre.length > 0) {
            setTitle(saisieTitre);
        } else {
            console.log("Modification annulée");
        }
    };

    const handleRightClick = RightClickMenu({onModifyTitle: modifyTitle});

    return (
        <div>
            <Compteur handleRightClick={handleRightClick} title={title} />
        </div>
    );
}

export default MenuConfig;