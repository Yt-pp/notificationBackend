import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class MessageDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsNotEmpty()
    senderId: string;

    @IsOptional()
    @IsString()
    recipientId?: string;

    @IsOptional()
    @IsString()
    group?: string;

    @IsOptional()
    broadcastToAll?: boolean;
}
