'use client'

import { useCategories, useProducts } from '@app/sdk'

import { CTASection } from '@/components/landing/cta-section'
import { FeaturedCategories } from '@/components/landing/featured-categories'
import { FeaturedProducts } from '@/components/landing/featured-products'
import { HeroSection } from '@/components/landing/hero-section'
import { Testimonials } from '@/components/landing/testimonials'

export default function HomePage() {
  const { data: productsData } = useProducts({ limit: 8, status: 'ACTIVE' })

  const { data: categoriesData } = useCategories()

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
