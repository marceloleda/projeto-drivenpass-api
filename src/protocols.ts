import { User, Credential, Network } from "@prisma/client";

export type ApplicationError = {
    name: string;
    message: string;
};Credential

export type GetUserOrFailResult = Pick<User, 'id' | 'email' | 'password'>;

export type user = Pick<User,  'email' | 'password'>;

export type credent = Omit<Credential,  'id' >;

export type create = Omit<Credential,  'id'  >;

export type networkCreat = Omit<Network,  'id' >;

