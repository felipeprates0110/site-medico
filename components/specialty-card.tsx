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
      <Card className="h-full overflow-hidden rounded-2xl border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg">
        <CardContent className="p-8">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition-all duration-300 group-hover:bg-primary-600 group-hover:text-white">
              <Icon className="h-6 w-6" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-primary-700">
            {specialty.title}
          </h3>
          <p className="mb-6 line-clamp-3 leading-relaxed text-gray-600">
            {getShortDescription(specialty)}
          </p>
          <div className="flex items-center text-sm font-semibold text-primary-700">
            Saiba mais
            <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
