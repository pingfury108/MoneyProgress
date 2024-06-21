'use client'

import { Checkbox } from "@nextui-org/checkbox";
import { Input } from "@nextui-org/input";
import { Progress } from "@nextui-org/progress";
import { invoke } from "@tauri-apps/api/core";
import React, { useEffect, useState } from "react";

interface Cfg {
  start_work_time: string
  end_work_time: string
  lunch: boolean
  start_lunch_time: string
  end_lunch_time: string
  monthly_salary: number
  work_day: number
}

export default function Home() {
  const cfg: Cfg = {
    start_work_time: "08:00:00",
    end_work_time: "19:00:00",
    lunch: false,
    start_lunch_time: "12:00:00",
    end_lunch_time: "14:00:00",
    monthly_salary: 3000,
    work_day: 20,
  }

  const [start_work_time, setStartWorkTime] = useState(cfg.start_work_time)
  const [end_work_time, setEndWorkTime] = useState(cfg.end_work_time)
  const [lunch, setLunch] = useState(cfg.lunch)
  const [start_lunch_time, setStartLunchTime] = useState(cfg.start_lunch_time)
  const [end_lunch_time, setEndLunchTime] = useState(cfg.end_lunch_time)
  const [monthly_salary, setMonthlySalary] = useState(cfg.monthly_salary)
  const [work_day, setWorkDay] = useState(cfg.work_day)

  const [salary_second, setSalarySecond] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [progressMaxValue, setProgressMaxValue] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      invoke("work_time_value")
        .then(v => {
          setProgressMaxValue(Number(v));
          console.log(v, "max time value");
        })

      invoke("already_work_time_value")
        .then(v => {
          setProgressValue(Number(v));
          console.log(v, "now time value");
        })
      console.log("update now time");

      invoke("already_gotit", { "seconds": 1 })
        .then(v => {
          setSalarySecond(Number(v));
          console.log("salary second", v);
        })
    }, 1000); // 每秒触发一次

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    console.log("cfg  changed:", start_work_time, end_work_time);
  }, [start_work_time, end_work_time]); // 依赖项数组，指定监听 count 状态值


  const LunchHtml = () => {
    if (lunch) {
      return (
        <div className="grid grid-cols-6 gap-2 py-1">
          <div className="container col-end-4 col-span-2">
            <Input label="午休始" labelPlacement="outside-left" type="time" defaultValue={"12:00:00"} value={start_lunch_time} onChange={(event) => { setStartLunchTime(event?.target.value) }} />
          </div>
          <div className="container col-start-4 col-spna-2">
            <Input label="午休止" labelPlacement="outside-left" type="time" defaultValue={"14:00:00"} value={end_lunch_time} onChange={(event) => { setEndLunchTime(event?.target.value) }} />
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <main className="container">
      <div className="container text-center pt-10">
        <h3 className="text-2xl font-bold">钱条</h3>
      </div>
      <div className="container text-center w-full py-2 text-xl">
        挣钱的进度条，得是老板给我的欠条。
      </div>
      <div className="container">
        <div className="container grid grid-cols-6 gap-2 py-1">
          <Progress color="primary" label="今日进度" value={progressValue}
            maxValue={progressMaxValue}
            size="lg"
            radius="full"
            className="max-w-md col-start-2 col-span-4"
            showValueLabel={true}
            disableAnimation={false}
          />
        </div>
        <div className="grid grid-cols-6 gap-2 py-1">
          <div className="container col-end-4 col-span-2  w-full">
            <Input label=<div className="container">上班于</div> labelPlacement="outside-left" type="time" defaultValue={"08:00:00"} value={start_work_time} onChange={(event) => { setStartWorkTime(event?.target.value) }} />
          </div>
          <div className="container col-start-4 col-span-2">
            <Input label="下班于" labelPlacement="outside-left" type="time" defaultValue={"19:00:00"} value={end_work_time} onChange={(event) => { setEndWorkTime(event?.target.value) }} />
          </div>
        </div>
        <div className="grid grid-cols-6 gap-2 py-1">
          <div className="col-start-2 flex items-center">
            <Checkbox radius="sm" size="sm" value={String(lunch)} onChange={(event) => { setLunch(event.target.checked) }}>是否有午休</Checkbox>
          </div>
        </div>
        <LunchHtml />
        <div className="grid grid-cols-6 gap-2 py-1">
          <div className="container col-end-4 col-span-2">
            <Input label="月薪" labelPlacement="outside-left" type="number" placeholder="3000" value={monthly_salary.toString()} onChange={(event) => { setMonthlySalary(Number(event?.target.value)) }} />
          </div>
          <div className="container col-start-4 col-span-2">
            <Input label="天数" type="number" labelPlacement="outside-left" placeholder="20" value={work_day.toString()} onChange={(event) => { setWorkDay(Number(event?.target.value)) }} />
          </div>
        </div>
        <div className="text-sm italic pt-3" >
          <p>这么看来, 假设一个月工作 {work_day} 天:</p>
          <p>您一天能挣 {salary_second * progressMaxValue} </p>
          <p>您一天有效工时 {progressMaxValue / (60 * 60)} 小时</p>
          <p>您一秒中能挣 {salary_second} </p>
        </div>
      </div >
    </main >
  );
}
