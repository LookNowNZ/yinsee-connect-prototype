"use client"

import { useState } from "react"
import { TextButton } from "@/components/text-button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface FeedbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  providerId: string
}

export function FeedbackDialog({ open, onOpenChange, providerId }: FeedbackDialogProps) {
  const [rating, setRating] = useState<string>("")
  const [comment, setComment] = useState("")
  const { toast } = useToast()

  const handleSubmit = () => {
    if (!rating) return

    const existingFeedback = JSON.parse(localStorage.getItem("yinsee_feedback") || "[]")
    const newFeedback = {
      providerId,
      rating: Number.parseInt(rating),
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    }
    existingFeedback.push(newFeedback)
    localStorage.setItem("yinsee_feedback", JSON.stringify(existingFeedback))

    toast({
      description: "Feedback submitted",
    })

    // Reset form
    setRating("")
    setComment("")
    onOpenChange(false)
  }

  const handleSkip = () => {
    // Reset form
    setRating("")
    setComment("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave feedback</DialogTitle>
          <DialogDescription>Rate your experience and optionally add a short comment.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Rating</label>
            <Select value={rating} onValueChange={setRating}>
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a short comment (optional)"
              maxLength={200}
              className="resize-none"
            />
            <p className="text-xs text-muted mt-1">{comment.length}/200 characters</p>
          </div>
        </div>

        <DialogFooter>
          <TextButton onClick={handleSkip} className="text-muted-foreground hover:text-foreground">
            Skip
          </TextButton>
          <TextButton onClick={handleSubmit} disabled={!rating} className="text-accent hover:text-accent/80">
            Submit
          </TextButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
