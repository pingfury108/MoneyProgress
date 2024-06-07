import { Time } from "@internationalized/date";
import { Checkbox } from "@nextui-org/checkbox";
import { Input } from "@nextui-org/input";
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
        <div className="container  grid grid-cols-4 gap-2 py-1">
          <Progress color="primary" aria-label="Loading..." value={55}
            size="lg"
            radius="lg"
            className="max-w-md col-start-2 col-span-2"
            showValueLabel={true}
            disableAnimation={true}
          />
        </div>
        <div className="grid grid-cols-4 gap-2 py-1">
          <div className="container col-end-3">
            <Input label="上班于" labelPlacement="outside-left" type="time" defaultValue={"08:00"} />
          </div>
          <div className="container col-start-3">
            <Input label="下班于" labelPlacement="outside-left" type="time" defaultValue={"19:00"} />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 py-1">
          <div className="col-end-3 flex items-center">
            <Checkbox defaultSelected radius="sm" size="sm" className="">是否有午休</Checkbox>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 py-1">
          <div className="container col-end-3">
            <Input label="午休开始于" labelPlacement="outside-left" type="time" defaultValue={"12:00"} />
          </div>
          <div className="container col-start-3">
            <Input label="午休结束于" labelPlacement="outside-left" type="time" defaultValue={"14:00"} />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 py-1">
          <div className="container col-end-3">
            <div className="">
              <Input label="月薪" labelPlacement="outside-left" type="number" placeholder="3000" />
            </div>
          </div>
          <div className="container col-start-3">
            <Input label="工作天数" type="number" labelPlacement="outside-left" placeholder="20" />
          </div>
        </div>
      </div >
    </main >
  );
}
