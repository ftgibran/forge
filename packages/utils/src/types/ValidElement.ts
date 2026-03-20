import { FC, ReactElement } from 'react'

export type ValidElement<P = any> = ReactElement<P, FC<P>>
