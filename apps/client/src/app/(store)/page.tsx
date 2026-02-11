'use client'

import { useEffect, useState } from 'react'

import { CTASection } from '@/components/landing/cta-section'
import { FeaturedCategories } from '@/components/landing/featured-categories'
import { FeaturedProducts } from '@/components/landing/featured-products'
import { HeroSection } from '@/components/landing/hero-section'
import { Testimonials } from '@/components/landing/testimonials'
import { categoriesApi } from '@/lib/api/categories'
import { productsApi } from '@/lib/api/products'
import type { Category, Product } from '@/types'

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    Promise.all([
      productsApi.list({ limit: 8, status: 'ACTIVE' }),
      categoriesApi.list(),
    ]).then(([productsRes, categoriesRes]) => {
      setProducts(productsRes.items)
      setCategories(categoriesRes)
    })
  }, [])

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
