import React from 'react'

function ReviewsTab() {
    // create a table reviews
    // example data
    const reviews = [
        {
            id: 1,
            Customer: "John Doe",
            rating: 5,
            Review: "Great service",
            created_at: "2022-01-01",
        },
        {
            id: 2,
            Customer: "Jane Doe",
            rating: 4,
            Review: "Good service",
            created_at: "2022-01-01",
        },
    ]
    // create table shadcn component
    // link table from shoogle 
    https://shoogle.dev/search?q=table&tab=search&preview=https%3A%2F%2Fwww.shadcnblocks.com%2Fexplorer%2Fcomponents%3Fgroup%3Dtable%26gridSize%3D2
    // Customer, rating, review, time, action (delete);


    return (
        <div>ReviewsTab</div>
    )
}

export default ReviewsTab