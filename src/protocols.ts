import { User, Credential } from "@prisma/client";

export type ApplicationError = {
    name: string;
    message: string;
};Credential

export type GetUserOrFailResult = Pick<User, 'id' | 'email' | 'password'>;

export type user = Pick<User,  'email' | 'password'>;

export type credent = Omit<Credential,  'id' >;
