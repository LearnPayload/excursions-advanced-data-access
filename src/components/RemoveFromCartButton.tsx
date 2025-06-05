'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { removeFromCartAction } from '@/forms/cart/actions'

interface RemoveFromCartButtonProps {
  cartItemId: number
}

export function RemoveFromCartButton({ cartItemId }: RemoveFromCartButtonProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleRemove = () => {
    startTransition(async () => {
      await removeFromCartAction(cartItemId)
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleRemove}
      disabled={isPending}
      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="Remove from cart"
    >
      <Trash2 className="h-5 w-5" />
    </button>
  )
}