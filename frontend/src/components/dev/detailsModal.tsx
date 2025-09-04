import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { Property } from "@/lib/types"

function MapEmbed({ lat, lng }: { lat?: number; lng?: number }) {
  if (lat === undefined || lng === undefined) {
    return (
      <div className="rounded-md border bg-slate-50 text-slate-500 p-4 text-sm">
        Coordinates not provided for this property.
      </div>
    )
  }

  // Tiny bbox around marker for OSM embed
  const delta = 0.02
  const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join("%2C")
  const marker = `${lat}%2C${lng}`

  return (
    <iframe
      title="Map"
      className="w-full h-56 rounded-md border"
      src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`}
    />
  )
}

export function DetailsModal({
  open,
  onOpenChange,
  item,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  item?: Property
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-balance">
            {item?.name} — {item?.location}
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Type: {item?.type} • Price:{" "}
            {item?.price?.toLocaleString(undefined, {
              style: "currency",
              currency: "USD",
            })}
          </DialogDescription>
        </DialogHeader>
        {item && (
          <div className="mb-4 text-sm text-slate-700 space-y-4">
            
            <div className="grid gap-4 md:grid-cols-2">
              <img
                src={item.imageUrl || "/placeholder.svg?height=240&width=400&query=Property%20detail"}
                alt={`${item.name} image`}
                className="w-full h-48 md:h-56 rounded-md object-cover"
            />
            <div className="space-y-3">
              <MapEmbed lat={item.lat} lng={item.lng} />
            </div>
          </div>
          <p className="text-pretty text-sm leading-relaxed ">
              {item.description || "No description provided."}
          </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
