from pynput import keyboard

# va indiquer quelle touche a été pressée afin de modifier la valeur du compteur.
def on_press(key):
    try:
        if key.char == '+':
            print("increment", flush=True)
        elif key.char == '-':
            print("decrement", flush=True)

    except AttributeError:
        if key == keyboard.Key.esc:

            return False

with keyboard.Listener(on_press=on_press) as listener:
    listener.join()


