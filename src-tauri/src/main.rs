#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::io::{BufRead, BufReader};
use std::process::{Child, Command, Stdio};
use std::thread;
use std::sync::Mutex;
use tauri::Emitter;
use tauri::Manager;
use tauri::State;
use std::os::windows::process::CommandExt;

struct PythonProcess(Mutex<Option<Child>>);
struct CurrentKeybinds(Mutex<(String, String)>);

#[tauri::command]
fn update_keybind(
    increment_keybind: String,
    decrement_keybind: String,
    state: State<PythonProcess>,
    keybinds: State<CurrentKeybinds>,
    app_handle: tauri::AppHandle,
) {
    let resource_path = std::env::current_exe()
                    .unwrap()
                    .parent()
                    .unwrap()
                    .join("keybind.exe");

    let mut current = keybinds.0.lock().unwrap();
    *current = (increment_keybind.clone(), decrement_keybind.clone());
    drop(current);

    let mut process = state.0.lock().unwrap();

if let Some(mut child) = process.take() {
    let _ = child.kill();
    let _ = child.wait();
    // Tue tous les processus keybind par nom
    Command::new("taskkill")
        .args(["/F", "/T", "/IM", "keybind.exe"])
        .creation_flags(0x08000000)
        .output()
        .ok();
}

    let new_child = Command::new(resource_path)
        .arg(&increment_keybind)
        .arg(&decrement_keybind)
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        .spawn()
        .expect("Impossible de relancer keybind");

    spawn_listener(new_child, &mut process, app_handle);
}

#[tauri::command]
fn get_keybinds(keybinds: State<CurrentKeybinds>) -> (String, String) {
    keybinds.0.lock().unwrap().clone()
}

fn spawn_listener(mut child: Child, process: &mut Option<Child>, app_handle: tauri::AppHandle) {
    let stdout = child.stdout.take().expect("Impossible de lire stdout");
    *process = Some(child);

    thread::spawn(move || {
        let reader = BufReader::new(stdout);
        for line in reader.lines() {
            if let Ok(line) = line {
                match line.as_str() {
                    "increment" => {
                        app_handle.emit("counter-increment", ()).unwrap();
                    }
                    "decrement" => {
                        app_handle.emit("counter-decrement", ()).unwrap();
                    }
                    _ => {}
                }
            }
        }
    });
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .manage(PythonProcess(Mutex::new(None)))
        .manage(CurrentKeybinds(Mutex::new((
            "+".to_string(),
            "-".to_string(),
        ))))
        .setup(|app| {
            let app_handle = app.handle().clone();

            let resource_path = std::env::current_exe()
                .unwrap()
                .parent()
                .unwrap()
                .join("keybind.exe");

            let state = app.state::<PythonProcess>();
            let mut process = state.0.lock().unwrap();

            let child =  Command::new(&resource_path)
                .stdout(Stdio::piped())
                .stderr(Stdio::null())
                .spawn()
                .expect("Impossible de lancer keybind.py");

            spawn_listener(child, &mut process, app_handle);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![update_keybind, get_keybinds])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}