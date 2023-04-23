import { IsString, IsOptional } from 'class-validator';
export class CreateAnnouncementDto {
  @IsString()
  title: string;

  @IsString()
  userName: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  picture: string;
}
