import { Sparkles } from 'lucide-react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  variant?: 'dark' | 'light';
}

export function Logo({ size = 36, showText = true, variant = 'dark' }: LogoProps) {
  const textColor = variant === 'light' ? 'text-ivory-50' : 'text-ink-900';
  const subColor = variant === 'light' ? 'text-olive-300' : 'text-olive-600';
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-olive-600 to-olive-800 text-ivory-50 shadow-sm"
        style={{ width: size, height: size }}
      >
        <Sparkles size={size * 0.5} />
      </div>
      {showText && (
        <div className="leading-tight">
          <div className={`font-display text-lg font-bold tracking-tight ${textColor}`}>SIOT</div>
          <div className={`text-[10px] font-medium uppercase tracking-widest ${subColor}`}>
            Muse Hub
          </div>
        </div>
      )}
    </div>
  );
}
