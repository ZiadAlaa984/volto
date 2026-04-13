'use client'

interface StarRatingProps {
    rating: number
    maxRating?: number
}

export function StarRating({ rating, maxRating = 5 }: StarRatingProps) {
    return (
        <div className="flex gap-1">
            {Array.from({ length: maxRating }).map((_, index) => (
                <span
                    key={index}
                    className={`text-xl ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                    ★
                </span>
            ))}
        </div>
    )
}
