# Employee API Documentation

This API provides CRUD operations for managing employees and their contact details. It utilizes NestJS with Prisma ORM and a MySQL database. The API follows RESTful principles and supports pagination for listing employees.

## Installation and Setup

Follow these steps to install and run the Employee API on your local machine:

### Prerequisites

Before you proceed, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org) 
- [npm](https://www.npmjs.com/) (typically comes bundled with Node.js)
- [Docker](https://www.docker.com/) (if using Docker to run the MySQL database)

### Step 1: Clone the Repository

Clone this repository to your local machine using Git:

```bash
git clone https://github.com/SriGanesh737/employee-api.git
cd employee-api
```

### Step 2: Install Dependencies
Install the required Node.js dependencies using npm:
```bash
    npm install
```

### Step 3: Set Up the Database
**Option 1: Using Docker (Recommended)**
If you have Docker installed, you can use the provided docker-compose.yml file to set up a MySQL database:
```bash
  docker-compose up -d
```
**Option 2: Manual Database Setup**
If you prefer not to use Docker, you can set up a MySQL database manually. Ensure you have MySQL installed and create a database named my_db.

### Step 4: Prisma Migration and Client Generation
Use Prisma CLI to apply migrations and generate the Prisma client:
```bash
npx prisma migrate dev
npx prisma generate
```
### Step 5: Run the Application
Start the application server:

```bash
npm start
```

## Base URL

http://localhost:8000


## Endpoints

### Create Employee

Create a new employee with multiple contact details.

- **URL:** `/employees`
- **Method:** POST
- **Request Body:**
  - `fullName` (string, required): Full name of the employee.
  - `jobTitle` (string, required): Job title of the employee.
  - `phoneNumber` (string, required): Phone number of the employee.
  - `email` (string, required): Email address of the employee.
  - `address` (string, required): Address of the employee.
  - `city` (string, required): City of the employee.
  - `state` (string, required): State of the employee.
  - `primaryContact` (object, required): Primary emergency contact details.
    - `name` (string, required): Name of the primary contact.
    - `phoneNumber` (string, required): Phone number of the primary contact.
    - `relationship` (string, required): Relationship with the employee.
  - `secondaryContact` (object, required): Secondary emergency contact details.
    - `name` (string, required): Name of the secondary contact.
    - `phoneNumber` (string, required): Phone number of the secondary contact.
    - `relationship` (string, required): Relationship with the employee.
- **Response:**
  - Status: 201 Created
  - Body: The newly created employee object.

### List Employees

List all employees with pagination support.

- **URL:** `/employees`
- **Method:** GET
- **Query Parameters:**
  - `page` (number, optional): Page number for pagination. Default: 1.
  - `pageSize` (number, optional): Number of items per page. Default: 10.
- **Response:**
  - Status: 200 OK
  - Body: An array of employee objects.

### Get Employee by ID

Retrieve an employee by their ID.

- **URL:** `/employees/:id`
- **Method:** GET
- **Path Parameter:**
  - `id` (number, required): ID of the employee to retrieve.
- **Response:**
  - Status: 200 OK
  - Body: The employee object with the specified ID.
  - Status: 404 Not Found if the employee does not exist.

### Update Employee

Update an existing employee by their ID.

- **URL:** `/employees/:id`
- **Method:** PUT
- **Path Parameter:**
  - `id` (number, required): ID of the employee to update.
- **Request Body:**
  - Any of the employee fields to be updated. The request body should follow the same format as the one used for creating an employee.
- **Response:**
  - Status: 200 OK
  - Body: The updated employee object.
  - Status: 404 Not Found if the employee does not exist.

### Delete Employee

Delete an employee by their ID.

- **URL:** `/employees/:id`
- **Method:** DELETE
- **Path Parameter:**
  - `id` (number, required): ID of the employee to delete.
- **Response:**
  - Status: 200 OK
  - Body: The deleted employee object.
  - Status: 404 Not Found if the employee does not exist.

### Examples

#### Create Employee Example

Request:
```json
POST /employees
Body:
{
  "fullName": "John Doe",
  "jobTitle": "Software Engineer",
  "phoneNumber": "1234567890",
  "email": "john.doe@example.com",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "primaryContact": {
    "name": "Mary Doe",
    "phoneNumber": "9876543210",
    "relationship": "Spouse"
  },
  "secondaryContact": {
    "name": "Alice Doe",
    "phoneNumber": "5555555555",
    "relationship": "Sibling"
  }
} 
```

Response:
Status: 201 Created
```json
Body:
{
  "id": 1,
  "fullName": "John Doe",
  "jobTitle": "Software Engineer",
  "phoneNumber": "1234567890",
  "email": "john.doe@example.com",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "primaryContact": {
    "id": 1,
    "name": "Mary Doe",
    "phoneNumber": "9876543210",
    "relationship": "Spouse"
  },
  "secondaryContact": {
    "id": 2,
    "name": "Alice Doe",
    "phoneNumber": "5555555555",
    "relationship": "Sibling"
  }
}
```

#### List Employees Example

```json
Request:
GET /employees?page=1&pageSize=10
Response:
Status: 200 OK
Body:
[
  {
    "id": 1,
    "fullName": "John Doe",
    "jobTitle": "Software Engineer",
    "phoneNumber": "1234567890",
    "email": "john.doe@example.com",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "primaryContact": {
      "id": 1,
      "name": "Mary Doe",
      "phoneNumber": "9876543210",
      "relationship": "Spouse"
    },
    "secondaryContact": {
      "id": 2,
      "name": "Alice Doe",
      "phoneNumber": "5555555555",
      "relationship": "Sibling"
    }
  },
  // More employee objects (first 10 will be displayed )...
]
```

#### Get Employee by ID Example
```json
Request:
GET /employees/1
Response:
Status: 200 OK
Body:
{
  "id": 1,
  "fullName": "John Doe",
  "jobTitle": "Software Engineer",
  "phoneNumber": "1234567890",
  "email": "john.doe@example.com",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "primaryContact": {
    "id": 1,
    "name": "Mary Doe",
    "phoneNumber": "9876543210",
    "relationship": "Spouse"
  },
  "secondaryContact": {
    "id": 2,
    "name": "Alice Doe",
    "phoneNumber": "5555555555",
    "relationship": "Sibling"
  }
}
```
#### Update Employee Example
```json
Request:
PUT /employees/1
Body:
{
  "fullName": "John Doe Jr.",
  "jobTitle": "Senior Software Engineer"
}
Response:
Status: 200 OK
Body:
{
  "id": 1,
  "fullName": "John Doe Jr.",
  "jobTitle": "Senior Software Engineer",
  "phoneNumber": "1234567890",
  "email": "john.doe@example.com",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "primaryContact": {
    "id": 1,
    "name": "Mary Doe",
    "phoneNumber": "9876543210",
    "relationship": "Spouse"
  },
  "secondaryContact": {
    "id": 2,
    "name": "Alice Doe",
    "phoneNumber": "5555555555",
    "relationship": "Sibling"
  }
}
```
#### Delete Employee Example
```json
Request:
DELETE /employees/1
Response:
Status: 200 OK
Body:
{
  "id": 1,
  "fullName": "John Doe Jr.",
  "jobTitle": "Senior Software Engineer",
  "phoneNumber": "1234567890",
  "email": "john.doe@example.com",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "primaryContact": {
    "id": 1,
    "name": "Mary Doe",
    "phoneNumber": "9876543210",
    "relationship": "Spouse"
  },
  "secondaryContact": {
    "id": 2,
    "name": "Alice Doe",
    "phoneNumber": "5555555555",
    "relationship": "Sibling"
  }
}

```