import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Employee, Prisma } from '@prisma/client';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  // Create a new employee
  @Post()
  createEmployee(@Body() data: any): Promise<Employee> {
    return this.employeesService.createEmployee(data);
  }

  // List employees with pagination
  @Get()
  listEmployees(
    @Query('page') page = 1, // Set the default value of page to 1 if not provided
    @Query('pageSize') pageSize = 10, // Set the default value of pageSize to 10 if not provided
): Promise<Employee[]> {
    return this.employeesService.listEmployees(+page, +pageSize);
  }

  // Get a specific employee by ID
  @Get(':id')
  getEmployeeById(@Param('id') id: string): Promise<Employee | null> {
    return this.employeesService.getEmployeeById(+id);
  }

  // Update an existing employee by ID
  @Put(':id')
  updateEmployee(
    @Param('id') id: string,
    @Body() data: Prisma.EmployeeUpdateInput,
  ): Promise<Employee> {
    return this.employeesService.updateEmployee(+id, data);
  }

  // Delete an employee by ID
  @Delete(':id')
  deleteEmployee(@Param('id') id: string): Promise<Employee> {
    return this.employeesService.deleteEmployee(+id);
  }
}
