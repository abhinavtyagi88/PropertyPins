import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"        
import type { Property } from "@/lib/types"  

export function AddPropertyForm({
  onCreated,
}: {
  onCreated: (p: Omit<Property, "id">) => Promise<void>
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [values, setValues] = useState<Omit<Property, "id">>({
    name: "",
    type: "",
    price: 0,
    location: "",
    description: "",
    lat: undefined,
    lng: undefined,
    imageUrl: "",
  })

  function update<K extends keyof Omit<Property, "id">>(key: K, val: Omit<Property, "id">[K]) {
    setValues((v) => ({ ...v, [key]: val }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!values.name || !values.type || !values.location || !values.price) {
      setError("Please fill name, type, price, and location.")
      return
    }
    setLoading(true)
    try {
      await onCreated(values)
      setValues({
        name: "",
        type: "",
        price: 0,
        location: "",
        description: "",
        lat: undefined,
        lng: undefined,
        imageUrl: "",
      })
    } catch (err: any) {
      setError(err?.message || "Failed to add property")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="sticky top-4 border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="text-balance">Add Property</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="name">Property Name</Label>
            <Input
              id="name"
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g., Lakeview Apartment"
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="type">Type</Label>
            <Input
              id="type"
              value={values.type}
              onChange={(e) => update("type", e.target.value)}
              placeholder="Apartment | House | Plot | Retail | Shed"
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="price">Price (USD)</Label>
            <Input
              id="price"
              type="number"
              value={values.price}
              onChange={(e) => update("price", Number(e.target.value))}
              min={0}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={values.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="City or Area"
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              value={values.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Short summary of the property"
              className="min-h-20"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-1">
              <Label htmlFor="lat">Latitude</Label>
              <Input
                id="lat"
                type="number"
                value={values.lat ?? ""}
                onChange={(e) => update("lat", e.target.value === "" ? undefined : Number(e.target.value))}
                step="0.0001"
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="lng">Longitude</Label>
              <Input
                id="lng"
                type="number"
                value={values.lng ?? ""}
                onChange={(e) => update("lng", e.target.value === "" ? undefined : Number(e.target.value))}
                step="0.0001"
              />
            </div>
          </div>
          <div className="grid gap-1">
            <Label htmlFor="img">Image URL (optional)</Label>
            <Input
              id="img"
              value={values.imageUrl || ""}
              onChange={(e) => update("imageUrl", e.target.value)}
              placeholder="/cozy-city-apartment.png"
            />
          </div>
          {error && (
            <p className="text-sm text-amber-600" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="mt-2 bg-teal-600 hover:bg-teal-700" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
