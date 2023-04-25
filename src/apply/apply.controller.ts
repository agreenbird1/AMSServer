import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { ApplyService } from './apply.service';
import { CreateApplyDto } from './dto/create-apply.dto';

@Controller('apply')
export class ApplyController {
  constructor(private readonly applyService: ApplyService) {}

  @Post()
  create(@Body() createApplyDto: CreateApplyDto) {
    return this.applyService.create(createApplyDto);
  }

  @Get()
  findAll(@Query() query) {
    return this.applyService.findAll(query);
  }

  @Get('approval')
  findApprovalAll(@Query() query) {
    return this.applyService.findApprovalAll(query);
  }

  @Get('my-asset')
  findMyAssets(@Query() query) {
    return this.applyService.findMyAssetsAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBody) {
    return this.applyService.update(id, updateBody);
  }
}
