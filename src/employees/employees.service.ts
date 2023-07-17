import { Injectable } from '@nestjs/common';
import { Employee, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

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

  async listEmployees(page: number, pageSize: number): Promise<Employee[]> {
    return this.prisma.employee.findMany({
     include: { primaryContact:true, secondaryContact:true },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async updateEmployee(
    id: number,
    data: Prisma.EmployeeUpdateInput,
  ): Promise<Employee> {
    const { primaryContact, secondaryContact, ...employeeData } = data;
    console.log(employeeData);

    const employeeUpdate = await this.prisma.employee.update({
      where: { id },
      data: {
        ...employeeData,
      },
    });

    
    const primaryContactUpdate = primaryContact
      ? await this.prisma.emergencyContact.update({
          where: { id: employeeUpdate.primaryContactId || undefined },
          data: {
            ...primaryContact,
          },
        })
      : null;
      
    const secondaryContactUpdate = secondaryContact
      ? await this.prisma.emergencyContact.update({
          where: { id: employeeUpdate.secondaryContactId || undefined },
          data: {
            ...secondaryContact,
          },
        })
      : null;

    return this.prisma.employee.findUnique({
      where: { id },
      include: {
        primaryContact: true,
        secondaryContact: true,
      },
    });
  }

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

  async getEmployeeById(id: number): Promise<Employee | null> {
    return this.prisma.employee.findUnique({
      where: { id },
      include: { primaryContact:true, secondaryContact:true },
    });
  }
}
