import Link from "next/link";
import type { ComponentType } from "react";
import { ChevronRight, Heart, Activity, Zap, Shield, User, Stethoscope, Pill, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  heart: Heart,
  activity: Activity,
  zap: Zap,
  shield: Shield,
  user: User,
  stethoscope: Stethoscope,
  pill: Pill,
};

export type SpecialtyCardData = {
  id: string;
  title: string;
  slug: string;
  icon: string;
  short_description?: string;
  shortDescription?: string;
};

function getShortDescription(specialty: SpecialtyCardData) {
  return specialty.short_description ?? specialty.shortDescription ?? "";
}

interface SpecialtyCardProps {
  specialty: SpecialtyCardData;
}

export function SpecialtyCard({ specialty }: SpecialtyCardProps) {
  const Icon = iconMap[specialty.icon] || Heart;

  return (
    <Link href={`/especialidades/${specialty.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden rounded-3xl border-gray-200 bg-white shadow-md ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl">
        <CardContent className="p-8">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-500/25 transition-transform group-hover:scale-105">
              <Icon className="h-7 w-7" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-950 group-hover:text-primary-700">
            {specialty.title}
          </h3>
          <p className="mb-6 line-clamp-3 leading-relaxed text-gray-700">
            {getShortDescription(specialty)}
          </p>
          <div className="flex items-center text-sm font-semibold text-primary-700">
            Saiba mais
            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
