// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::{Command, Stdio};
use std::io::{BufRead, BufReader};
use std::thread;
use tauri::Emitter;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.handle().clone();

            thread::spawn(move || {

                let mut child = Command::new("python")
                    .arg("../src/scripts/keybind.py")
                    .stdout(Stdio::piped())
                    .stderr(Stdio::null())
                    .spawn()
                    .expect("Impossible de lancer keybind.py");

                let stdout = child.stdout.take().expect("Impossible de lire stdout");
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

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}