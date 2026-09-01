import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
      <h1 className="text-6xl font-black tracking-tighter">ACG Portals</h1>
      <div className="flex gap-4">
        <Link href="/shop" className="px-8 py-4 bg-black text-white font-bold text-lg rounded-full hover:bg-gray-800 transition-colors">
          Audio Store
        </Link>
        <Link href="/compute" className="px-8 py-4 bg-gray-100 text-black border border-gray-200 font-bold text-lg rounded-full hover:bg-gray-200 transition-colors">
          Compute Store
        </Link>
      </div>
    </div>
  );
}
