import React, {useEffect, useRef} from 'react';
import Compteur from "./Compteur.jsx";
import {Menu, MenuItem, Submenu} from "@tauri-apps/api/menu";

export default function RightClickMenu({ onEditTitle, onEditCount, onResetCount, onEditKeybind }) {
    const menuRef = useRef(null);

    useEffect(() => {
        async function createMenu() {

            const countMenu = await Submenu.new({
                text: "Compteur",
                items: [
                    await MenuItem.new({
                        id: 'edit_count',
                        text: 'Modifier le compteur',
                        action: () => {
                            onEditCount();
                        },
                    }),
                    await MenuItem.new({
                        id: 'reset_count',
                        text: 'Réinitialiser le compteur',
                        action: () => {
                            onResetCount();
                        },
                    }),
                ],
            });

            const menu = await Menu.new({
                items: [
                    {
                        id: "edit_title",
                        text: "Modifier le titre",
                        action: () => {
                            onEditTitle();
                        },
                    },
                    countMenu,
                    {
                        id: "keybind",
                        text: "Assigner des touches",
                        action: () => {
                           onEditKeybind();
                        }
                    }],
            });
            menuRef.current = menu;
        }

        createMenu();
    }, [onEditTitle, onEditCount, onResetCount, onEditKeybind]);

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