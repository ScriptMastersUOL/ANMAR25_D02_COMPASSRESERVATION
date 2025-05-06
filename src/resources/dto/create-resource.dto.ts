import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min, Matches } from "class-validator";
import { isActive } from "src/enums/isActive.enum";

export class CreateResourceDto {
 
    @ApiProperty({ example: 'Projector', description: 'The name of the resource (must be unique)' })
    @IsNotEmpty()
    @IsString()
    @Matches(/^\S+$/, { message: 'Name cannot contain only whitespace' })
    name: string;

    @ApiProperty({ example: 10, description: 'Available quantity of the resource' })
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    quantity: number;

    @ApiProperty({ example: 'Description of the resource' })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ example: 1, description: 'Is the resource active' })
    @IsOptional()
    @IsEnum(isActive)
    isActive: number;

}
