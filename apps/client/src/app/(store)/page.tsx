'use client'

import { useGetCategories, useGetProducts } from '@app/sdk'

import { CTASection } from '@/components/landing/CtaSection'
import { FeaturedCategories } from '@/components/landing/FeaturedCategories'
import { FeaturedProducts } from '@/components/landing/FeaturedProducts'
import { HeroSection } from '@/components/landing/HeroSection'
import { Testimonials } from '@/components/landing/Testimonials'

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
