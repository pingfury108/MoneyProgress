import { Progress } from "@nextui-org/progress";

export default function Home() {
  return (
    <main className="container">
      <div className="container text-center pt-10">
        <h3 className="text-2xl font-bold">钱条</h3>
      </div>
      <div className="container text-center w-full py-2 text-xl">
        挣钱的进度条，得是老板给我的欠条。
      </div>
      <div className="container">
        <div className="grid grid-cols-4 gap-2 py-1">
          <Progress color="primary" aria-label="Loading..." value={99}
            size="sm"
            radius="sm"
            className="max-w-md col-start-2 col-span-2"
            showValueLabel={true}
            disableAnimation={true}
          />
        </div>
        <div className="grid grid-cols-4 gap-2 py-1">
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
        <div className="grid grid-cols-4 gap-2 py-1">
          <div className="col-end-3">
            <input type="checkbox"></input>
            <span>是否有午休</span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 py-1">
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

        <div className="grid grid-cols-4 gap-2 py-1">
          <div className="container col-end-3">
            <div className="grid grid-cols-2">
              <span>月薪</span>
              <div className="grid grid-cols-5 border rounded border-dashed">
                <input type="number" defaultValue={3000} className="col-span-3 border-none"></input>
                <span>CNY</span>
              </div>
            </div>
          </div>
          <div className="container col-start-3">
            <div className="grid grid-cols-2">
              <span>一个月工作</span>
              <div className="grid grid-cols-5 border rounded border-dashed">
                <input type="number" defaultValue={20} className="col-span-4 border-none"></input>
                <span>天</span>
              </div>
            </div>
          </div>
        </div>
      </div >
    </main >
  );
}
