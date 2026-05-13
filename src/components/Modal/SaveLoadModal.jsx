import React, {useEffect, useRef, useState} from 'react';
import '../../style/modal.css'
import {open as openMenu, save} from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs"
import {invoke} from "@tauri-apps/api/core";

function SaveLoadModal(props) {

    const [data, setData] = useState({});
    //nom du fichier chargé
    const [fileName, setFileName] = useState("");
    //nom du fichier sauvegardé
    const [savedFileName, setSavedFileName] = useState("");


    async function  openFile(){

        //ouverture du menu de sélection de fichier + récupération donnée fichier JSON
        const file = await openMenu({
            multiple: false,
            directory: false,
            filter: [{extensions: ['json']}]
        });

        // l'utilisateur annule
        if(!file) return;

        const fileName = file.split('/').pop().split('\\').pop();
        setFileName(fileName);

        //lecture du fichier
        const content = await readTextFile(file);

        //conversion du contenu du fichier en format JSON
        const dataFile = JSON.parse(content);
        //stockage des données du fichier
        setData(dataFile);

    }


    async function saveFile(title, count){

        //récupération des bind actuels
        const [increment, decrement] = await invoke('get_keybinds');

        //ouverture du menu de sélection d'emplacement de sauvegarde
        const path = await save({
            filter: [{
                name: "Sauvegarde compteur",
                extensions: ['json']
            }]
        });

        if(!path) return;

        const fileName = path.split('/').pop().split('\\').pop();
        setSavedFileName(fileName + ".json");

        //permet d'ajouter l'extension .json a la fin du nom de fichier si l'utilisateur oublie de le spécifier
        const finalPath = path.endsWith('.json') ? path : path + '.json';

        //écriture des données dans le fichier
        await writeTextFile(finalPath, JSON.stringify({
            title: title,
            count: count,
            binds: {
                decrement: decrement,
                increment: increment
            }}))

    }



    //charger les données
    async function loadData(){

        //si on a des données alors on les charge a l'appli
        if(Object.values(data).length > 0){
            props.setTitle(data.title);
            props.setCount(data.count);
            await invoke('update_keybind', { decrementKeybind: data.binds.decrement, incrementKeybind: data.binds.increment });
        //sinon on remet les valeur par défaut
        }else{
            props.setTitle(props.title);
            props.setCount(props.count);
        }
    }



    return (
        <>
            {props.modal && (
                <>
                    <div className="overlay">
                        <div className="modal">
                            <div className="modal-header">
                                <div className="title">
                                    Sélection de fichier
                                </div>
                            </div>

                            <div className="modal-body">
                                <div className="shortcut-grid">

                                    <div className="shortcut-item">
                                        <span className="value">Charger un fichier</span>

                                        <div
                                            className="capture-box"
                                            onClick={() => openFile()}
                                        >
                                            {fileName ? (<span className="value">{fileName}</span>) : <span className="hint">Appuyez…</span>}
                                        </div>

                                    </div>

                                    <div className="shortcut-item">
                                        <span className="value">Sauvegarder un fichier</span>

                                        <div
                                            className="capture-box"
                                            onClick={ () =>  {
                                                 saveFile(props.title, props.count);
                                            }}
                                        >

                                            {savedFileName ? (<span className="value">{savedFileName}</span>) : <span className="hint">Appuyez…</span>}
                                        </div>

                                    </div>

                                </div>
                            </div>

                            <div className="modal-footer">
                                <button className="btn cancel" onClick={() => {
                                        props.onClose("SaveLoad");
                                    }}>
                                    Annuler
                                </button>

                                <button
                                    className="btn primary"
                                    onClick={async () => {
                                        await loadData();
                                        props.onClose("SaveLoad");
                                    }}
                                >
                                    Valider
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default SaveLoadModal;