import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { PaginationQueryDto } from '@/common'
import { PrismaService } from '@/prisma'

import {
  CreateVendorApplicationDto,
  CreateVendorDto,
  ReviewVendorApplicationDto,
  UpdateVendorDto,
} from './dto'

const ownerSelect = { id: true, email: true, name: true } as const
const vendorInclude = {
  owner: { select: ownerSelect },
  logoMedia: true,
} as const

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateVendorDto, userId: string) {
    const existingOwner = await this.prisma.vendor.findUnique({
      where: { ownerId: userId },
    })

    if (existingOwner) {
      throw new ConflictException('User already has a vendor profile')
    }

    const existingSlug = await this.prisma.vendor.findUnique({
      where: { slug: dto.slug },
    })

    if (existingSlug) {
      throw new ConflictException('Vendor slug already in use')
    }

    return this.prisma.vendor.create({
      data: { ...dto, ownerId: userId },
      include: vendorInclude,
    })
  }

  async findAll(query: PaginationQueryDto, status?: string) {
    const where = status ? { status: status as never } : {}
    const [vendors, total] = await Promise.all([
      this.prisma.vendor.findMany({
        where,
        skip: query.skip,
        take: query.limit,
        include: {
          ...vendorInclude,
          _count: { select: { products: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.vendor.count({ where }),
    ])

    return {
      items: vendors,
      total,
      page: query.page!,
      limit: query.limit!,
      totalPages: Math.ceil(total / query.limit!),
    }
  }

  async findMe(userId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { ownerId: userId },
      include: {
        ...vendorInclude,
        _count: { select: { products: true, orders: true } },
      },
    })

    if (!vendor) {
      throw new NotFoundException('You do not have a vendor profile')
    }

    return vendor
  }

  async findOne(idOrSlug: string) {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        idOrSlug,
      )

    const include = {
      ...vendorInclude,
      _count: { select: { products: true } },
    }

    const vendor = isUuid
      ? await this.prisma.vendor.findUnique({
          where: { id: idOrSlug },
          include,
        })
      : await this.prisma.vendor.findUnique({
          where: { slug: idOrSlug },
          include,
        })

    if (!vendor) {
      throw new NotFoundException('Vendor not found')
    }

    return vendor
  }

  async update(id: string, dto: UpdateVendorDto, userId?: string) {
    const vendor = await this.findOne(id)

    if (userId && vendor.ownerId !== userId) {
      throw new ForbiddenException('You can only update your own vendor')
    }

    if (dto.slug) {
      const existing = await this.prisma.vendor.findUnique({
        where: { slug: dto.slug },
      })

      if (existing && existing.id !== id) {
        throw new ConflictException('Vendor slug already in use')
      }
    }

    return this.prisma.vendor.update({
      where: { id },
      data: dto,
      include: vendorInclude,
    })
  }

  async remove(id: string) {
    await this.findOne(id)

    return this.prisma.vendor.delete({ where: { id } })
  }

  async createApplication(
    vendorId: string,
    dto: CreateVendorApplicationDto,
    userId: string,
  ) {
    const vendor = await this.findOne(vendorId)

    if (vendor.ownerId !== userId) {
      throw new ForbiddenException(
        'You can only submit applications for your own vendor',
      )
    }

    return this.prisma.vendorApplication.create({
      data: { vendorId, message: dto.message },
      include: { vendor: true },
    })
  }

  async findAllApplications(query: PaginationQueryDto) {
    const [applications, total] = await Promise.all([
      this.prisma.vendorApplication.findMany({
        skip: query.skip,
        take: query.limit,
        include: {
          vendor: {
            include: { owner: { select: ownerSelect } },
          },
          reviewedBy: { select: ownerSelect },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.vendorApplication.count(),
    ])

    return {
      items: applications,
      total,
      page: query.page!,
      limit: query.limit!,
      totalPages: Math.ceil(total / query.limit!),
    }
  }

  async reviewApplication(
    applicationId: string,
    dto: ReviewVendorApplicationDto,
    reviewerId: string,
  ) {
    const application = await this.prisma.vendorApplication.findUnique({
      where: { id: applicationId },
      include: { vendor: true },
    })

    if (!application) {
      throw new NotFoundException('Application not found')
    }

    const updatedApplication = await this.prisma.vendorApplication.update({
      where: { id: applicationId },
      data: {
        status: dto.status,
        reviewedById: reviewerId,
        reviewedAt: new Date(),
      },
      include: { vendor: true },
    })

    if (String(dto.status) === 'APPROVED') {
      await this.prisma.vendor.update({
        where: { id: application.vendorId },
        data: { status: 'ACTIVE' },
      })
    }

    return updatedApplication
  }
}
