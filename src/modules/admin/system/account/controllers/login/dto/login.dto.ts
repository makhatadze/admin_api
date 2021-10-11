import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { IsUserName } from '@src/validators';

export class LoginDto {
  @ApiProperty({ required: true, description: 'Username' })
  @IsUserName()
  @IsString({ message: 'Username must be of character type' })
  @IsNotEmpty({ message: 'Username can not be empty' })
  readonly username: string;

  @ApiProperty({ required: true, description: 'Password' })
  @IsString({ message: 'Password must be a string type' })
  @IsNotEmpty({ message: 'Password can not be blank' })
  readonly password: string;
}
