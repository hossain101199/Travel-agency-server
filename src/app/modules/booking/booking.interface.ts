import { BookingStatus } from '@prisma/client';

export type IBookingData = {
  status?: BookingStatus;
  orderedBooks: {
    bookId: string;
    quantity: number;
  }[];
};

export type IBookingFilters = {
  searchTerm?: string;
  userId?: string;
  status?: string;
};
