import type { ZodUUID } from "zod/v4"
export interface Room{
   id: string
    slug: string
    name: string
    category: string
    tagline: string | null
    description: string | null
    overview: string | null
    price_per_night: number
    price_naira_per_night: number
    capacity: number
    bed_type: string
    size: number
    floor: string
    units: number
    image: string | null
    gallery: string[] | null
    amenities: any | null
    features: string[] | null

}