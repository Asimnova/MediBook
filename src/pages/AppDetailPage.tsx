import { useState, useEffect } from 'react';
import {
  ArrowLeft, Download, Heart, Share2, Loader2, Star, Calendar,
  HardDrive, Tag, MessageSquare, Send,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from '@/lib/router';
import { useAuth } from '@/context/AuthContext';
import RatingStars from '@/components/ui/RatingStars';
import ReviewCard from '@/components/ui/ReviewCard';
import type { App, Category, Review } from '@/types';

export default function AppDetailPage({ id }: { id: string }) {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const [app, setApp] = useState<App | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: appData } = await supabase
        .from('apps')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!appData) {
        setLoading(false);
        return;
      }
      setApp(appData);

      if (appData.category_id) {
        const { data: cat } = await supabase
          .from('categories')
          .select('*')
          .eq('id', appData.category_id)
          .maybeSingle();
        setCategory(cat);
      }

      const { data: revData } = await supabase
        .from('reviews')
        .select('*')
        .eq('app_id', id)
        .order('created_at', { ascending: false });
      setReviews(revData ?? []);

      if (user) {
        const { data: fav } = await supabase
          .from('favorites')
          .select('id')
          .eq('app_id', id)
          .eq('user_id', user.id)
          .maybeSingle();
        setIsFavorite(!!fav);

        const { data: myReview } = await supabase
          .from('reviews')
          .select('*')
          .eq('app_id', id)
          .eq('user_id', user.id)
          .maybeSingle();
        if (myReview) {
          setUserReview(myReview);
          setReviewRating(myReview.rating);
          setReviewComment(myReview.comment);
        }
      }

      setLoading(false);
    }
    load();
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (isFavorite) {
      await supabase.from('favorites').delete().eq('app_id', id).eq('user_id', user.id);
      setIsFavorite(false);
    } else {
      await supabase.from('favorites').insert({ app_id: id });
      setIsFavorite(true);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError(null);
    if (!user) {
      navigate('/auth');
      return;
    }
    if (reviewRating === 0) {
      setReviewError('Please select a rating.');
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError('Please write a comment.');
      return;
    }
    setSubmitting(true);
    if (userReview) {
      const { data, error } = await supabase
        .from('reviews')
        .update({ rating: reviewRating, comment: reviewComment.trim() })
        .eq('id', userReview.id)
        .select('*')
        .single();
      if (!error && data) {
        setUserReview(data);
        setReviews((prev) => prev.map((r) => (r.id === data.id ? data : r)));
      }
    } else {
      const { data, error } = await supabase
        .from('reviews')
        .insert({ app_id: id, rating: reviewRating, comment: reviewComment.trim() })
        .select('*')
        .single();
      if (!error && data) {
        setUserReview(data);
        setReviews((prev) => [data, ...prev]);
      }
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="container-page py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-slate-900">App not found</h2>
        <button onClick={() => navigate('/')} className="btn-primary mt-6">
          Back to discover
        </button>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <button onClick={() => navigate('/')} className="btn-ghost mb-6 -ml-2">
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="card overflow-hidden">
            <img src={app.screenshot_url} alt={app.name} className="h-56 w-full object-cover" />
            <div className="p-6">
              <div className="flex items-start gap-4">
                <img src={app.icon_url} alt={app.name} className="h-20 w-20 rounded-2xl object-cover ring-2 ring-slate-100" />
                <div className="flex-1">
                  <h1 className="font-display text-2xl font-bold text-slate-900">{app.name}</h1>
                  <p className="text-brand-600">{app.developer}</p>
                  {category && (
                    <span className="chip mt-2 bg-slate-100 text-slate-600">{category.name}</span>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={toggleFavorite} className={isFavorite ? 'btn-primary' : 'btn-secondary'}>
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-white' : ''}`} />
                  {isFavorite ? 'Saved' : 'Save'}
                </button>
                <button className="btn-secondary">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
                <button className="btn-secondary">
                  <Download className="h-4 w-4" />
                  Get App
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat icon={Star} label="Rating" value={app.rating.toFixed(1)} />
                <Stat icon={Download} label="Downloads" value={app.downloads} />
                <Stat icon={HardDrive} label="Size" value={app.size} />
                <Stat icon={Tag} label="Version" value={app.version} />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card mt-6 p-6">
            <h2 className="font-display text-lg font-semibold text-slate-900">About this app</h2>
            <p className="mt-3 leading-relaxed text-slate-600">{app.description}</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
              <Calendar className="h-4 w-4" />
              Updated {new Date(app.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          {/* Reviews */}
          <div className="card mt-6 p-6">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900">
                <MessageSquare className="h-5 w-5 text-brand-500" />
                Reviews ({reviews.length})
              </h2>
              <div className="flex items-center gap-2">
                <RatingStars rating={app.rating} size={16} />
                <span className="text-sm font-semibold text-slate-700">{app.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Write review */}
            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              {user ? (
                <form onSubmit={submitReview} className="space-y-3">
                  <p className="text-sm font-medium text-slate-700">
                    {userReview ? 'Edit your review' : 'Write a review'}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Your rating:</span>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setReviewRating(i + 1)}
                        >
                          <Star
                            className={`h-6 w-6 transition-colors ${
                              i + 1 <= reviewRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-slate-200 text-slate-200 hover:fill-amber-200 hover:text-amber-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with this app..."
                    rows={3}
                    className="input resize-none"
                  />
                  {reviewError && <p className="text-xs text-rose-500">{reviewError}</p>}
                  <button type="submit" disabled={submitting} className="btn-primary">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {userReview ? 'Update Review' : 'Post Review'}
                  </button>
                </form>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-slate-500">Sign in to leave a review.</p>
                  <button onClick={() => navigate('/auth')} className="btn-secondary mt-3">
                    Sign In
                  </button>
                </div>
              )}
            </div>

            <div className="mt-5 space-y-4">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <ReviewCard key={rev.id} review={rev} />
                ))
              ) : (
                <p className="py-8 text-center text-sm text-slate-400">
                  No reviews yet. Be the first to review!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            <div className="card p-5">
              <h3 className="font-display text-base font-semibold text-slate-900">App info</h3>
              <dl className="mt-4 divide-y divide-slate-100">
                <InfoRow label="Developer" value={app.developer} />
                <InfoRow label="Category" value={category?.name ?? '—'} />
                <InfoRow label="Version" value={app.version} />
                <InfoRow label="Size" value={app.size} />
                <InfoRow label="Downloads" value={app.downloads} />
                <InfoRow label="Rating" value={`${app.rating.toFixed(1)} / 5.0`} />
              </dl>
            </div>
            <button onClick={toggleFavorite} className={isFavorite ? 'btn-primary w-full' : 'btn-secondary w-full'}>
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-white' : ''}`} />
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Star; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 text-center">
      <Icon className="mx-auto h-5 w-5 text-brand-500" />
      <p className="mt-1.5 text-sm font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-sm font-semibold text-slate-800">{value}</dd>
    </div>
  );
}
