import { FC, ReactElement } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValidElement<P = any> = ReactElement<P, FC<P>>
