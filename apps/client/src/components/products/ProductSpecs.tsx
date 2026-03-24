'use client'

import type { Product } from '@app/sdk'
import { Table } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'

interface ProductSpecsProps {
  product: Product
}

export function ProductSpecs({ product }: ProductSpecsProps) {
  const t = useTranslations('products')
  const tc = useTranslations('common')

  const specs = [
    { label: t('specFilamentType'), value: product.filamentType },
    {
      label: t('specPrintTime'),
      value: product.printTimeHours
        ? t('specHours', { value: product.printTimeHours })
        : null,
    },
    {
      label: t('specDimensions'),
      value:
        product.dimensionX && product.dimensionY && product.dimensionZ
          ? t('specDimensionsMm', {
              x: product.dimensionX,
              y: product.dimensionY,
              z: product.dimensionZ,
            })
          : null,
    },
    { label: t('specFileFormat'), value: product.fileFormat },
    {
      label: t('specNozzleSize'),
      value: product.nozzleSize
        ? t('specNozzleMm', { value: product.nozzleSize })
        : null,
    },
    {
      label: t('specInfill'),
      value: product.infillPercentage
        ? t('specInfillPercent', { value: product.infillPercentage })
        : null,
    },
    {
      label: t('specSupportsRequired'),
      value:
        product.supportsRequired !== null
          ? product.supportsRequired
            ? tc('yes')
            : tc('no')
          : null,
    },
  ].filter((spec) => spec.value)

  if (specs.length === 0) return null

  return (
    <Table.Root size={'sm'}>
      <Table.Body>
        {specs.map((spec) => (
          <Table.Row key={spec.label}>
            <Table.Cell fontWeight={'medium'} color={'fg.muted'} w={'40%'}>
              {spec.label}
            </Table.Cell>
            <Table.Cell>{spec.value}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}
