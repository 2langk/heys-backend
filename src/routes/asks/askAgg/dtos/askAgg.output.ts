import { ApiProperty } from '@nestjs/swagger';
import { BaseOutput } from 'src/common';
import { Ask } from 'src/entities';

export class AskOutput extends BaseOutput {
  @ApiProperty({ type: () => Ask })
  ask: Ask;
}

export class AsksOutput extends BaseOutput {
  @ApiProperty({ type: () => [Ask] })
  asks: Ask[];
}
