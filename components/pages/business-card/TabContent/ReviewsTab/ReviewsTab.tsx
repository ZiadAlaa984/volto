'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
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
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { StarRating } from '@/components/shared/star-rating'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useReviews } from '@/hooks/useReviews'
import ReqStatus from '@/components/shared/ReqStatus'
import AlertDialogShared from '@/components/shared/AlertDialogShared'

function ReviewsTab({ cardId }: { cardId: string | undefined }) {
    const [page, setPage] = useState(1)  // ← 1. add page state

    const { reviewsData, isLoading, deleteReview, isPending, error } = useReviews(cardId, page)  // ← 2. pass page
    console.log("🚀 ~ ReviewsTab ~ reviewsData:", reviewsData)

    const reviews = reviewsData?.data ?? []
    const totalPages = reviewsData?.totalPages ?? 1
    const currentPage = reviewsData?.currentPage ?? 1

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
                            {reviews.map((review) => (
                                <TableRow key={review.id}>
                                    <TableCell>{review.customer_name}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 max-w-md">
                                            <StarRating rating={review.rating} />
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {review.review_text}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(review.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </TableCell>
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
                            ))}
                        </ReqStatus>
                    </TableBody>
                </Table>

                {totalPages > 1 && (
                    <Pagination className="mt-4">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        if (currentPage > 1) setPage(currentPage - 1)
                                    }}
                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>

                            {Array.from({ length: totalPages }).map((_, index) => {
                                const pageNumber = index + 1
                                return (
                                    <PaginationItem key={pageNumber}>
                                        <PaginationLink
                                            href="#"
                                            isActive={pageNumber === currentPage}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setPage(pageNumber)
                                            }}
                                        >
                                            {pageNumber}
                                        </PaginationLink>
                                    </PaginationItem>
                                )
                            })}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        if (currentPage < totalPages) setPage(currentPage + 1)  // ← 3. wire up
                                    }}
                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
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