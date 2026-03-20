'use client'

import { useQuery } from '@tanstack/react-query'

import { CTASection } from '@/components/landing/cta-section'
import { FeaturedCategories } from '@/components/landing/featured-categories'
import { FeaturedProducts } from '@/components/landing/featured-products'
import { HeroSection } from '@/components/landing/hero-section'
import { Testimonials } from '@/components/landing/testimonials'
import { categoriesApi } from '@/lib/api/categories'
import { productsApi } from '@/lib/api/products'

export default function HomePage() {
  const { data: productsData } = useQuery({
    queryKey: ['products', { limit: 8, status: 'ACTIVE' }],
    queryFn: () => productsApi.list({ limit: 8, status: 'ACTIVE' }),
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.list(),
  })

  const products = productsData?.items ?? []
  const categories = categoriesData ?? []

  return (
    <>
      <HeroSection />
      <FeaturedCategories categories={categories} />
      <FeaturedProducts products={products} />
      <Testimonials />
      <CTASection />
    </>
  )
}
