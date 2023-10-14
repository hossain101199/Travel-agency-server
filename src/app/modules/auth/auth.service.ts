import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { IUser } from '../user/user.interface';
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';

const createUserInDB = async (payload: User): Promise<IUser> => {
  payload.password = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  const createdUser = await prisma.user.create({
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      contactNo: true,
      address: true,
      profileImg: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return createdUser;
};

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: { email: email },
    select: {
      id: true,
      role: true,
      password: true,
    },
  });

  if (isUserExist) {
    if (await bcrypt.compare(password, isUserExist.password)) {
      const { id, role } = isUserExist;

      const accessToken = jwt.sign(
        {
          id,
          role,
        },
        config.jwt.secret as Secret,
        { expiresIn: config.jwt.expires_in }
      );

      const refreshToken = jwt.sign(
        {
          id,
          role,
        },
        config.jwt.refresh_secret as Secret,
        { expiresIn: config.jwt.refresh_expires_in }
      );

      return {
        accessToken,
        refreshToken,
      };
    } else {
      throw new ApiError(401, 'Password is incorrect');
    }
  } else {
    throw new ApiError(404, 'User does not exist');
  }
};

const refreshToken = async (
  payload: string
): Promise<IRefreshTokenResponse> => {
  // invalid token - synchronous
  let verifiedToken = null;

  try {
    verifiedToken = jwt.verify(
      payload,
      config.jwt.refresh_secret as Secret
    ) as JwtPayload;
  } catch (err) {
    throw new ApiError(403, 'Invalid Refresh Token');
  }

  const { id } = verifiedToken;

  const isUserExist = await prisma.user.findUnique({
    where: { id: id },
    select: {
      id: true,
      role: true,
    },
  });

  if (!isUserExist) {
    throw new ApiError(404, 'User does not exist');
  }

  const newAccessToken = jwt.sign(
    {
      id: isUserExist.id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    { expiresIn: config.jwt.expires_in }
  );

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: { id: user?.id },
    select: {
      password: true,
    },
  });

  if (!isUserExist) {
    throw new ApiError(404, 'User does not exist');
  }

  // checking old password
  if (
    isUserExist.password &&
    !(await bcrypt.compare(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(401, 'Old Password is incorrect');
  }

  const hashedNewPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await prisma.user.update({
    where: { id: user?.id },
    data: {
      password: hashedNewPassword,
    },
  });
};

export const authService = {
  createUserInDB,
  loginUser,
  refreshToken,
  changePassword,
};
