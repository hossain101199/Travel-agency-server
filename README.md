# Travel agency Service API documentation:

## Base URL

The base URL for all API endpoints is: `https://travel-agency-service-server-hossain101199.vercel.app/api/v1`

## Registration and Login

### User Registration

- **POST** `/auth/signup`
  - Create a new user account.
  - Request Body:
    ```json
    {
      "name": "Charlie Brown",
      "email": "charlie.brown@example.com",
      "password": "password123",
      "contactNo": "777-888-9999",
      "address": "333 Willow St, Town, Country",
      "profileImg": "profile6.jpg"
    }
    ```

### User Login

- **POST** `/auth/signin`
  - Authenticate the user.
  - Request Body:
    ```json
    {
      "email": "charlie.brown@example.com",
      "password": "password123"
    }
    ```

## Service Search

### Search Services

- **GET** `/service`
  - Retrieve services based on search criteria.
  - Parameters:
    - `searchTerm`: Search by service name, location, or categoryId.
    - `minPrice`: Filter by service name, location, categoryId, minPrice, maxPrice, page, limit, sortby, and sortOrder.

## Booking and Scheduling

### Create Booking

- **POST** `/bookings`
  - Create a booking.
  - Request Body:
    ```json
    {
      "travelDate": "2023-10-21T21:21:11.284Z",
      "numberOfPeople": 1,
      "serviceId": "7c352733-a150-4ca5-bf0a-8dbe2dcbf429"
    }
    ```
  - Authorization: Token required (customer user).

## Profile Management

### Get User Profile

- **GET** `/profile`
  - Retrieve user profile.
  - Authorization: Token required.

### Update User Profile

- **PATCH** `/profile`
  - Update user profile information.
  - Request Body:
    ```json
    {
      "contactNo": "555-44444-66666",
      "allowedFields": "655665456456"
    }
    ```
  - Authorization: Token required.
  - User can update their name, email, contactNo, address, and profile.

## Review and Rating System

### Create Review and Rating

- **POST** `/reviews`
  - Create a review and rating for a service.
  - Request Body:
    ```json
    {
      "rating": 5,
      "comment": "Comment 1",
      "serviceId": "a5c8cc2b-8268-44ea-97dd-a5c194d73ed9"
    }
    ```
  - Authorization: Token required.
  - Only customers who have booked the service can provide reviews and ratings.

### Get Reviews

- **GET** `/reviews`
  - Retrieve all reviews based on service ID.
  - Parameters:
    - `serviceId`: Service ID to fetch reviews for.

## Service History

### Get All Bookings

- **GET** `/bookings`
  - Retrieve all user bookings.
  - Authorization: Token required.

### Get Confirmed Bookings

- **GET** `/bookings?status=CONFIRMED`
  - Retrieve all confirmed user bookings.
  - Authorization: Token required.

### Get Pending Bookings

- **GET** `/bookings?status=PENDING`
  - Retrieve all pending user bookings.
  - Authorization: Token required.

### Get Canceled Bookings

- **GET** `/bookings?status=CANCELED`
  - Retrieve all canceled user bookings.
  - Authorization: Token required.

### Cancel Booking

- **PATCH** `/bookings/{bookingID}`
  - Cancel a pending booking.
  - Request Body:
    ```json
    {
      "status": "CANCELED"
    }
    ```
  - Authorization: Token required.

## Admin-Facing Features

### User Management

#### Get All Users

- **GET** `/users`
  - Retrieve a list of all users.
  - Authorization: Token required (admin or super admin).

#### Delete User

- **DELETE** `/users/{userID}`
  - Delete a user by their ID.
  - Authorization: Token required (admin or super admin).

#### Get User Information

- **GET** `/users/{userID}`
  - Retrieve user information by their ID.
  - Authorization: Token required (admin or super admin).

#### Mark User as Admin/Customer

- **PATCH** `/users/{userID}`
  - Mark a user as an admin or customer.
  - Authorization: Token required (admin or super admin).

### Service Management

#### Create Service

- **POST** `/service`
  - Create a new service listing.
  - Request Body:
    ```json
    {
      "name": "Desert Safari Experience",
      "description": "Explore the vast deserts and unique landscapes of Namibia.",
      "location": "Namib Desert, Namibia",
      "price": 700.0,
      "duration": "2 days",
      "categoryId": "53fe96de-c91b-41cf-b644-5849da7191b7"
    }
    ```
  - Authorization: Token required (admin or super admin).

#### Update Service

- **PATCH** `/service/{serviceID}`
  - Update service listing data.
  - Request Body:
    ```json
    {
      "name": "Desert Safari Experience",
      "description": "Explore the vast deserts and unique landscapes of ..."
    }
    ```
  - Authorization: Token required (admin or super admin).

## Admin-Only Booking Management

### Get All Bookings (Admin)

- **GET** `/bookings`
  - Retrieve all bookings.
  - Authorization: Token required (admin or super admin).

### Update Booking (Admin)

- **PATCH** `/bookings`
  - Update booking data.
  - Authorization: Token required (admin or super admin).
    - Request Body:
    ```json
    {
      "status": "CANCELED"
    }
    ```

```.env
NODE_ENV=development

PORT=8000

DATABASE_URL=

BCRYPT_SALT_ROUNDS=

JWT_SECRET=
JWT_EXPIRES_IN=

JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=

```

## Your Feedback Matters

Your opinion and feedback are essential to me! I value your input as it helps me improve and grow. If you have any questions, suggestions, please don't hesitate to reach out. Your feedback will help me tailor future content to your needs.

## Contact

If you have any questions or feedback, feel free to contact me:

- Mohammad Hossain - [Linkedin](https://www.linkedin.com/in/hossain1011/) - fshossain10@gmail.com

[![LinkedIn][linkedin-shield]][linkedin-url]

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/hossain1011/

**Happy coding! 🚀**
