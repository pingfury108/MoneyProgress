import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div>
          挣钱的进度条，得是老板给我的欠条
        </div>

        <div className="grid grid-cols-2 place-items-center">
          <div className="col-span-1">
            <label>上班于</label>
            <input type="time"></input>
          </div>
          <div className="col-span-1">
            <label>下班与</label>
            <input type="time"></input>
          </div>
        </div>

        <div>是否有午休</div>

        <div className="grid grid-cols-2">
          <div >
            <label>午休开始于 </label>
            <input type="time"></input>
          </div>
          <div>
            <label>午休结束于</label>
            <input type="time"></input>
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div>
            <label>月薪</label>
            <input type="number"></input>
            <label>CNY</label>
          </div>

          <div>
            <span>一个月工作</span>
            <input type="number"></input>
            <span>天</span>
          </div>
        </div>
      </div>
    </main>
  );
}
