'use client'

import type { Product } from '@app/sdk'
import { Table } from '@chakra-ui/react'

interface ProductSpecsProps {
  product: Product
}

export function ProductSpecs({ product }: ProductSpecsProps) {
  const specs = [
    { label: 'Filament Type', value: product.filamentType },
    {
      label: 'Print Time',
      value: product.printTimeHours ? `${product.printTimeHours} hours` : null,
    },
    {
      label: 'Dimensions',
      value:
        product.dimensionX && product.dimensionY && product.dimensionZ
          ? `${product.dimensionX} x ${product.dimensionY} x ${product.dimensionZ} mm`
          : null,
    },
    { label: 'File Format', value: product.fileFormat },
    {
      label: 'Nozzle Size',
      value: product.nozzleSize ? `${product.nozzleSize}mm` : null,
    },
    {
      label: 'Infill',
      value: product.infillPercentage ? `${product.infillPercentage}%` : null,
    },
    {
      label: 'Supports Required',
      value:
        product.supportsRequired !== null
          ? product.supportsRequired
            ? 'Yes'
            : 'No'
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
