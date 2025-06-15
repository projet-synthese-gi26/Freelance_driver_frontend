import { formater } from "@/components/format/Currency";
const StatCard: React.FC<{ title: string; value: number; unit:string; comparison:number; allure:'up'|'down'}> = ({ title, value,unit,comparison,allure }) => (
    <div className="bg-white p-4 rounded-lg border shadow-md text">
      <h3 className="text-gray-500 text font-bold">{title}</h3>
      <p className="title font-bold text-gray-800">{formater(value)}{" "}{unit}</p>
      <div className="flex flex-row gap-3">
        <span className={`${allure==='up'?("text-green-500 bg-green-100"):("text-red-500 bg-red-100")} px-1 rounded-md`}>
            {allure==='up'?("↑"):("↓")}{" "}
            {comparison}%
        </span>
        <p className="text-gray-400 text">Compared to last month</p>
      </div>
    </div>
  );

export default StatCard