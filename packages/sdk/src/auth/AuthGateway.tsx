'use client'

import { type JwtPayload } from '@app/utils'
import { type FC, type ReactNode, useEffect, useState } from 'react'

import { useAuth } from './hooks/useAuth'

export interface AuthGatewayProps {
  children: ReactNode
  onAccept?: (user: JwtPayload) => void
  onReject?: () => void
}

export const AuthGateway: FC<AuthGatewayProps> = (props) => {
  const { children, onAccept, onReject } = props
  const { currentUser } = useAuth()

  const [isValid, setIsValid] = useState<boolean>()

  useEffect(() => {
    const isValid = !!currentUser && currentUser.exp * 1000 > Date.now()

    setIsValid(isValid)

    if (isValid && currentUser) {
      onAccept?.(currentUser)
    } else {
      onReject?.()
    }
  }, [onAccept, onReject, currentUser])

  if (!isValid) return null

  return <>{children}</>
}
