use chrono::{Local, NaiveTime};
use tauri::{command, generate_handler, State};

struct Cfg {
    pub start_work_time: String,
    pub end_work_time: String,
    pub lunch: bool,
    pub start_lunch_time: String,
    pub end_lunch_time: String,
    pub monthly_salary: i64,
    pub work_day: i64,
}

impl Default for Cfg {
    fn default() -> Self {
        Self {
            start_work_time: "08:00:00".to_string(),
            end_work_time: "19:00:00".to_string(),
            lunch: false,
            start_lunch_time: "12:00:00".to_string(),
            end_lunch_time: "14:00:00".to_string(),
            monthly_salary: 3000,
            work_day: 20,
        }
    }
}

impl Cfg {
    pub fn work_time_value(&self) -> i64 {
        if self.lunch {
            diff_time_value(&self.start_work_time[..], &self.end_work_time[..])
                - diff_time_value(&self.start_lunch_time[..], &self.end_lunch_time[..])
        } else {
            diff_time_value(&self.start_work_time[..], &self.end_work_time[..])
        }
    }
    pub fn already_work_time_value(&self) -> i64 {
        let now = Local::now();
        diff_time_value(
            &self.start_work_time[..],
            &now.format("%H:%M:%S").to_string()[..],
        )
    }
    pub fn salary_per_second(&self) -> f64 {
        (self.monthly_salary as f64 / self.work_day as f64) / (24 * 60 * 60) as f64
    }
}

#[command]
fn diff_time_value(start: &str, end: &str) -> i64 {
    let start_time = NaiveTime::parse_from_str(start, "%H:%M:%S").unwrap();
    let end_time = NaiveTime::parse_from_str(end, "%H:%M:%S").unwrap();
    let diff = end_time - start_time;
    diff.num_seconds()
}

#[command]
fn work_time_value(cfg: State<'_, Cfg>) -> i64 {
    cfg.work_time_value()
}

#[command]
fn already_work_time_value(cfg: State<'_, Cfg>) -> i64 {
    cfg.already_work_time_value()
}

#[command]
fn already_gotit(seconds: f64, cfg: State<'_, Cfg>) -> f64 {
    cfg.salary_per_second() * seconds
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(Cfg::default())
        .invoke_handler(generate_handler![
            diff_time_value,
            work_time_value,
            already_work_time_value,
            already_gotit,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
