export type ImageFormatOptions = {
  format: 'webp' | 'jpeg' | 'png'
  options?: { quality?: number }
}

export type ImageSizeConfig = {
  name: string
  width: number
  height?: number
  crop?: 'center' | 'attention' | 'entropy'
  formatOptions: ImageFormatOptions
}

export const uploadConfig = {
  formatOptions: {
    format: 'webp' as const,
    options: { quality: 90 },
  },
  imageSizes: [
    {
      name: 'thumbnail',
      width: 300,
      formatOptions: { format: 'webp' as const },
    },
    {
      name: 'square',
      width: 500,
      height: 500,
      formatOptions: { format: 'webp' as const },
    },
    {
      name: 'small',
      width: 600,
      formatOptions: { format: 'webp' as const },
    },
    {
      name: 'medium',
      width: 900,
      formatOptions: { format: 'webp' as const },
    },
    {
      name: 'large',
      width: 1400,
      formatOptions: { format: 'webp' as const },
    },
    {
      name: 'xlarge',
      width: 1920,
      formatOptions: { format: 'webp' as const },
    },
    {
      name: 'og',
      width: 1200,
      height: 630,
      crop: 'center' as const,
      formatOptions: { format: 'webp' as const },
    },
    {
      name: 'google',
      width: 1200,
      height: 675,
      crop: 'center' as const,
      formatOptions: { format: 'webp' as const },
    },
  ] satisfies ImageSizeConfig[],
}
