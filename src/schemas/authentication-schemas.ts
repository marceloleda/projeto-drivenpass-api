import Joi from 'joi';
import { SignInParams } from '@/services';
import { create } from '@/protocols';
import { Network } from '@prisma/client';

export const signInSchema = Joi.object<SignInParams>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const signUpSchema = Joi.object<SignInParams>({
  email: Joi.string().email().required(),
  password: Joi.string().min(10).required(),
});

export const credentialSchema = Joi.object<create>({
  title: Joi.string().required(),
  url: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
});
export const networkSchema = Joi.object<Network>({
  title: Joi.string().required(),
  network: Joi.string().required(),
  password: Joi.string().required(),
});
