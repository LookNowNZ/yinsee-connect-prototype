"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TextButton } from "@/components/text-button"

interface ResetConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function ResetConfirmDialog({ open, onOpenChange, onConfirm }: ResetConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset app data?</DialogTitle>
          <DialogDescription>Removes local test data from this browser.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <TextButton onClick={handleCancel} className="text-muted-foreground hover:text-foreground">
            Cancel
          </TextButton>
          <TextButton
            onClick={handleConfirm}
            className="text-red-400 hover:text-red-300 hover:underline focus:ring-red-400/20 transition-all duration-160 ease-out"
            aria-label="Reset app data (local only)"
          >
            Reset now
          </TextButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
