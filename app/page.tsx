import Image from "next/image";

export default function Home() {
  return (
    <main className="container">
      <div className="container text-center pt-10">
        <h3>钱条</h3>
      </div>
      <div className="container text-center w-full py-2">
        挣钱的进度条，得是老板给我的欠条。
      </div>
      <div className="container py-2">
        <div className="grid grid-cols-4 gap-2">
          <div className="container col-end-3">
            <div className="grid grid-cols-2">
              <label >上班于</label>
              <input type="time" defaultValue={"08:00"}></input>
            </div>
          </div>
          <div className="container col-start-3">
            <div className="grid grid-cols-2">
              <label>下班于</label>
              <input type="time" defaultValue={"19:00"}></input>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div className="col-end-3">
            <input type="checkbox"></input>
            <span>是否有午休</span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div className="container col-end-3">
            <div className="grid grid-cols-2">
              <label>午休开始于</label>
              <input type="time" defaultValue={"12:00"}></input>
            </div>
          </div>
          <div className="container col-start-3">
            <div className="grid grid-cols-2">
              <label>午休结束于</label>
              <input type="time" defaultValue={"14:00"}></input>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div className="container col-end-3">
            <div className="grid grid-cols-2">
              <div>月薪</div>
              <div className="grid grid-cols-2">
                <input type="number" defaultValue={3000}></input>
                <span>CNY</span>
              </div>
            </div>
          </div>
          <div className="container col-start-3">
            <div className="grid grid-cols-3">
              <span>一个月工作</span>
              <input type="number" defaultValue={20}></input>
              <span>天</span>
            </div>
          </div>
        </div>
      </div >
    </main >
  );
}
