import { cn } from "./ui/cn";

const PriceFormat = ({ amount, className }) => {
  const numericAmount = typeof amount === "number" && !isNaN(amount) ? amount : 0;
  const formattedAmount = Number(numericAmount).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });
  return <span className={cn(className)}>{formattedAmount}</span>;
};

export default PriceFormat;
