import { User } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import prisma from '../../../shared/prisma';
import { IUser } from '../user/user.interface';

const getProfileFromDB = async (payload: string): Promise<IUser | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id: payload,
    },
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

  return result;
};

const updateProfileInDB = async (
  user: JwtPayload,
  payload: Partial<User>
): Promise<IUser> => {
  const allowedFields = ['name', 'email', 'contactNo', 'address', 'profileImg'];

  // Filter the payload to only include allowed fields
  const filteredPayload: Partial<User> = Object.keys(payload)
    .filter(key => allowedFields.includes(key as keyof User))
    .reduce((obj, key) => {
      (obj as any)[key] = (payload as any)[key];
      return obj;
    }, {} as Partial<User>);

  console.log(filteredPayload);

  const result = await prisma.user.update({
    where: {
      id: user?.id,
    },

    data: filteredPayload,

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

  return result;
};

export const profileService = {
  getProfileFromDB,
  updateProfileInDB,
};
