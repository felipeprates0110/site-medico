import Image from "next/image";

interface AuthorBoxProps {
  name: string;
  role: string;
  crm: string;
  bio: string;
  photoUrl?: string;
}

export function AuthorBox({ name, role, crm, bio, photoUrl }: AuthorBoxProps) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 my-12 flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <div className="w-24 h-24 bg-slate-100 rounded-full flex-shrink-0 flex items-center justify-center text-slate-300 overflow-hidden border-4 border-white shadow-md relative">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        )}
      </div>
      <div className="text-center sm:text-left">
        <h3 className="text-xl font-extrabold text-[#0f172a] mb-1">{name}</h3>
        <p className="text-sm font-bold text-[#0284c7] mb-3">
          {role}
          <span className="inline-block bg-slate-100 text-slate-500 px-2 py-0.5 rounded ml-2 text-xs font-medium">
            {crm}
          </span>
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">{bio}</p>
      </div>
    </div>
  );
}
