import { Metadata } from "next";
import EquityNavigation from "./components/EquityNavigation";

export const metadata: Metadata = {
  title: "Commercial Equity Investment - 100Gaj",
  description: "Invest in premium commercial real estate and earn passive income through equity shares",
};

export default function EquityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black">
      <EquityNavigation />
      {children}
    </div>
  );
}
