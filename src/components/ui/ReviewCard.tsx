import type { Review } from '@/types';
import RatingStars from './RatingStars';

interface ReviewCardProps {
  review: Review;
  userEmail?: string;
}

export default function ReviewCard({ review, userEmail }: ReviewCardProps) {
  const displayName = userEmail ? userEmail.split('@')[0] : 'Anonymous';
  const date = new Date(review.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="rounded-xl border border-slate-100 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-display text-sm font-bold text-brand-700">
            {displayName.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="text-sm font-semibold capitalize text-slate-800">{displayName}</p>
            <p className="text-xs text-slate-400">{date}</p>
          </div>
        </div>
        <RatingStars rating={review.rating} size={14} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{review.comment}</p>
    </div>
  );
}
