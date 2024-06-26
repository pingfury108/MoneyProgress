use std::sync::Mutex;

use chrono::{Local, NaiveTime};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tauri::{command, generate_handler, AppHandle, Manager, State, Wry};
use tauri_plugin_store::{with_store, StoreCollection};

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Cfg {
    pub start_work_time: String,
    pub end_work_time: String,
    pub lunch: bool,
    pub start_lunch_time: String,
    pub end_lunch_time: String,
    pub monthly_salary: i64,
    pub work_day: i64,
}

struct CfgState(Mutex<Cfg>);

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
        let start_time = NaiveTime::parse_from_str(&self.start_lunch_time[..], "%H:%M:%S").unwrap();
        let end_time = NaiveTime::parse_from_str(&self.end_lunch_time[..], "%H:%M:%S").unwrap();
        let now_time = now.time();
        if self.lunch {
            if now_time <= start_time {
                return diff_time_value(
                    &self.start_work_time[..],
                    &now.format("%H:%M:%S").to_string()[..],
                );
            }
            if now_time >= start_time && now_time <= end_time {
                return diff_time_value(&self.start_work_time[..], &self.start_lunch_time[..]);
            }
            if now_time > end_time {
                return diff_time_value(
                    &self.start_work_time[..],
                    &now.format("%H:%M:%S").to_string()[..],
                ) - diff_time_value(&self.start_lunch_time[..], &self.end_lunch_time[..]);
            }
            diff_time_value(
                &self.start_work_time[..],
                &now.format("%H:%M:%S").to_string()[..],
            )
        } else {
            diff_time_value(
                &self.start_work_time[..],
                &now.format("%H:%M:%S").to_string()[..],
            )
        }
    }
    pub fn salary_per_second(&self) -> f64 {
        (self.monthly_salary as f64 / self.work_day as f64) / self.work_time_value() as f64
    }

    pub fn replace(&mut self, new: Cfg) {
        *self = Cfg { ..new };
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
fn work_time_value(cfg: State<'_, CfgState>) -> i64 {
    cfg.0.lock().unwrap().work_time_value()
}

#[command]
fn already_work_time_value(cfg: State<'_, CfgState>) -> i64 {
    cfg.0.lock().unwrap().already_work_time_value()
}

#[command]
fn already_gotit(seconds: f64, cfg: State<'_, CfgState>) -> f64 {
    cfg.0.lock().unwrap().salary_per_second() * seconds
}

#[command]
fn load_cfg(_app: AppHandle, cfg: State<'_, CfgState>) -> Cfg {
    cfg.0.lock().unwrap().clone()
}

#[command]
fn update_cfg(app: AppHandle, data: Cfg, cfg: State<'_, CfgState>) {
    let mut c = cfg.0.lock().unwrap();
    c.replace(data.clone());
    let stores = app.state::<StoreCollection<Wry>>();
    let path = PathBuf::from("data.bin"); // 替换为你的存储文件路径
    if let Err(e) = with_store(app.clone(), stores, path, |store| {
        // 写入数据到 Store
        match store.insert("cfg".to_string(), serde_json::json!(Cfg { ..data.clone() })) {
            Ok(_) => {}
            Err(e) => {
                print!("insert cfg to store err: {e}")
            }
        }
        Ok(())
    }) {
        print!("with store err: {e}")
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        //.manage(CfgState(Default::default()))
        .setup(|app| {
            let stores = app.state::<StoreCollection<Wry>>();
            let path = PathBuf::from("data.bin"); // 替换为你的存储文件路径

            with_store(app.handle().clone(), stores, path, |store| {
                match store.get("cfg") {
                    Some(data) => {
                        let cfg_data = serde_json::from_value::<Cfg>(data.clone());
                        match cfg_data {
                            Ok(cfg) => {
                                app.manage(CfgState(Mutex::new(cfg)));
                            }
                            Err(e) => {
                                print!("reade cfg store err: {e}");
                                app.manage(CfgState(Default::default()));
                            }
                        }
                    }
                    None => {
                        app.manage(CfgState(Default::default()));
                    }
                }
                Ok(())
            })?;

            //app.manage(CfgState(Default::default()));
            Ok(())
        })
        .invoke_handler(generate_handler![
            diff_time_value,
            work_time_value,
            already_work_time_value,
            already_gotit,
            update_cfg,
            load_cfg,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
