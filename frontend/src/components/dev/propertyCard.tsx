import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Property } from "@/lib/types"
import { useRef } from "react"

function currency(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" })
}

export function PropertyCard({
  item,
  onView,
}: {
  item: Property
  onView: (p: Property) => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <Card
      ref={ref}
      className="transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg border-slate-200 dark:border-slate-800"
      aria-label={`${item.name} in ${item.location}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-balance text-slate-900 dark:text-white">{item.name}</CardTitle>
        <div className="text-xs text-slate-500">
          {item.type} | {item.location}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <img
          src={item.imageUrl || "/placeholder.svg?height=160&width=320&query=Property"}
          alt={`${item.name} preview`}
          className="w-full h-40 rounded-md object-cover"
        />
        <p className="text-sm text-pretty text-slate-600 line-clamp-2">
          {item.description || "No description provided."}
        </p>
        <div className="flex items-center justify-between pt-2">
          <span className="font-semibold text-teal-600">{currency(item.price)}</span>
          <Button variant="default" onClick={() => onView(item)} className="bg-teal-600 hover:bg-teal-700">
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
