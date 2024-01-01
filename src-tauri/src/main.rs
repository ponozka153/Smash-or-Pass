// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rand::Rng;

fn let_him_cook(choosen_endpoint: Vec<&str>) -> (String, String){
    let random_num = rand::thread_rng().gen_range(0..choosen_endpoint.len());
    let choosen_string = choosen_endpoint[random_num];
    let result_string = String::from(choosen_string);
    let result_endpointdongle: String;

    result_endpointdongle = match choosen_string {
        s if s.contains("api.waifu.pic") => String::from("url"),
        s if s.contains("api.waifu.im") => String::from("images[0] > url"),
        s if s.contains("pic.re") => String::from("file_url"),
        s if s.contains("nekos.best") => String::from("results[0] > url"),
        s if s.contains("purrbot.site") => String::from("link"),
        s if s.contains("hmtai.hatsunia.cfd") => String::from("url"),
        s if s == "https://nekos.life/api/neko" => String::from("neko"),
        s if s.contains("nekos.life") => String::from("url"),
        s if s.contains("ekobot.xyz") => String::from("message"),
        _ => String::from("image"),
    };
    

    return (result_string, result_endpointdongle)
}

#[tauri::command]
fn get_random_api(nsfw: bool) -> (String, String){
    let sfw_apiendpoints = vec!["https://api.waifu.pics/sfw/waifu", "https://api.waifu.pics/sfw/neko", "https://api.waifu.im/search?included_tags=waifu&limit=1", "https://api.waifu.im/search?included_tags=maid&limit=1", "https://api.waifu.im/search?included_tags=oppai&limit=1", "https://api.waifu.im/search?included_tags=selfies&limit=1", "https://api.waifu.im/search?included_tags=uniform&limit=1", "http://api.nekos.fun:8080/api/neko", "https://pic.re/image.json", "https://nekos.best/api/v2/waifu", "https://nekos.best/api/v2/neko", "https://purrbot.site/api/img/sfw/neko/img", "https://hmtai.hatsunia.cfd/v2/neko_arts", "https://hmtai.hatsunia.cfd/v2/coffee_arts", "https://nekos.life/api/neko", "https://nekos.life/api/v2/img/neko", "https://nekos.life/api/v2/img/ngif", "https://nekobot.xyz/api/image?type=neko", "https://nekobot.xyz/api/image?type=coffee"];
    let nsfw_apiendpoints = vec!["https://api.waifu.pics/nsfw/waifu", "https://api.waifu.pics/nsfw/neko", "https://api.waifu.pics/nsfw/trap", "https://api.waifu.im/search?included_tags=hentai&limit=1", "https://api.waifu.im/search?included_tags=ero&limit=1", "https://api.waifu.im/search?included_tags=ecchi&limit=1", "https://api.waifu.im/search?included_tags=milf&limit=1", "http://api.nekos.fun:8080/api/hentai", "http://api.nekos.fun:8080/api/lesbian", "http://api.nekos.fun:8080/api/lewd", "http://api.nekos.fun:8080/api/belle", "https://purrbot.site/api/img/nsfw/neko/img", "https://hmtai.hatsunia.cfd/v2/hentai", "https://hmtai.hatsunia.cfd/v2/ero", "https://hmtai.hatsunia.cfd/v2/yuri", "https://hmtai.hatsunia.cfd/v2/pantsu", "https://hmtai.hatsunia.cfd/v2/uniform", "https://hmtai.hatsunia.cfd/v2/thighs", "https://hmtai.hatsunia.cfd/v2/boobs", "https://hmtai.hatsunia.cfd/v2/nsfwNeko", "https://nekobot.xyz/api/image?type=hass", "https://nekobot.xyz/api/image?type=hmidriff", "https://nekobot.xyz/api/image?type=hneko", "https://nekobot.xyz/api/image?type=hthigh"];
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
