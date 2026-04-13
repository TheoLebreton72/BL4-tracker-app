import React, {useEffect, useRef} from 'react';
import Compteur from "./Compteur.jsx";
import {Menu} from "@tauri-apps/api/menu";

export default function RightClickMenu({ onModifyTitle }) {
    const menuRef = useRef(null);

    useEffect(() => {
        async function createMenu() {
            const menu = await Menu.new({
                items: [
                    {
                        id: "modif_title",
                        text: "Modifier le titre",
                        action: () => {
                            onModifyTitle();
                        },
                    },
                ],
            });
            menuRef.current = menu;
        }

        createMenu();
    }, [onModifyTitle]);

    const handleRightClick = async (event) => {
        event.preventDefault();
        if (!menuRef.current) return;

        await menuRef.current.popup("", {
            x: event.clientX,
            y: event.clientY,
        });
    };

    return handleRightClick;
}