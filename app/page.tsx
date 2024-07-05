'use client';
import { parseTime } from '@internationalized/date';
import { Checkbox, Input, Progress, TimeInput } from "@nextui-org/react";
import { invoke, } from "@tauri-apps/api/core";
import { produce } from 'immer';
import React, { useEffect, useState } from "react";

function toTimeValue(s: any) {
  if (!s) {
    return parseTime("00:00:00")
  }
  return parseTime(s)
}

export default function Home() {
  const [cfg, setCfg] = useState<any>({});
  const [initialized, setInitialized] = useState(false);
  const [salary_second, setSalarySecond] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [progressMaxValue, setProgressMaxValue] = useState(100);
  const [currency, setCurrency] = useState("CNY");

  const currencyList: any = {
    "CNY": "¥",
    "USD": "$"
  }

  useEffect(() => {
    if (!initialized) {
      invoke("load_cfg")
        .then(v => {
          setCfg(v);
          setInitialized(true); // 设置已初始化
        });
    }
  }, [initialized]);


  useEffect(() => {
    const interval = setInterval(() => {
      invoke("already_work_time_value")
        .then(v => {
          setProgressValue(Number(v));
        })
    }, 1000);// 每秒触发一次

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    invoke("update_cfg", {
      "data": cfg
    }).then();
    invoke("work_time_value")
      .then(v => {
        setProgressMaxValue(Number(v));
      });
    invoke("already_gotit", { "seconds": 1 })
      .then(v => {
        setSalarySecond(Number(v));
      });
  }, [cfg])


  function updateCfg(key: string, value: any) {
    setCfg(produce(cfg, (draft: typeof cfg) => {
      draft[key] = value;
    }));
  };

  return (
    <main className="container">
      <div className="container text-center pt-10">
        <h3 className="text-2xl font-bold">钱条</h3>
      </div>
      <div className="container text-center w-full py-2 text-xl">
        挣钱的进度条，得是老板给我的欠条。
      </div>
      <div className="container">
        <div className="container grid grid-cols-4 gap-2 py-1">
          <Progress color="primary" label="今日进度" value={progressValue}
            maxValue={progressMaxValue}
            size="lg"
            radius="full"
            className="max-w-md col-start-2 col-span-2"
            showValueLabel={true}
            disableAnimation={false}
          />
        </div>
        <div className="grid grid-cols-4 gap-2 py-1">
          <div className="container col-end-3 col-span-1 w-full flex">
            <div className='container w-3/12 flex'>
              <label className='place-self-center'>上班于</label>
            </div>
            <div className='container w-9/12'>
              <TimeInput aria-label="start_work_time" labelPlacement="outside-left"
                hourCycle={24}
                value={toTimeValue(cfg.start_work_time)}
                onChange={
                  (event) => {
                    updateCfg("start_work_time", event.toString());
                  }
                } />
            </div>
          </div>
          <div className="container col-start-3 col-span-1 w-full flex">
            <div className='container flex w-3/12'>
              <label className='place-self-center'>下班于</label>
            </div>
            <div className='container w-9/12'>
              <TimeInput aria-label="end_work_time" labelPlacement="outside-left"
                hourCycle={24}
                value={toTimeValue(cfg.end_work_time)}
                onChange={(event) => { updateCfg("end_work_time", event.toString()) }} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 py-1">
          <div className="col-start-2 flex items-center">
            <Checkbox radius="sm" size="sm" isSelected={cfg.lunch} defaultChecked={cfg.lunch === true} onChange={(event) => { updateCfg("lunch", event.target.checked) }}>是否有午休</Checkbox>
          </div>
        </div>
        <div className={`grid grid-cols-4 gap-2 py-1 ${cfg.lunch ? 'block' : 'hidden'}`}>
          <div className="container col-end-3 col-span-1 flex">
            <div className='container w-3/12 flex'>
              <label className='place-self-center'>午休始</label>
            </div>
            <div className='container w-9/12'>
              <TimeInput aria-label="start_lunch_time" labelPlacement="outside-left"
                hourCycle={24}
                value={toTimeValue(cfg.start_lunch_time)}
                onChange={(event) => { updateCfg("start_lunch_time", event.toString()) }} />
            </div>
          </div>
          <div className="container col-start-3 col-span-1 flex">
            <div className='container w-3/12 flex'>
              <label className='place-self-center'>午休止</label>
            </div>
            <div className='container w-9/12'>
              <TimeInput aria-label="end_lunch_time" labelPlacement="outside-left"
                value={toTimeValue(cfg.end_lunch_time)}
                hourCycle={24}
                onChange={(event) => { updateCfg("end_lunch_time", event.toString()) }} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 py-1">
          <div className="container col-end-3 col-span-1 w-full flex">
            <div className='container w-3/12 flex'>
              <label className='place-self-center'>月薪</label>
            </div>
            <div className='container w-9/12'>
              <Input aria-label="monthly_salary" labelPlacement="outside-left" type="number" placeholder="3000"
                value={cfg.monthly_salary}
                onChange={(event) => { updateCfg("monthly_salary", Number(event?.target.value)) }}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">{currencyList[currency]}</span>
                  </div>
                }
                endContent={
                  <div className="flex items-center">
                    <label className="sr-only" htmlFor="currency">
                      Currency
                    </label>
                    <select
                      className="outline-none border-0 bg-transparent text-default-400 text-small"
                      id="currency"
                      name="currency"
                      value={currency}
                      onChange={e => setCurrency(e.target.value)}
                    >
                      <option>USD</option>
                      <option>CNY</option>
                    </select>
                  </div>
                }
              />
            </div>
          </div>
          <div className="container col-start-3 col-span-1 w-full flex place-items-baseline">
            <div className='container w-3/12 flex'>
              <label className='place-self-center'>天数</label>
            </div>
            <div className='container w-9/12'>
              <Input aria-label="work_day" type="number" labelPlacement="outside-left" placeholder="20"
                value={cfg.work_day}
                onChange={(event) => { updateCfg("work_day", Number(event?.target.value)) }} />
            </div>
          </div>
        </div>
        <div className="text-sm italic pt-3 pl-3" >
          <p>这么看来, 假设一个月工作 {cfg.work_day} 天:</p>
          <p>您一天能挣 {(cfg.monthly_salary / cfg.work_day).toFixed(3)} {currencyList[currency]}</p>
          <p>您一天有效工时 {(progressMaxValue / (60 * 60)).toFixed(3)} 小时</p>
          <p>您一秒中能挣 {salary_second.toFixed(3)} {currencyList[currency]}</p>
          <p></p>
          <p>今日已上班 {(progressValue / 60 / 60).toFixed(3)} 小时</p>
          <p>今日已赚 {(salary_second * progressValue).toFixed(3)} {currencyList[currency]}</p>
        </div>
      </div >
    </main >
  );
}
