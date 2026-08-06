import Link from "next/link";
import type { ComponentType } from "react";
import { ChevronRight, Heart, Activity, Zap, Shield, User, Stethoscope, Pill } from "lucide-react";
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
  const href = `/especialidades/${specialty.slug}`;

  return (
    <Card className="group h-full overflow-hidden rounded-2xl border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg">
      <CardContent className="flex h-full flex-col p-8">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition-all duration-300 group-hover:bg-primary-600 group-hover:text-white">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mb-3 text-xl font-bold text-gray-900">
          <Link
            href={href}
            className="transition-colors duration-300 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            {specialty.title}
          </Link>
        </h3>
        <p className="mb-6 flex-1 leading-relaxed text-gray-600">
          {getShortDescription(specialty)}
        </p>
        <Link
          href={href}
          className="inline-flex items-center text-sm font-semibold text-primary-700 transition-colors duration-300 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          Saiba mais
          <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </CardContent>
    </Card>
  );
}
