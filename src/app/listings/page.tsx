import { ListingsMarketplace } from "@/components/ListingsMarketplace";

export const metadata = {
  title: "Find a room",
  description: "Browse verified temporary student rooms in Maastricht.",
};

export default function ListingsPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <ListingsMarketplace />
    </div>
  );
}
