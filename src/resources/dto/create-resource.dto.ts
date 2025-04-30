import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateResourceDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsInt()
    @Min(1)
    quantity: number;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string;

}
