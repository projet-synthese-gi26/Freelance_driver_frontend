import { formater } from "@/components/format/Currency";
interface EarningsCardProps {
    title: string;
    amount: number;
  }
  
 const EarningsCard: React.FC<EarningsCardProps> = ({ title, amount }) => (
    <div className="bg-white p-4 rounded-lg border shadow-md">
      <h2 className="text font-semibold mb-2">{title}</h2>
      <p className="title font-bold text-green-600">{formater(amount)} XAF</p>
    </div>
  );

export default EarningsCard;