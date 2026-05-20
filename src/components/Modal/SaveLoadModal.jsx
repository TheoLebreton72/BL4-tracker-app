import React, {useEffect, useRef, useState} from 'react';
import '../../style/modal.css'
import {open as openMenu, save} from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs"
import {invoke} from "@tauri-apps/api/core";
import {toast, Toaster} from "sonner";

function SaveLoadModal(props) {

    //données du fichier chargé
    const [data, setData] = useState({});
    const [saveMessage, setSaveMessage] = useState("");
    const [loadMessage, setLoadMessage] = useState("");



    //permet de sélectionner un fichier sur le PC de l'utilisateur afin de le charger
    async function  openFile(){

        //ouverture du menu de sélection de fichier + récupération donnée fichier JSON
        const file = await openMenu({
            multiple: false,
            directory: false,
            filter: [{extensions: ['json']}]
        });

        // l'utilisateur annule
        if(!file) return;

        //permet de récupérer le nom du fichier
        // const fileName = file.split('/').pop().split('\\').pop();
        // setFileName(fileName);

        //lecture du fichier
        const content = await readTextFile(file);

        //conversion du contenu du fichier en format JSON
        const dataFile = JSON.parse(content);
        //stockage des données du fichier
        setData(dataFile);

        toast.success("Fichier chargé avec succès !");
        setLoadMessage("Fichier chargé !");
        setTimeout(() => setLoadMessage(""), 4000);

    }

    //permet de sauvegarder une configuration de compteur sur le PC de l'utilisateur
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

        // const fileName = path.split('/').pop().split('\\').pop();
        // setSavedFileName(fileName + ".json");

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

        toast.success("Fichier sauvegardé avec succès !");
        setSaveMessage("Fichier sauvegardé !");
        setTimeout(() => setSaveMessage(""), 4000);

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
                                            {loadMessage ? <span className="value">{loadMessage}</span> : <span className="hint">Appuyez…</span> }
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

                                            {saveMessage ? (<span className="value">{saveMessage}</span>) : <span className="hint">Appuyez…</span>}
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
                    <Toaster position="top-right" richColors />
                </>
            )}
        </>
    );
}

export default SaveLoadModal;