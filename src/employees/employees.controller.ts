import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Employee, Prisma } from '@prisma/client';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  createEmployee(@Body() data: any): Promise<Employee> {
    console.log(data);
    return this.employeesService.createEmployee(data);
  }

  @Get()
  listEmployees(@Query('page') page = 1, @Query('pageSize') pageSize = 10): Promise<Employee[]> {
    return this.employeesService.listEmployees(+page, +pageSize);
  }

  @Get(':id')
  getEmployeeById(@Param('id') id: string): Promise<Employee | null> {
    return this.employeesService.getEmployeeById(+id);
  }

  @Put(':id')
  updateEmployee(
    @Param('id') id: string,
    @Body() data: Prisma.EmployeeUpdateInput,
  ): Promise<Employee> {
    return this.employeesService.updateEmployee(+id, data);
  }

  @Delete(':id')
  deleteEmployee(@Param('id') id: string): Promise<Employee> {
    return this.employeesService.deleteEmployee(+id);
  }
}
