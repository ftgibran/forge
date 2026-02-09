import { IsEnum } from 'class-validator'

enum ReviewDecision {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class ReviewVendorApplicationDto {
  @IsEnum(ReviewDecision)
  status!: ReviewDecision
}
