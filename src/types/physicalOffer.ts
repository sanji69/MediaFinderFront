export interface PhysicalOffer {
  title: string
  provider: string
  imageUrl: string | null
  url: string
  price: number
  currency: string
  shippingPrice: number | null
  condition: string | null
  format: string | null
  offerType: string
}