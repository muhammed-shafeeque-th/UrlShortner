import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { MAX_URL_LENGTH } from '../../domain/url-policy';

export class CreateShortUrlDto {
  // Full policy (scheme allow-list etc.) is enforced by the domain UrlPolicy.
  @IsString() @MaxLength(MAX_URL_LENGTH) url!: string;
}

export class ListUrlsQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit: number = 20;
}
