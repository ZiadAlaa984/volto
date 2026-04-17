'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'
import { StarRating } from '@/components/shared/star-rating'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useReviews } from '@/hooks/useReviews'
import ReqStatus from '@/components/shared/ReqStatus'
import AlertDialogShared from '@/components/shared/AlertDialogShared'
import { formatDate } from '@/lib/utils'




/**
 * Builds a smart page-number list with ellipsis truncation.
 * Always shows first, last, current ± 1, and ellipsis in between.
 */
function buildPageRange(current: number, total: number): (number | 'ellipsis-start' | 'ellipsis-end')[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

    const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = []
    const showLeft = current > 3
    const showRight = current < total - 2

    pages.push(1)

    if (showLeft) pages.push('ellipsis-start')

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) pages.push(i)

    if (showRight) pages.push('ellipsis-end')

    pages.push(total)
    return pages
}

// ── Component ────────────────────────────────────────────────────────────────

function ReviewsTab({ activeReviews, cardId }: { activeReviews: boolean, cardId: string | undefined }) {
    const [page, setPage] = useState(1)
    const { reviewsData, isLoading, deleteReview, isPending, error } = useReviews({ cardId, page, onPageChange: setPage, activeReviews })

    const reviews = reviewsData?.data ?? []
    const totalPages = reviewsData?.totalPages ?? 1
    const currentPage = reviewsData?.currentPage ?? 1

    const pageRange = buildPageRange(currentPage, totalPages)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Reviews</CardTitle>
                <CardDescription>Manage your reviews here</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Reviews</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <ReqStatus
                            loading={isLoading}
                            error={error}
                            length={reviews.length}
                            colSpan={4}
                            emptyText="No reviews found"
                        >
                            {reviews.map((review) => {
                                return (
                                    <TableRow key={review.id}>
                                        {/* Customer */}
                                        <TableCell className='flex items-center gap-2'>
                                            {review.customer_name}
                                        </TableCell>

                                        {/* Reviews: stars + text + thumbnails */}
                                        <TableCell>
                                            <div className="flex flex-col gap-1 max-w-md">
                                                <StarRating rating={review.rating} />
                                                {review.review_text && (
                                                    <p className="text-sm  line-clamp-2">
                                                        {review.review_text}
                                                    </p>
                                                )}

                                            </div>
                                        </TableCell>

                                        {/* Time — handles both timestamp and plain text */}
                                        <TableCell>{formatDate(review.created_at)}</TableCell>

                                        {/* Action */}
                                        <TableCell>
                                            <AlertDialogShared
                                                title="Delete Review"
                                                description="Are you sure you want to delete this review?"
                                                actionText="Delete"
                                                disabled={isPending}
                                                onClick={() => deleteReview(review.id)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </ReqStatus>
                    </TableBody>
                </Table>

                {/* Pagination with ellipsis */}
                {totalPages > 1 && (
                    <Pagination className="mt-4">
                        <PaginationContent>
                            {/* Previous */}
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={(e) => {
                                        e.preventDefault()
                                        if (currentPage > 1) setPage(currentPage - 1)
                                    }}
                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>

                            {/* Page numbers with ellipsis */}
                            {pageRange.map((item, idx) => {
                                if (item === 'ellipsis-start' || item === 'ellipsis-end') {
                                    return (
                                        <PaginationItem key={item}>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    )
                                }
                                return (
                                    <PaginationItem key={item}>
                                        <PaginationLink
                                            className="cursor-pointer"
                                            isActive={item === currentPage}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setPage(item)
                                            }}
                                        >
                                            {item}
                                        </PaginationLink>
                                    </PaginationItem>
                                )
                            })}

                            {/* Next */}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={(e) => {
                                        e.preventDefault()
                                        if (currentPage < totalPages) setPage(currentPage + 1)
                                    }}
                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </CardContent>
        </Card>
    )
}

export default ReviewsTab