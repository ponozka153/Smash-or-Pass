// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn get_random_api(nsfw: bool) -> String{
    if !nsfw {
        return String::from("https://api.waifu.pics/sfw/waifu");
    } else {
        return String::from("https://api.waifu.pics/nsfw/waifu");
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_random_api
            ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
