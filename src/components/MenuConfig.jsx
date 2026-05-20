import { Menu, MenuItem, Submenu } from "@tauri-apps/api/menu";
import {listen} from "@tauri-apps/api/event";
import React, {useEffect, useRef, useState} from "react";
import Compteur from "./Compteur.jsx";
import RightClickMenu from "./RightClickMenu.jsx";
import InputModal from "./Modal/InputModal.jsx";
import KeybindModal from "./Modal/KeybindModal.jsx";
import SaveLoadModal from "./Modal/SaveLoadModal.jsx";
import {toast, Toaster} from "sonner";

function MenuConfig(props) {
    const [title, setTitle] = useState("Saisir un titre");
    const [count, setCount] = useState(0);
    const [inputModal, setInputModal] = useState(false);
    const [keybindModal, setKeybindModal] = useState(false);
    const [saveLoadModal, setSaveLoadModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    //fermer la modal
    const closeModal = (modalType) => {
        if (modalType === "keybind") {
            setKeybindModal(false);
        }else if (modalType === "SaveLoad") {
           setSaveLoadModal(false);
        }else{
            setInputModal(false);
        }
        setIsModalOpen(false);
    }

    // permet d'ouvrir le champs de modification du titre
    const openEditTitle = () => {
        setModalType("title");
        setInputModal(true);
        setIsModalOpen(true);
    }

    // permet d'ouvrir le champs de modification du compteur
    const openEditCount = () => {
        setModalType("count");
        setInputModal(true);
        setIsModalOpen(true);
    }

    const openEditKeybind = () => {
        setModalType("keybind");
        setKeybindModal(true);

    }

    // ouvrir la modal qui permet de charger/sauvegarder un fichier
    const openSaveLoadModal = () => {
        setModalType("SaveLoad");
        setSaveLoadModal(true);
    }

    //modifier le titre
    const editTitle = (titre) => {
        setTitle(titre);
        toast.success("Titre modifié avec succès !")
    };

    //modifier la valeur du compteur
    const editCount = (compteur) => {
        setCount(compteur);
        toast.success("Valeur du compteur modifiée avec succès !")
    };

    //réinitialiser le compteur
    const resetCount = () => setCount(0);

    const handleRightClick = RightClickMenu({
        onEditTitle: openEditTitle,
        onEditCount: openEditCount,
        onResetCount: resetCount,
        onEditKeybind: openEditKeybind,
        onSaveLoadFile: openSaveLoadModal
    });

    useEffect(() => {

        if(isModalOpen) return;
            //écoute des event du script python

            const eventIncrement = listen("counter-increment", () =>{
                setCount(c => c + 1);
            });

            const eventDecrement = listen("counter-decrement", () =>{
                setCount(c => c > 0 ? c - 1 : 0);
            });

            return () => {
                eventIncrement.then(fn => fn());
                eventDecrement.then(fn => fn());
            }

    }, [isModalOpen]);

    //désactiver les touches d'actualisation
    useEffect(() => {
        const disableRefresh = (e) => {
            if (e.key === "F5" || (e.ctrlKey && e.key === "r")) {
                e.preventDefault();
            }
        };

        const disableContextMenu = (e) => {
            e.preventDefault();
        };

        window.addEventListener("keydown", disableRefresh);
        window.addEventListener("contextmenu", disableContextMenu);

        return () => {
            window.removeEventListener("keydown", disableRefresh);
            window.removeEventListener("contextmenu", disableContextMenu);
        };
    }, []);

    return (
        <div>
            <Compteur handleRightClick={handleRightClick} title={title} count={count}/>
            <InputModal
                modal={inputModal}
                onClose={closeModal}
                modalType={modalType}
                editTitle={editTitle}
                editCount={editCount}
                title={title}
                count={count} />
            <KeybindModal modal={keybindModal} onClose={closeModal} modalType={modalType} />
            <SaveLoadModal modal={saveLoadModal} onClose={closeModal} modalType={modalType} title={title} count={count} setTitle={setTitle} setCount={setCount} />
            <Toaster position="top-right" richColors />
        </div>
    );
}

export default MenuConfig;