// src/types/auth.ts
export interface UserDto {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber: string;
}

export interface LoginDto {
    username: string;
    password: string;
}

export interface CreateUserDto {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber: string;
}

export interface UpdateUserDto {
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber: string;
}

export interface AuthResponseDto {
    token: string;
    expiration: string;
    user: UserDto;
}