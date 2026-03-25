import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { VendorsController } from './vendors.controller'
import { VendorsService } from './vendors.service'

const mockVendorsService = {
  create: vi.fn(),
  findAll: vi.fn(),
  findMe: vi.fn(),
  findOne: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  createApplication: vi.fn(),
  findAllApplications: vi.fn(),
  reviewApplication: vi.fn(),
}

describe('VendorsController', () => {
  let controller: VendorsController

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendorsController],
      providers: [{ provide: VendorsService, useValue: mockVendorsService }],
    }).compile()

    controller = module.get<VendorsController>(VendorsController)
  })

  describe('create', () => {
    it('should create a vendor', async () => {
      const dto = { name: 'Acme Corp' }
      const expected = { id: 'vendor-1', name: 'Acme Corp' }

      mockVendorsService.create.mockResolvedValue(expected)

      const result = await controller.create(dto as any, 'user-1')

      expect(result).toEqual(expected)
      expect(mockVendorsService.create).toHaveBeenCalledWith(dto, 'user-1')
    })
  })

  describe('findAll', () => {
    it('should return paginated vendors', async () => {
      const query = {
        page: 1,
        limit: 10,
        get skip() {
          return 0
        },
      }
      const expected = {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      }

      mockVendorsService.findAll.mockResolvedValue(expected)

      const result = await controller.findAll(query as any)

      expect(result).toEqual(expected)
    })
  })

  describe('findMe', () => {
    it('should return the vendor profile for the current user', async () => {
      const expected = { id: 'vendor-1', name: 'My Store' }

      mockVendorsService.findMe.mockResolvedValue(expected)

      const result = await controller.findMe('user-1')

      expect(result).toEqual(expected)
      expect(mockVendorsService.findMe).toHaveBeenCalledWith('user-1')
    })
  })

  describe('findOne', () => {
    it('should return a vendor by id', async () => {
      const expected = { id: 'vendor-1', name: 'Acme Corp' }

      mockVendorsService.findOne.mockResolvedValue(expected)

      const result = await controller.findOne('vendor-1')

      expect(result).toEqual(expected)
    })
  })

  describe('update', () => {
    it('should update a vendor', async () => {
      const dto = { name: 'Updated Corp' }
      const expected = { id: 'vendor-1', name: 'Updated Corp' }

      mockVendorsService.update.mockResolvedValue(expected)

      const result = await controller.update('vendor-1', dto as any, 'user-1')

      expect(result).toEqual(expected)
      expect(mockVendorsService.update).toHaveBeenCalledWith(
        'vendor-1',
        dto,
        'user-1',
      )
    })
  })

  describe('remove', () => {
    it('should delete a vendor', async () => {
      const expected = { id: 'vendor-1', name: 'Acme Corp' }

      mockVendorsService.remove.mockResolvedValue(expected)

      const result = await controller.remove('vendor-1')

      expect(result).toEqual(expected)
    })
  })

  describe('createApplication', () => {
    it('should create a vendor application', async () => {
      const dto = { message: 'Please approve' }
      const expected = { id: 'app-1', status: 'pending' }

      mockVendorsService.createApplication.mockResolvedValue(expected)

      const result = await controller.createApplication(
        'vendor-1',
        dto as any,
        'user-1',
      )

      expect(result).toEqual(expected)
      expect(mockVendorsService.createApplication).toHaveBeenCalledWith(
        'vendor-1',
        dto,
        'user-1',
      )
    })
  })

  describe('findAllApplications', () => {
    it('should return paginated vendor applications', async () => {
      const query = {
        page: 1,
        limit: 10,
        get skip() {
          return 0
        },
      }
      const expected = { items: [], total: 0 }

      mockVendorsService.findAllApplications.mockResolvedValue(expected)

      const result = await controller.findAllApplications(query as any)

      expect(result).toEqual(expected)
    })
  })

  describe('reviewApplication', () => {
    it('should review a vendor application', async () => {
      const dto = { status: 'approved', note: 'Looks good' }
      const expected = { id: 'app-1', status: 'approved' }

      mockVendorsService.reviewApplication.mockResolvedValue(expected)

      const result = await controller.reviewApplication(
        'app-1',
        dto as any,
        'admin-1',
      )

      expect(result).toEqual(expected)
      expect(mockVendorsService.reviewApplication).toHaveBeenCalledWith(
        'app-1',
        dto,
        'admin-1',
      )
    })
  })
})
