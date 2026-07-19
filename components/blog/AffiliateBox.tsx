import { ShoppingCart } from "lucide-react";

interface AffiliateBoxProps {
  title: string;
  description: string;
  buttonText: string;
  url: string;
}

export function AffiliateBox({ title, description, buttonText, url }: AffiliateBoxProps) {
  return (
    <div className="my-14 bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0">
          <ShoppingCart className="w-10 h-10 text-emerald-600" />
        </div>
        <div>
          <h4 className="text-xl font-extrabold text-[#0f172a] mb-3">{title}</h4>
          <p className="text-slate-600 mb-6 leading-relaxed">{description}</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-md hover:shadow-lg"
          >
            {buttonText}
          </a>
          <p className="text-xs text-slate-400 mt-4">
            *Link de afiliado: o portal pode receber uma comissão sem custo extra para você.
          </p>
        </div>
      </div>
    </div>
  );
}
