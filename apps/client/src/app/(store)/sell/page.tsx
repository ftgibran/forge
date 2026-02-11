'use client'

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
import { useState } from 'react'

import { AuthGuard } from '@/components/auth-guard'
import { PageContainer } from '@/components/page-container'
import { Field } from '@/components/ui/field'
import { toaster } from '@/components/ui/toaster'
import { vendorsApi } from '@/lib/api/vendors'

export default function SellPage() {
  const [step, setStep] = useState<'form' | 'application' | 'done'>('form')
  const [loading, setLoading] = useState(false)
  const [vendor, setVendor] = useState({
    name: '',
    slug: '',
    description: '',
  })
  const [applicationMessage, setApplicationMessage] = useState('')

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const created = await vendorsApi.create(vendor)

      setVendor((v) => ({ ...v, id: created.id }))
      setStep('application')
      toaster.success({ title: 'Vendor profile created!' })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to create vendor profile'

      toaster.error({ title: message })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const me = await vendorsApi.getMe()

      await vendorsApi.createApplication(me.id, applicationMessage)
      setStep('done')
      toaster.success({ title: 'Application submitted!' })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to submit application'

      toaster.error({ title: message })
    } finally {
      setLoading(false)
    }
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
            <Heading size={'xl'}>Become a Seller</Heading>
            <Text color={'fg.muted'}>
              Create your vendor profile and start selling on the marketplace.
            </Text>
          </VStack>

          {step === 'form' && (
            <Card.Root>
              <Card.Header>
                <Heading size={'md'}>Vendor Profile</Heading>
              </Card.Header>
              <Card.Body>
                <form onSubmit={handleCreateVendor}>
                  <Stack gap={'4'}>
                    <Field label={'Business Name'}>
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
                    <Field
                      label={'Slug'}
                      helperText={'URL-friendly identifier'}
                    >
                      <Input
                        value={vendor.slug}
                        onChange={(e) =>
                          setVendor((v) => ({ ...v, slug: e.target.value }))
                        }
                        required
                      />
                    </Field>
                    <Field label={'Description (optional)'}>
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
                      loading={loading}
                    >
                      Create Vendor Profile
                    </Button>
                  </Stack>
                </form>
              </Card.Body>
            </Card.Root>
          )}

          {step === 'application' && (
            <Card.Root>
              <Card.Header>
                <Heading size={'md'}>Submit Application</Heading>
                <Text color={'fg.muted'} fontSize={'sm'}>
                  Tell us why you&apos;d like to sell on our marketplace.
                </Text>
              </Card.Header>
              <Card.Body>
                <form onSubmit={handleSubmitApplication}>
                  <Stack gap={'4'}>
                    <Field label={'Application Message'}>
                      <Textarea
                        value={applicationMessage}
                        onChange={(e) => setApplicationMessage(e.target.value)}
                        rows={5}
                        placeholder={
                          'Describe your products, experience, and why you want to join...'
                        }
                        required
                      />
                    </Field>
                    <Button
                      type={'submit'}
                      colorPalette={'blue'}
                      loading={loading}
                    >
                      Submit Application
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
                  <Heading size={'lg'}>Application Submitted!</Heading>
                  <Text color={'fg.muted'}>
                    Thank you for applying. We&apos;ll review your application
                    and get back to you soon.
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>
          )}
        </VStack>
      </PageContainer>
    </AuthGuard>
  )
}
