interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    image: string;
  };
  booking: {
    scheduledAt: string;
  };
}

interface ReviewListProps {
  reviews: Review[];
  formatDate: (dateString: string) => string;
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, formatDate }) => {
  return (
    <div className="space-y-6">
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                {review.user.image ? (
                  <img 
                    src={review.user.image} 
                    alt={review.user.name} 
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                    {review.user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                      {review.user.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(review.createdAt)}
                      {review.booking?.scheduledAt && (
                        <> • Session on {formatDate(review.booking.scheduledAt)}</>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full border border-yellow-100 dark:border-yellow-800">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                    <span className="text-sm font-bold text-gray-900 dark:text-white ml-1">{review.rating}</span>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                  {review.comment}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No reviews yet for this tutor.</p>
        </div>
      )}
    </div>
  );
};