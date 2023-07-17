import { Injectable } from '@nestjs/common';
import { Employee, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  // Function to create a new employee and their emergency contacts
  async createEmployee(data: any): Promise<Employee> {
    return this.prisma.employee.create({
        data: {
          fullName: data.fullName,
          jobTitle: data.jobTitle,
          phoneNumber: data.phoneNumber,
          email: data.email,
          address: data.address,
          city: data.city,
          state: data.state,
          primaryContact: {
            create: {
              name: data.primaryContact.name,
              phoneNumber: data.primaryContact.phoneNumber,
              relationship: data.primaryContact.relationship,
            },
          },
          secondaryContact: {
            create: {
              name: data.secondaryContact.name,
              phoneNumber: data.secondaryContact.phoneNumber,
              relationship: data.secondaryContact.relationship,
            },
          },
        },
        include: {
          primaryContact: true,
          secondaryContact: true,
        },
      });
  }

  // Function to list employees with pagination
  async listEmployees(page: number, pageSize: number): Promise<Employee[]> {
    return this.prisma.employee.findMany({
     include: { primaryContact:true, secondaryContact:true },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

   // Function to update an employee and their emergency contacts
  async updateEmployee(
    id: number,
    data: Prisma.EmployeeUpdateInput,
  ): Promise<Employee> {
    const { primaryContact, secondaryContact, ...employeeData } = data;
    console.log(employeeData);

    // Update employee details
    const employeeUpdate = await this.prisma.employee.update({
      where: { id },
      data: {
        ...employeeData,
      },
    });

    // Update primary emergency contact if provided
    const primaryContactUpdate = primaryContact
      ? await this.prisma.emergencyContact.update({
          where: { id: employeeUpdate.primaryContactId || undefined },
          data: {
            ...primaryContact,
          },
        })
      : null;
     
    // Update secondary emergency contact if provided
    const secondaryContactUpdate = secondaryContact
      ? await this.prisma.emergencyContact.update({
          where: { id: employeeUpdate.secondaryContactId || undefined },
          data: {
            ...secondaryContact,
          },
        })
      : null;

    // Retrieve the updated employee with their emergency contacts
    return this.prisma.employee.findUnique({
      where: { id },
      include: {
        primaryContact: true,
        secondaryContact: true,
      },
    });
  }

  // Function to delete an employee and their emergency contacts
  async deleteEmployee(id: number): Promise<Employee> {
  // First, retrieve the employee with their emergency contacts
  const employee = await this.prisma.employee.findUnique({
    where: { id },
    include: { primaryContact: true, secondaryContact: true },
  });

  if (!employee) {
    throw new Error('Employee not found.');
  }

  // Delete the emergency contacts
  const { primaryContact, secondaryContact } = employee;
  await this.prisma.emergencyContact.deleteMany({
    where: {
      OR: [
        { id: primaryContact.id },
        { id: secondaryContact.id },
      ],
    },
  });

  // Delete the employee
  return this.prisma.employee.delete({ where: { id } });
  } 

  // Function to get an employee by ID
  async getEmployeeById(id: number): Promise<Employee | null> {
    return this.prisma.employee.findUnique({
      where: { id },
      include: { primaryContact:true, secondaryContact:true },
    });
  }
}
