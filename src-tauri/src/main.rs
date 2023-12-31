// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest;
use serde::Deserialize;

#[derive(Deserialize)]
struct ApiResponse {
    url: String
}

#[tauri::command]
async fn get_image(nsfw: bool) -> String {
    let url: &str;
    if !nsfw {
        url = "https://api.waifu.pics/sfw/waifu";
    } else {
        url = "https://api.waifu.pics/nsfw/waifu"
    }

    let response = reqwest::get(url).await.unwrap();
    if response.status().is_success(){
        let apiresponse: ApiResponse = response.json().await.unwrap();

        return apiresponse.url
    } else {
        return "Failed to fetch SFW image".to_string();
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_image
            ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
