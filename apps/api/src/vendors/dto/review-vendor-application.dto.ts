import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

enum ReviewDecision {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class ReviewVendorApplicationDto {
  @ApiProperty({ enum: ReviewDecision })
  @IsEnum(ReviewDecision)
  status!: ReviewDecision
}
