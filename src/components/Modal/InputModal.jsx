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
                    <div className="overlay">
                        <div className="modal-input">
                            <div className="modal-header">
                                <div className="title">
                                    {props.modalType === "title" ? "Modifier le titre" : "Modifier le compteur"}
                                </div>
                            </div>

                            <div className="modal-body">
                                    <div className="shortcut-item">
                                        <span className="value">Modifier : </span><br/>

                                            <input onChange={(e) =>
                                                props.modalType === "title"
                                                    ? setTitleValue(e.target.value)
                                                    : setCountValue(parseInt(e.target.value.replace(/\D/g, ""), 10) || 0)}
                                                   className="capture-box input-modal"
                                                   placeholder={props.modalType === "count" ? countValue : titleValue}
                                                   type={props.modalType === "title" ? "text" : "number"}
                                            />
                                    </div>
                            </div>

                            <div className="modal-footer">
                                <button className="btn cancel" onClick={() => {props.onClose();}}>Annuler</button>

                                <button onClick={() => {
                                    props.modalType === "title"
                                        ? props.editTitle(titleValue)
                                        : props.editCount(countValue);
                                    props.onClose();
                                }} className="btn primary">Valider</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default InputModal;