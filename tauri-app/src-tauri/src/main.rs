#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Builder;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
