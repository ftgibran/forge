import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { FC, PropsWithChildren } from 'react'

export const ApiClientConsumer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}

ApiClientConsumer.displayName = 'ApiClientConsumer'
