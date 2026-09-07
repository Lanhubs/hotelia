import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Plane, UtensilsCrossed, TrendingUp, Sparkles, BedDouble, X, ArrowUpRight, Check, DollarSign, ChevronRight } from 'lucide-react';

interface KPIStat {
  label: string;
  value: string | number;
  icon: 'bed' | 'x' | 'arrowUp' | 'check' | 'dollar' | 'checkAlt';
  iconColor?: string;
}

interface KPICardProps {
  title: string;
  icon: 'occupancy' | 'travel' | 'catering';
  mainValue: string | number;
  mainUnit?: string;
  subtitle?: string;
  highlightText?: string;
  highlightIcon?: 'trending' | 'sparkles';
  stats: KPIStat[];
  linkText: string;
  linkTo: string;
}

const iconMap = {
  occupancy: Car,
  travel: Plane,
  catering: UtensilsCrossed,
};

const statIconMap = {
  bed: BedDouble,
  x: X,
  arrowUp: ArrowUpRight,
  check: Check,
  dollar: DollarSign,
  checkAlt: Check,
};

export const KPICard: React.FC<KPICardProps> = ({
  title,
  icon,
  mainValue,
  mainUnit,
  subtitle,
  highlightText,
  highlightIcon,
  stats,
  linkText,
  linkTo,
}) => {
  const IconComponent = iconMap[icon];
  const HighlightIcon = highlightIcon === 'trending' ? TrendingUp : Sparkles;

  return (
    <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-zinc-600">{title}</span>
        <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500">
          <IconComponent className="w-3.5 h-3.5" />
        </div>
      </div>

      <div>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-zinc-900 tracking-tight">{mainValue}</span>
          {mainUnit && <span className="text-sm font-medium text-zinc-400 ml-1">{mainUnit}</span>}
        </div>
        {subtitle && <div className="text-xs text-zinc-400 font-normal mt-0.5">{subtitle}</div>}
        {highlightText && (
          <div className="text-xs font-semibold text-indigo-600 flex items-center gap-1 mt-0.5">
            <HighlightIcon className="w-3 h-3" />
            <span>{highlightText}</span>
          </div>
        )}
      </div>

      <div className="space-y-1.5 pt-1">
       
        {stats?.map((stat, idx) => {
          const StatIcon = statIconMap[stat.icon];
          return (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-zinc-600">
                <StatIcon className={`w-3.5 h-3.5 ${stat.iconColor || 'text-zinc-500'}`} />
                <span>{stat.label}</span>
              </div>
              <span className="font-bold text-zinc-900">{stat.value}</span>
            </div>
          );
        })}
      </div>

      <div className="pt-2 border-t border-zinc-100">
        <Link
          to={linkTo}
          className="text-xs font-semibold text-ink hover:text-indigo-700 flex items-center justify-between group cursor-pointer"
        >
          <span>{linkText}</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
};