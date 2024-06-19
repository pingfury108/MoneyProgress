use chrono::{Datelike, Local, NaiveDateTime, NaiveTime};
use tauri::{command, generate_handler};

#[command]
fn max_time_value(start: String, end: String) -> i64 {
    //let now = Local::now();
    let start_time = NaiveTime::parse_from_str(&format!("{}", start), "%H:%M:%S").unwrap();
    let end_time = NaiveTime::parse_from_str(&format!("{}", end), "%H:%M:%S").unwrap();
    let diff = end_time - start_time;
    println!("{:#?},  {:#?}, diff: {:#?}", start_time, end_time, diff);

    diff.num_seconds()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(generate_handler![max_time_value])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
