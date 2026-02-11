'use client'

import { HStack, Input, Stack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import {
  NativeSelectField,
  NativeSelectRoot,
} from '@/components/ui/native-select'
import { categoriesApi } from '@/lib/api/categories'
import type { Category } from '@/types'

interface ProductFiltersProps {
  search?: string
  categoryId?: string
  filamentType?: string
  sortBy?: string
  onFilterChange: (filters: Record<string, string>) => void
}

const FILAMENT_TYPES = ['PLA', 'ABS', 'PETG', 'TPU', 'Nylon', 'Resin', 'Other']

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'name', label: 'Name (A-Z)' },
]

export function ProductFilters({
  search = '',
  categoryId = '',
  filamentType = '',
  sortBy = 'newest',
  onFilterChange,
}: ProductFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    categoriesApi
      .list()
      .then(setCategories)
      .catch(() => {})
  }, [])

  return (
    <Stack direction={{ base: 'column', md: 'row' }} gap={'4'} w={'full'}>
      <Input
        placeholder={'Search products...'}
        defaultValue={search}
        onChange={(e) => onFilterChange({ search: e.target.value })}
      />
      <HStack gap={'4'} flexShrink={0}>
        <NativeSelectRoot size={'md'} w={'auto'} minW={'150px'}>
          <NativeSelectField
            value={categoryId}
            onChange={(e) => onFilterChange({ categoryId: e.target.value })}
          >
            <option value={''}>All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </NativeSelectField>
        </NativeSelectRoot>

        <NativeSelectRoot size={'md'} w={'auto'} minW={'130px'}>
          <NativeSelectField
            value={filamentType}
            onChange={(e) => onFilterChange({ filamentType: e.target.value })}
          >
            <option value={''}>All Materials</option>
            {FILAMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </NativeSelectField>
        </NativeSelectRoot>

        <NativeSelectRoot size={'md'} w={'auto'} minW={'130px'}>
          <NativeSelectField
            value={sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value })}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </NativeSelectField>
        </NativeSelectRoot>
      </HStack>
    </Stack>
  )
}
