"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useLocale } from "@/components/LocaleProvider";
import { Review, ReviewsResponse } from "@/lib/types";
import ReviewForm from "./ReviewForm";
import { Button } from "@/components/ui/button";

type Props = {
  productId: string;
};

export default function ProductReviews({ productId }: Props) {
  const { t } = useLocale();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedStars, setSelectedStars] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(
    async (stars?: number | null, pageNum: number = 1) => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (stars !== null && stars !== undefined) {
          params.set("stars", stars.toString());
        }
        params.set("page", pageNum.toString());
        params.set("limit", limit.toString());

        const res = await fetch(
          `/api/products/${productId}/reviews?${params.toString()}`
        );

        if (!res.ok) {
          throw new Error("Failed to load reviews");
        }

        const data: ReviewsResponse = await res.json();
        setReviews(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setPage(data.page);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reviews");
      } finally {
        setIsLoading(false);
      }
    },
    [productId, limit]
  );

  useEffect(() => {
    setSelectedStars(null);
    setPage(1);
    setReviews([]);
    fetchReviews(null, 1);
  }, [productId, fetchReviews]);

  const handleFilterChange = (stars: number | null) => {
    setSelectedStars(stars);
    setPage(1);
    fetchReviews(stars, 1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchReviews(selectedStars, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReviewSubmitted = () => {
    window.location.reload();
  };

  return (
    <div id="reviews-section" className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-(--dialog-text-color)">
          {t.review.reviews}
        </h2>
        {total > 0 && (
          <span className="text-sm text-(--dialog-link-secondary-color)">
            {total}{" "}
            {total === 1 ? t.review.reviews.slice(0, -1) : t.review.reviews}
          </span>
        )}
      </div>

      <div className="rounded-2xl border border-(--dialog-separator-color) bg-(--dialog-card-background-color) p-6">
        <ReviewForm
          productId={productId}
          onReviewSubmitted={handleReviewSubmitted}
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-(--dialog-text-color)">
            {t.review.filterByRating}:
          </span>
          <button
            onClick={() => handleFilterChange(null)}
            className={`rounded-lg border px-3 py-1 text-sm font-medium transition ${
              selectedStars === null
                ? "border-(--dialog-button-accept-all-color) bg-(--dialog-button-accept-all-color) text-(--dialog-button-accept-all-text-color)"
                : "border-(--dialog-separator-color) bg-white text-(--dialog-text-color) hover:bg-(--dialog-card-background-color)"
            }`}
          >
            {t.review.all}
          </button>
          {[5, 4, 3, 2, 1].map((starValue) => (
            <button
              key={starValue}
              onClick={() => handleFilterChange(starValue)}
              className={`flex cursor-pointer items-center gap-1 rounded-lg border px-3 py-1 text-sm font-medium transition ${
                selectedStars === starValue
                  ? "border-(--dialog-button-accept-all-color) bg-(--dialog-button-accept-all-color) text-(--dialog-button-accept-all-text-color)"
                  : "border-(--dialog-separator-color) bg-white text-(--dialog-text-color) hover:bg-(--dialog-card-background-color)"
              }`}
            >
              <Star
                weight={selectedStars === starValue ? "fill" : "regular"}
                className="h-4 w-4 text-amber-500"
              />
              {starValue}
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="text-base text-(--dialog-link-secondary-color)">
            {t.review.loading}
          </p>
        ) : reviews.length === 0 ? (
          <p className="text-base text-(--dialog-link-secondary-color)">
            {selectedStars !== null
              ? t.review.noReviewsWithFilter
              : t.review.noReviews}
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="rounded-2xl border border-(--dialog-separator-color) bg-(--dialog-card-background-color) p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-(--dialog-text-color)">
                      {review.name}
                    </span>
                    <span className="text-sm text-(--dialog-link-secondary-color)">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        weight={i < review.stars ? "fill" : "regular"}
                        className="h-4 w-4"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-(--dialog-link-secondary-color)">
                    {review.text}
                  </p>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col gap-4 border-t border-(--dialog-separator-color) pt-6">
                <nav
                  className="flex items-center justify-center gap-2"
                  aria-label={t.catalog.paginationAria}
                >
                  {page > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => handlePageChange(page - 1)}
                    >
                      <CaretLeft weight="bold" className="h-4 w-4" />
                      {t.catalog.previous}
                    </Button>
                  )}

                  {(() => {
                    const maxVisible = 5;
                    let startPage = Math.max(
                      1,
                      page - Math.floor(maxVisible / 2)
                    );
                    const endPage = Math.min(
                      totalPages,
                      startPage + maxVisible - 1
                    );

                    if (endPage - startPage < maxVisible - 1) {
                      startPage = Math.max(1, endPage - maxVisible + 1);
                    }

                    const pages = [];
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(i);
                    }

                    return (
                      <>
                        {startPage > 1 && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="cursor-pointer"
                              onClick={() => handlePageChange(1)}
                            >
                              1
                            </Button>
                            {startPage > 2 && (
                              <span className="px-2 font-medium text-(--dialog-link-secondary-color)">
                                ...
                              </span>
                            )}
                          </>
                        )}

                        {pages.map((pageNum) => (
                          <Button
                            key={pageNum}
                            variant={pageNum === page ? "default" : "outline"}
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => handlePageChange(pageNum)}
                            aria-current={pageNum === page ? "page" : undefined}
                          >
                            {pageNum}
                          </Button>
                        ))}

                        {endPage < totalPages && (
                          <>
                            {endPage < totalPages - 1 && (
                              <span className="px-2 font-medium text-(--dialog-link-secondary-color)">
                                ...
                              </span>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="cursor-pointer"
                              onClick={() => handlePageChange(totalPages)}
                            >
                              {totalPages}
                            </Button>
                          </>
                        )}
                      </>
                    );
                  })()}

                  {page < totalPages && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => handlePageChange(page + 1)}
                    >
                      {t.catalog.next}
                      <CaretRight weight="bold" className="h-4 w-4" />
                    </Button>
                  )}
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
