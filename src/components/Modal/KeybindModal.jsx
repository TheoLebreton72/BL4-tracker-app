import {useEffect, useRef, useState} from "react";
import { invoke } from "@tauri-apps/api/core";
import '../../style/modal.css'

function KeybindModal(props) {


    const [decrementBind, setDecrementBind] = useState("-");
    const [incrementBind, setIncrementBind] = useState("+");



    async function updateKeybind() {
        try {
            const update = await invoke('update_keybind', { decrementKeybind: decrementBind, incrementKeybind: incrementBind });
            console.log(update);
        } catch (error) {
            console.error('Erreur :', error);
        }
    }

    // va permettre de charger les touches actuelles et non les touches par défaut.
    function loadCurrentKeybinds() {
        invoke('get_keybinds').then(([increment, decrement]) => {
            setDecrementBind(decrement);
            setIncrementBind(increment);
        });
    }

    useEffect(() => {
        loadCurrentKeybinds();
    }, [])


    return (
        <>
            {props.modal && (
                <>
                    <div className="modal">
                        <div className="overlay"></div>
                        <div className="modal-content">
                            Décrémenter
                            <input
                                className="input-modal"
                                id="decrement-input"
                                value={decrementBind.toUpperCase()}
                                onKeyDown={(e) => {
                                    e.preventDefault();
                                    // passage en lower case des touches pour que les touches spéciales (F1,F2, delete...) soient compatible avec key.name du coté python.
                                    let key = e.key.toLowerCase();
                                    key = key.replace("arrow",""); // pour les fleches on retire le "arrow" pour que ce soit compatible avec key.name coté python
                                    setDecrementBind(key);
                                }}
                            />

                            Incrémenter
                            <input
                                className="input-modal padding-input"
                                id="increment-input"
                                value={incrementBind.toUpperCase()}
                                onKeyDown={(e) => {
                                    e.preventDefault();
                                    let key = e.key.toLowerCase();
                                    key = key.replace("arrow","");
                                    setIncrementBind(key);
                                }}  />

                            <div className="btn-container">
                                <button  className="btn-modal" onClick={() => {
                                    updateKeybind().then();
                                    props.onClose("keybind");
                                }}  >Valider</button>
                                <button onClick={() => {
                                     loadCurrentKeybinds();
                                    props.onClose("keybind");
                                }} className="btn-modal">Annuler</button>
                            </div>

                        </div>
                    </div>

                </>

            )}
        </>
    );
}

export default KeybindModal;