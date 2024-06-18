'use client'

import { Checkbox } from "@nextui-org/checkbox";
import { Input } from "@nextui-org/input";
import { Progress } from "@nextui-org/progress";
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

function timeSecondDiff(t1: string, t2: string) {
  const time1 = new Date(`2000-01-01T${t1}`);
  const time2 = new Date(`2000-01-01T${t2}`);
  const timeDiff = Math.abs(time1 - time2);
  const secondsDiff = timeDiff / 1000;
  return secondsDiff
}

function currentTime(now) {
  const hours = now.getHours().toString().padStart(2, '0'); // 获取当前小时并补零
  const minutes = now.getMinutes().toString().padStart(2, '0'); // 获取当前分钟并补零

  return `${hours}:${minutes}`;
}
export default function Home() {
  const cfg: Cfg = {
    start_work_time: "08:00",
    end_work_time: "19:00",
    lunch: false,
    start_lunch_time: "12:00",
    end_lunch_time: "14:00",
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

  const [nowTime, setNowTime] = useState(new Date());
  const [progressValue, setProgressValue] = useState(timeSecondDiff(start_work_time, currentTime(nowTime)))
  const [progressMaxValue, setProgressMaxValue] = useState(timeSecondDiff(start_work_time, end_work_time))
  useEffect(() => {
    const interval = setInterval(() => {
      setNowTime(new Date());
      setProgressValue(prevProgressValue => timeSecondDiff(start_work_time, currentTime(nowTime)));
      setProgressMaxValue(prevProgressMaxValue => timeSecondDiff(start_work_time, end_work_time));
      console.log("update now time");
    }, 1000); // 每秒触发一次

    return () => {
      clearInterval(interval);
    };
  }, []);


  const LunchHtml = () => {
    if (lunch) {
      return (
        <div className="grid grid-cols-4 gap-2 py-1">
          <div className="container col-end-3">
            <Input label="午休开始于" labelPlacement="outside-left" type="time" defaultValue={"12:00"} value={start_lunch_time} onChange={(event) => { setStartLunchTime(event?.target.value) }} />
          </div>
          <div className="container col-start-3">
            <Input label="午休结束于" labelPlacement="outside-left" type="time" defaultValue={"14:00"} value={end_lunch_time} onChange={(event) => { setEndLunchTime(event?.target.value) }} />
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
        <div className="container  grid grid-cols-4 gap-2 py-1">
          <Progress color="primary" aria-label="Loading..." value={progressValue}
            maxValue={progressMaxValue}
            size="lg"
            radius="lg"
            className="max-w-md col-start-2 col-span-2"
            showValueLabel={true}
            disableAnimation={true}
          />
        </div>
        <div className="grid grid-cols-4 gap-2 py-1">
          <div className="container col-end-3">
            <Input label="上班于" labelPlacement="outside-left" type="time" defaultValue={"08:00"} value={start_work_time} onChange={(event) => { setStartWorkTime(event?.target.value) }} />
          </div>
          <div className="container col-start-3">
            <Input label="下班于" labelPlacement="outside-left" type="time" defaultValue={"19:00"} value={end_work_time} onChange={(event) => { setEndWorkTime(event?.target.value) }} />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 py-1">
          <div className="col-end-3 flex items-center">
            <Checkbox radius="sm" size="sm" value={String(lunch)} onChange={(event) => { setLunch(event.target.checked) }}>是否有午休</Checkbox>
          </div>
        </div>
        <LunchHtml />
        <div className="grid grid-cols-4 gap-2 py-1">
          <div className="container col-end-3">
            <div className="">
              <Input label="月薪" labelPlacement="outside-left" type="number" placeholder="3000" value={monthly_salary.toString()} onChange={(event) => { setMonthlySalary(Number(event?.target.value)) }} />
            </div>
          </div>
          <div className="container col-start-3">
            <Input label="工作天数" type="number" labelPlacement="outside-left" placeholder="20" value={work_day.toString()} onChange={(event) => { setWorkDay(Number(event?.target.value)) }} />
          </div>
        </div>
      </div >
    </main >
  );
}
