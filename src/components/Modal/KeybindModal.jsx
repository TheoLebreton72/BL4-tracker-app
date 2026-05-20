import React, {useEffect, useRef, useState} from "react";
import { invoke } from "@tauri-apps/api/core";
import {toast, Toaster} from "sonner";
import '../../style/modal.css'

function KeybindModal(props) {

    // Définir les touches initiales, elles sont définit au chargement de l'application
    const [decrementInitial, setDecrementInitial] = useState(null);
    const [incrementInitial, setIncrementInitial] = useState(null);

    // Définir les touches mise a jour
    const [decrementBindUpdate, setDecrementBindUpdate] = useState(null);
    const [incrementBindUpdate, setIncrementBindUpdate] = useState(null);



    const inputDecrementRef = useRef(null);
    const inputIncrementRef = useRef(null);


    async function updateKeybind() {
        try {
            // Récupère les touches actuelles
            const [currentIncrement, currentDecrement] = await invoke('get_keybinds');

            // Si l'utilisateur n'a pas changé une touche, on garde l'actuelle
            const finalIncrement = incrementBindUpdate ?? currentIncrement;
            const finalDecrement = decrementBindUpdate ?? currentDecrement;

            await invoke('update_keybind', {
                decrementKeybind: finalDecrement,
                incrementKeybind: finalIncrement
            });

            setDecrementInitial(finalDecrement);
            setIncrementInitial(finalIncrement);
            toast.success("Les touches ont été modifiées avec succès !");
        } catch (error) {
            console.error('Erreur :', error);
        }
    }

    // va permettre de charger les touches actuelles
    function loadCurrentKeybinds() {
        invoke('get_keybinds').then(([increment, decrement]) => {
            setDecrementInitial(decrement);
            setIncrementInitial(increment);
        });
    }

    useEffect(() => {
        loadCurrentKeybinds();
    }, [])


    return (
        <>
            {props.modal && (
                <>
                    <div className="overlay">
                        <div className="modal">
                            <div className="modal-header">
                                <div className="title">
                                    <span className="icon">⌨️</span>
                                    Raccourci clavier
                                </div>
                            </div>

                            <div className="modal-body">
                                <div className="shortcut-grid">

                                    {/* Décrément */}
                                    <div className="shortcut-item">
                                        <span className="value">Décrémenter</span>

                                        <div
                                            className="capture-box"
                                            onClick={() => inputDecrementRef.current.focus()}
                                        >
                                            <input
                                                ref={inputDecrementRef}
                                                type="text"
                                                autoComplete="off"
                                                onKeyDown={(e) => {
                                                    e.preventDefault();
                                                    let key = e.key.toLowerCase();
                                                    key = key.replace("arrow", "");
                                                    setDecrementBindUpdate(key);
                                                }}
                                            />

                                            <span className="hint">Appuyez…</span>
                                            <div className="key">
                                                {decrementBindUpdate ? decrementBindUpdate.toUpperCase() : "?" }
                                            </div>
                                        </div>

                                        <span className="label">Actuelle</span>
                                        <div className="key-small">
                                            {decrementInitial.toUpperCase()}
                                        </div>
                                    </div>

                                    {/* Incrément */}
                                    <div className="shortcut-item">
                                        <span className="value">Incrémenter</span>

                                        <div
                                            className="capture-box"
                                            onClick={() => inputIncrementRef.current.focus()}
                                        >
                                            <input
                                                ref={inputIncrementRef}
                                                type="text"
                                                autoComplete="off"
                                                onKeyDown={(e) => {
                                                    e.preventDefault();
                                                    let key = e.key.toLowerCase();
                                                    key = key.replace("arrow", "");
                                                    setIncrementBindUpdate(key);
                                                }}
                                            />

                                            <span className="hint">Appuyez…</span>
                                            <div className="key">
                                                {incrementBindUpdate ? incrementBindUpdate.toUpperCase() : "?" }
                                            </div>
                                        </div>

                                        <span className="label">Actuelle</span>
                                        <div className="key-small">
                                            {incrementInitial.toUpperCase()}
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn cancel"
                                    onClick={() => {
                                        loadCurrentKeybinds();
                                        props.onClose("keybind");
                                    }}
                                >
                                    Annuler
                                </button>

                                <button
                                    className="btn primary"
                                    onClick={() => {
                                        updateKeybind().then();
                                        props.onClose("keybind");
                                    }}
                                >
                                    Valider
                                </button>
                            </div>
                        </div>
                    </div>
                    <Toaster position="top-right" richColors />
                </>
            )}
        </>
    );
}

export default KeybindModal;