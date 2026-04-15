import {useEffect, useRef, useState} from "react";
import '../../style/modal.css'

function InputModal(props) {

    const [titleValue, setTitleValue] = useState("Saisir un titre");
    const [countValue, setCountValue] = useState(0);

    useEffect(() => {
        if (props.modalType === "title"){
            setTitleValue(props.title);
        }else{
            setCountValue(props.count);
        }

    }, [props.modalType, props.title, props.count]);

    return (
        <>
            {props.modal && (
                <>
                    <div className="modal">
                        <div className="overlay"></div>
                        <div className="modal-content">
                            <input onChange={(e) =>
                                props.modalType === "title"
                                    ? setTitleValue(e.target.value)
                                    : setCountValue(parseInt(e.target.value.replace(/\D/g, ""), 10) || 0)}
                                   className="input-modal"
                                   value={props.modalType === "count" ? countValue : titleValue}
                            />

                            <div className="btn-container">
                                {/*Appel des fonctions de modification pour faire remonter les données au composant MenuConfig*/}
                                <button onClick={() => {
                                    props.modalType === "title"
                                        ? props.editTitle(titleValue)
                                        : props.editCount(countValue);
                                    props.onClose();
                                }} className="btn-modal">Valider</button>
                                <button onClick={() => {props.onClose()}} className="btn-modal">Annuler</button>
                            </div>

                        </div>
                    </div>

                </>

            )}
        </>
    );
}

export default InputModal;