import React from "react"
import { useMemo, useState, useEffect } from "react"
import { PropertyCard } from "@/components/dev/propertyCard"
import { AddPropertyForm } from "@/components/dev/addPropertyForm"
import { DetailsModal } from "@/components/dev/detailsModal"
import type { Property } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search } from "lucide-react"
import { toast } from "sonner"

export default function Page() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Property | undefined>(undefined)
  const [query, setQuery] = useState("")
  const [type, setType] = useState("all")
  const [openAdd, setOpenAdd] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch properties from API
  async function fetchProperties() {
    try {
      setLoading(true)
      const res = await fetch("http://localhost:5000/api/properties")
      if (!res.ok) throw new Error("Failed to load properties")
      const data = await res.json()
      setProperties(data)
    } catch (err) {
      toast.error("Could not load properties.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  // POST handled locally in this file
  async function addProperty(payload: any) {
    const res = await fetch("http://localhost:5000/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      throw new Error("Failed to create property")
    }
    // Refresh list after adding
    await fetchProperties()
  }

  const types = useMemo(() => ["all", ...Array.from(new Set(properties.map((p) => p.type))).sort()], [properties])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return properties.filter((p) => {
      const matchesType = type === "all" || p.type.toLowerCase() === type.toLowerCase()
      const matchesQ = !q || p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)
      return matchesType && matchesQ
    })
  }, [properties, query, type])

  return (
    <main className="mx-auto max-w-6xl p-4 md:p-6">
      <header className="flex items-center justify-between pb-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-balance">Property Listing Dashboard</h1>
      </header>

      <section className="space-y-4">

        {/* Inline Filters: search with type select */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search by name or location</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or location"
              className="w-full rounded-md border bg-background px-9 py-2 text-sm outline-none ring-primary focus:ring-2"
              type="search"
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="text-xs text-slate-600">Filter by type</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-md border bg-background px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t[0].toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 rounded-md border animate-pulse bg-slate-50" />
            ))
          ) : filtered.length ? (
            filtered.map((p) => <PropertyCard key={p._id} item={p} onView={setSelected} />)
          ) : (
            <p className="text-sm text-slate-600">No properties match your filters.</p>
          )}
        </div>
      </section>

      <DetailsModal open={!!selected} onOpenChange={(v) => !v && setSelected(undefined)} item={selected} />

      {/* Floating + button and Add dialog */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogTrigger asChild>
          <Button
            aria-label="Add property"
            className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-50 h-12 w-1/12 rounded-5 p-0 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2"
          >
            <Plus className="h-6 w-6" />
            <span className=""> Add property </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add a new property</DialogTitle>
          </DialogHeader>
          <AddPropertyForm
            onCreated={async (payload) => {
              try {
                setIsSubmitting(true)
                await addProperty(payload)
                toast.success("Property added successfully")
                setOpenAdd(false) // close dialog on success
              } catch {
                toast.error("Could not create property. Try again later.")
              } finally {
                setIsSubmitting(false)
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </main>
  )
}
