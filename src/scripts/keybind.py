from pynput import keyboard
import sys

# Lire les touches passées en argument, sinon valeurs par défaut
increment_key = sys.argv[1] if len(sys.argv) > 1 else "+"
decrement_key = sys.argv[2] if len(sys.argv) > 2 else "-"

def get_key_name(key):

    # permet de prendre en compte le pavé numérique
    if hasattr(key, 'vk') and key.vk is not None:
        if 96 <= key.vk <= 105:
            return str(key.vk - 96)  # retourne "0" à "9"
    try:
        return key.char # pour une touche normale on retourne le caractère correspondant
    except AttributeError:
        return key.name # pour une touche spéciale comme F1, F2 ou Delete, on retourne le nom de la touche

def on_press(key):
        key_name = get_key_name(key)
        if key_name == increment_key:
            print("increment", flush=True)
        elif key_name == decrement_key:
            print("decrement", flush=True)


with keyboard.Listener(on_press=on_press) as listener:
    listener.join()