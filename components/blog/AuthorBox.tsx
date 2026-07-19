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
    <div className="my-12 flex flex-col items-center gap-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm sm:flex-row sm:items-start">
      <div className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100 text-gray-300 shadow-md">
        {photoUrl ? (
          <Image src={photoUrl} alt={name} fill className="object-cover" />
        ) : (
          <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        )}
      </div>
      <div className="text-center sm:text-left">
        <h3 className="mb-1 text-xl font-bold text-gray-900">{name}</h3>
        <p className="mb-3 text-sm font-semibold text-primary-700">
          {role}
          <span className="ml-2 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
            {crm}
          </span>
        </p>
        <p className="text-sm leading-relaxed text-gray-600">{bio}</p>
      </div>
    </div>
  );
}
