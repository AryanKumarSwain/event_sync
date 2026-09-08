import Link from "next/link";
import { ArrowLeft, Radio } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-4">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-md mb-6">
        <Radio className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-black text-slate-950">404 - Page Not Found</h1>
      <p className="mt-2 text-sm text-slate-600 max-w-md text-center">
        The live stage tracker or school event URL you requested could not be located.
      </p>
      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-700/20 hover:bg-emerald-500 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Events Directory</span>
        </Link>
      </div>
    </div>
  );
}
