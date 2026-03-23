'use client'

import { useGetCategories, useGetProducts } from '@app/sdk'

import { CTASection } from '@/components/landing/cta-section'
import { FeaturedCategories } from '@/components/landing/featured-categories'
import { FeaturedProducts } from '@/components/landing/featured-products'
import { HeroSection } from '@/components/landing/hero-section'
import { Testimonials } from '@/components/landing/testimonials'

export default function HomePage() {
  const { data: productsData } = useGetProducts({ limit: 8, status: 'ACTIVE' })

  const { data: categoriesData } = useGetCategories()

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
