import React from 'react';
import { Menu, MenuItem, Submenu } from "@tauri-apps/api/menu";
import {useEffect, useRef, useState} from "react";
import Compteur from "./Compteur.jsx";
import RightClickMenu from "./RightClickMenu.jsx";
import InputModal from "./Modal/InputModal.jsx";

function MenuConfig(props) {
    const [title, setTitle] = useState("Saisir un titre");
    const [count, setCount] = useState(0);
    const [inputModal, setInputModal] = useState(false);
    const [modalType, setModalType] = useState("");


    //fermer la modal
    const closeModal = () => {
        setInputModal(false);
    }

    // permet d'ouvrir le champs de modification du titre
    const openEditTitle = () => {
        setModalType("title");
        setInputModal(true);
    }

    // permet d'ouvrir le champs de modification du compteur
    const openEditCount = () => {
        setModalType("count");
        setInputModal(true);
    }

    //modifier le titre
    const editTitle = (titre) => {
        setTitle(titre);
    };

    //modifier la valeur du compteur
    const editCount = (compteur) => {
        setCount(compteur);
    };

    //réinitialiser le compteur
    const resetCount = () => setCount(0);

    const handleRightClick = RightClickMenu({
        onEditTitle: openEditTitle,
        onEditCount: openEditCount,
        onResetCount: resetCount,
    });

    return (
        <div>
            <Compteur handleRightClick={handleRightClick} title={title} count={count} setCount={setCount} />
            <InputModal
                modal={inputModal}
                onClose={closeModal}
                modalType={modalType}
                editTitle={editTitle}
                editCount={editCount}
                title={title}
                count={count} />
        </div>
    );
}

export default MenuConfig;