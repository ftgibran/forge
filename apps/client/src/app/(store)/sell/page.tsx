'use client'

import {
  useCreateVendor,
  useCreateVendorApplication,
  useGetVendorMe,
} from '@app/sdk'
import { Field } from '@app/theme'
import { toaster } from '@app/theme'
import {
  Button,
  Card,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { AuthGuard } from '@/components/auth-guard'
import { PageContainer } from '@/components/page-container'

export default function SellPage() {
  const [step, setStep] = useState<'form' | 'application' | 'done'>('form')
  const [vendor, setVendor] = useState({
    name: '',
    slug: '',
    description: '',
  })
  const [applicationMessage, setApplicationMessage] = useState('')
  const t = useTranslations('sell')

  const { data: vendorMe } = useGetVendorMe({
    query: { enabled: step === 'application' },
  })

  const createVendorMutation = useCreateVendor({
    mutation: {
      onSuccess: () => {
        setStep('application')
        toaster.success({ title: t('vendorCreated') })
      },
      onError: (err) => {
        toaster.error({
          title: (err as Error).message || t('vendorCreatedError'),
        })
      },
    },
  })

  const applyMutation = useCreateVendorApplication({
    mutation: {
      onSuccess: () => {
        setStep('done')
        toaster.success({ title: t('applicationSubmitted') })
      },
      onError: (err) => {
        toaster.error({
          title: (err as Error).message || t('applicationSubmittedError'),
        })
      },
    },
  })

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault()
    createVendorMutation.mutate({ data: vendor })
  }

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault()

    if (!vendorMe) return

    applyMutation.mutate({
      id: vendorMe.id,
      data: { message: applicationMessage },
    })
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  return (
    <AuthGuard>
      <PageContainer>
        <VStack align={'stretch'} gap={'6'} maxW={'lg'} mx={'auto'}>
          <VStack gap={'2'} textAlign={'center'}>
            <Heading size={'xl'}>{t('heading')}</Heading>
            <Text color={'fg.muted'}>{t('subtitle')}</Text>
          </VStack>

          {step === 'form' && (
            <Card.Root>
              <Card.Header>
                <Heading size={'md'}>{t('vendorProfileHeader')}</Heading>
              </Card.Header>
              <Card.Body>
                <form onSubmit={handleCreateVendor}>
                  <Stack gap={'4'}>
                    <Field label={t('businessNameLabel')}>
                      <Input
                        value={vendor.name}
                        onChange={(e) => {
                          const name = e.target.value

                          setVendor((v) => ({
                            ...v,
                            name,
                            slug: generateSlug(name),
                          }))
                        }}
                        required
                      />
                    </Field>
                    <Field label={t('slugLabel')} helperText={t('slugHelper')}>
                      <Input
                        value={vendor.slug}
                        onChange={(e) =>
                          setVendor((v) => ({ ...v, slug: e.target.value }))
                        }
                        required
                      />
                    </Field>
                    <Field label={t('descriptionLabel')}>
                      <Textarea
                        value={vendor.description}
                        onChange={(e) =>
                          setVendor((v) => ({
                            ...v,
                            description: e.target.value,
                          }))
                        }
                        rows={3}
                      />
                    </Field>
                    <Button
                      type={'submit'}
                      colorPalette={'blue'}
                      loading={createVendorMutation.isPending}
                    >
                      {t('createVendorButton')}
                    </Button>
                  </Stack>
                </form>
              </Card.Body>
            </Card.Root>
          )}

          {step === 'application' && (
            <Card.Root>
              <Card.Header>
                <Heading size={'md'}>{t('submitApplicationHeader')}</Heading>
                <Text color={'fg.muted'} fontSize={'sm'}>
                  {t('applicationSubtitle')}
                </Text>
              </Card.Header>
              <Card.Body>
                <form onSubmit={handleSubmitApplication}>
                  <Stack gap={'4'}>
                    <Field label={t('applicationMessageLabel')}>
                      <Textarea
                        value={applicationMessage}
                        onChange={(e) => setApplicationMessage(e.target.value)}
                        rows={5}
                        placeholder={t('applicationPlaceholder')}
                        required
                      />
                    </Field>
                    <Button
                      type={'submit'}
                      colorPalette={'blue'}
                      loading={applyMutation.isPending}
                    >
                      {t('submitButton')}
                    </Button>
                  </Stack>
                </form>
              </Card.Body>
            </Card.Root>
          )}

          {step === 'done' && (
            <Card.Root>
              <Card.Body>
                <VStack gap={'4'} py={'8'} textAlign={'center'}>
                  <Heading size={'lg'}>{t('successHeading')}</Heading>
                  <Text color={'fg.muted'}>{t('successMessage')}</Text>
                </VStack>
              </Card.Body>
            </Card.Root>
          )}
        </VStack>
      </PageContainer>
    </AuthGuard>
  )
}
