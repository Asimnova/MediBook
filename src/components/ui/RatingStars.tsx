import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  size?: number;
  showValue?: boolean;
  count?: number;
}

export default function RatingStars({ rating, size = 16, showValue = false, count }: RatingStarsProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => {
          const filled = i + 1 <= Math.round(rating);
          const half = !filled && i + 0.5 <= rating;
          return (
            <Star
              key={i}
              style={{ width: size, height: size }}
              className={
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : half
                    ? 'fill-amber-200 text-amber-400'
                    : 'fill-slate-200 text-slate-200'
              }
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-slate-700">{rating.toFixed(1)}</span>
      )}
      {count !== undefined && (
        <span className="text-xs text-slate-400">({count.toLocaleString()})</span>
      )}
    </div>
  );
}
