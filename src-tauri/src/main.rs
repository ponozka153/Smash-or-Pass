// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rand::Rng;

fn let_him_cook(choosen_endpoint: Vec<&str>) -> (String, String){
    let random_num = rand::thread_rng().gen_range(0..choosen_endpoint.len());
    let choosen_string = choosen_endpoint[random_num];
    let result_string = String::from(choosen_string);
    let result_endpointdongle: String;

    if choosen_string.contains("api.waifu.pic") {
        result_endpointdongle = String::from("url");
    } else if choosen_string.contains("api.waifu.im"){
        result_endpointdongle = String::from("images[0] > url");
    } else {result_endpointdongle = String::from("image");}

    return (result_string, result_endpointdongle)
}

#[tauri::command]
fn get_random_api(nsfw: bool) -> (String, String){
    let sfw_apiendpoints = vec!["https://api.waifu.pics/sfw/waifu", "https://api.waifu.pics/sfw/neko", "https://api.waifu.im/search?included_tags=waifu&limit=1", "https://api.waifu.im/search?included_tags=maid&limit=1", "https://api.waifu.im/search?included_tags=oppai&limit=1", "https://api.waifu.im/search?included_tags=selfies&limit=1", "https://api.waifu.im/search?included_tags=uniform&limit=1", "http://api.nekos.fun:8080/api/neko"];
    let nsfw_apiendpoints = vec!["https://api.waifu.pics/nsfw/waifu", "https://api.waifu.pics/nsfw/neko", "https://api.waifu.pics/nsfw/trap", "https://api.waifu.im/search?included_tags=hentai&limit=1", "https://api.waifu.im/search?included_tags=ero&limit=1", "https://api.waifu.im/search?included_tags=ecchi&limit=1", "https://api.waifu.im/search?included_tags=milf&limit=1", "http://api.nekos.fun:8080/api/hentai", "http://api.nekos.fun:8080/api/lesbian", "http://api.nekos.fun:8080/api/lewd", "http://api.nekos.fun:8080/api/belle"];
    let mut all_apiendpoints = sfw_apiendpoints.clone();
    all_apiendpoints.extend(nsfw_apiendpoints);

    if !nsfw {
        return let_him_cook(sfw_apiendpoints);
    } else {
        return let_him_cook(all_apiendpoints);
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_random_api,
            ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
