"use client";

import { useState, FormEvent } from "react";
import { Star } from "@phosphor-icons/react";
import { useLocale } from "@/components/LocaleProvider";

type Props = {
  productId: string;
  onReviewSubmitted: () => void;
};

export default function ReviewForm({ productId, onReviewSubmitted }: Props) {
  const { t } = useLocale();
  const [name, setName] = useState("");
  const [stars, setStars] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    stars?: string;
    text?: string;
  }>({});

  const validate = () => {
    const errors: typeof fieldErrors = {};
    let isValid = true;

    if (!name.trim()) {
      errors.name = t.review.nameRequired;
      isValid = false;
    }

    if (stars < 1 || stars > 5) {
      errors.stars = t.review.starsRequired;
      isValid = false;
    }

    if (!text.trim()) {
      errors.text = t.review.textRequired;
      isValid = false;
    } else if (text.trim().length < 5) {
      errors.text = t.review.textMinLength;
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const base =
        process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
        "http://127.0.0.1:3000";
      const res = await fetch(`${base}/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          stars,
          text: text.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400) {
          if (Array.isArray(data.message)) {
            setError(data.message.join(", "));
          } else {
            setError(data.message || t.review.validationError);
          }
        } else if (res.status === 404) {
          setError(t.review.productNotFound);
        } else {
          setError(data.message || t.review.submitError);
        }
        setIsSubmitting(false);
        return;
      }

      if (data.ok && data.review) {
        onReviewSubmitted();
        setName("");
        setStars(0);
        setText("");
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.review.submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-(--dialog-text-color)">
        {t.review.writeReview}
      </h3>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label
          htmlFor="review-name"
          className="text-sm font-medium text-(--dialog-text-color)"
        >
          {t.review.nameLabel} *
        </label>
        <input
          id="review-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-(--dialog-separator-color) bg-white px-4 py-2 text-sm text-(--dialog-text-color) focus:border-(--dialog-button-accept-all-color) focus:outline-none"
          placeholder={t.review.namePlaceholder}
          disabled={isSubmitting}
        />
        {fieldErrors.name && (
          <p className="text-xs text-red-600">{fieldErrors.name}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-(--dialog-text-color)">
          {t.review.ratingLabel} *
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((starValue) => (
            <button
              key={starValue}
              type="button"
              onClick={() => setStars(starValue)}
              onMouseEnter={() => setHoveredStar(starValue)}
              onMouseLeave={() => setHoveredStar(0)}
              className="cursor-pointer transition-transform hover:scale-110"
              disabled={isSubmitting}
              aria-label={`${starValue} ${starValue === 1 ? "star" : "stars"}`}
            >
              <Star
                weight={
                  starValue <= (hoveredStar || stars) ? "fill" : "regular"
                }
                className="h-6 w-6 text-amber-500"
              />
            </button>
          ))}
          {stars > 0 && (
            <span className="ml-2 text-sm font-medium text-(--dialog-text-color)">
              {stars} / 5
            </span>
          )}
        </div>
        {fieldErrors.stars && (
          <p className="text-xs text-red-600">{fieldErrors.stars}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="review-text"
          className="text-sm font-medium text-(--dialog-text-color)"
        >
          {t.review.textLabel} *
        </label>
        <textarea
          id="review-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="rounded-lg border border-(--dialog-separator-color) bg-white px-4 py-2 text-sm text-(--dialog-text-color) focus:border-(--dialog-button-accept-all-color) focus:outline-none resize-none"
          placeholder={t.review.textPlaceholder}
          disabled={isSubmitting}
        />
        {fieldErrors.text && (
          <p className="text-xs text-red-600">{fieldErrors.text}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-fit cursor-pointer rounded-lg bg-(--dialog-button-accept-all-color) px-6 py-2 text-sm font-semibold text-(--dialog-button-accept-all-text-color) transition hover:bg-(--dialog-button-accept-all-color-hover) disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? t.review.submitting : t.review.submit}
      </button>
    </form>
  );
}
