"use client"

import type React from "react"

import { useState } from "react"
import { Star, User } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock review data
const MOCK_REVIEWS = [
  {
    id: "1",
    name: "Sarah Johnson",
    rating: 5,
    date: "2023-12-15",
    comment: "Love this product! The quality is excellent and it fits perfectly. Will definitely buy more colors.",
    verified: true,
  },
  {
    id: "2",
    name: "Michael Chen",
    rating: 4,
    date: "2023-11-28",
    comment:
      "Great product overall. The material is comfortable and durable. Only giving 4 stars because the color was slightly different than pictured.",
    verified: true,
  },
  {
    id: "3",
    name: "Jessica Williams",
    rating: 5,
    date: "2023-10-10",
    comment:
      "Absolutely perfect! Exceeded my expectations in every way. The fabric is so soft and the design is exactly what I wanted.",
    verified: false,
  },
]

interface ProductReviewsProps {
  productId: string
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews] = useState(MOCK_REVIEWS)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: "",
  })

  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send this to your API
    console.log("Submitting review:", newReview)

    // Reset form and hide it
    setNewReview({
      name: "",
      email: "",
      rating: 5,
      comment: "",
    })
    setShowReviewForm(false)

    // Show success message (in a real app)
    alert("Thank you for your review! It will be published after moderation.")
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

      {/* Review Summary */}
      <div className="flex items-center mb-6">
        <div className="flex items-center mr-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-5 w-5 ${star <= Math.round(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>
        <span className="text-lg font-medium">{averageRating.toFixed(1)} out of 5</span>
        <span className="text-muted-foreground ml-2">({reviews.length} reviews)</span>
      </div>

      {/* Write a Review Button */}
      {!showReviewForm && (
        <Button onClick={() => setShowReviewForm(true)} className="mb-8">
          Write a Review
        </Button>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <div className="border rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                  value={newReview.email}
                  onChange={(e) => setNewReview({ ...newReview, email: e.target.value })}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Rating</label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="p-1"
                  >
                    <Star
                      className={`h-6 w-6 ${star <= newReview.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium mb-1">
                Review
              </label>
              <textarea
                id="comment"
                rows={4}
                className="w-full px-3 py-2 border rounded-md"
                required
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              ></textarea>
            </div>

            <div className="flex gap-2">
              <Button type="submit">Submit Review</Button>
              <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6 last:border-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{review.name}</span>
                    {review.verified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Verified Purchase</span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{new Date(review.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-muted-foreground">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

