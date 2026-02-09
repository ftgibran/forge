'use client'

import { Card, Icon } from '@chakra-ui/react'
import type { IconType } from 'react-icons'

import { StatLabel, StatRoot, StatValueText } from '@/components/ui/stat'

interface StatCardProps {
  label: string
  value: number
  icon: IconType
}

export function StatCard({ label, value, icon: IconComponent }: StatCardProps) {
  return (
    <Card.Root>
      <Card.Body>
        <StatRoot>
          <StatLabel>
            <Icon mr={'2'}>
              <IconComponent />
            </Icon>
            {label}
          </StatLabel>
          <StatValueText value={value} />
        </StatRoot>
      </Card.Body>
    </Card.Root>
  )
}
