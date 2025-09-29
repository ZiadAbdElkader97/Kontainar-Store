class StaffService {
  constructor() {
    this.storageKey = 'staff';
    this.initializeDefaultStaff();
  }

  // Initialize default staff
  initializeDefaultStaff() {
    const existingStaff = localStorage.getItem(this.storageKey);
    if (!existingStaff) {
      const defaultStaff = [
        {
          id: '1',
          firstName: 'Ahmed',
          lastName: 'Mohamed',
          email: 'ahmed.mohamed@company.com',
          phone: '+201234567890',
          dateOfBirth: '1985-03-15',
          gender: 'male',
          address: {
            street: '123 Main Street',
            city: 'Cairo',
            state: 'Cairo',
            country: 'Egypt',
            zipCode: '11511',
          },
          employeeId: 'EMP001',
          department: 'IT',
          position: 'Senior Developer',
          role: 'admin',
          salary: 15000,
          hireDate: '2020-01-15',
          status: 'active',
          workSchedule: 'full-time',
          emergencyContact: {
            name: 'Fatma Mohamed',
            relationship: 'Wife',
            phone: '+201234567891',
          },
          skills: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
          certifications: ['AWS Certified', 'React Developer'],
          notes: 'Experienced developer with strong technical skills',
          isSystem: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          firstName: 'Sara',
          lastName: 'Hassan',
          email: 'sara.hassan@company.com',
          phone: '+201234567892',
          dateOfBirth: '1990-07-22',
          gender: 'female',
          address: {
            street: '456 Oak Avenue',
            city: 'Alexandria',
            state: 'Alexandria',
            country: 'Egypt',
            zipCode: '21500',
          },
          employeeId: 'EMP002',
          department: 'HR',
          position: 'HR Manager',
          role: 'hr',
          salary: 12000,
          hireDate: '2019-06-10',
          status: 'active',
          workSchedule: 'full-time',
          emergencyContact: {
            name: 'Mohamed Hassan',
            relationship: 'Brother',
            phone: '+201234567893',
          },
          skills: ['Recruitment', 'Employee Relations', 'Training'],
          certifications: ['PHR Certified', 'HR Management'],
          notes: 'Excellent HR professional with strong interpersonal skills',
          isSystem: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          firstName: 'Omar',
          lastName: 'Ali',
          email: 'omar.ali@company.com',
          phone: '+201234567894',
          dateOfBirth: '1988-12-03',
          gender: 'male',
          address: {
            street: '789 Pine Road',
            city: 'Giza',
            state: 'Giza',
            country: 'Egypt',
            zipCode: '12511',
          },
          employeeId: 'EMP003',
          department: 'Finance',
          position: 'Accountant',
          role: 'finance',
          salary: 10000,
          hireDate: '2021-03-20',
          status: 'active',
          workSchedule: 'full-time',
          emergencyContact: {
            name: 'Nour Ali',
            relationship: 'Sister',
            phone: '+201234567895',
          },
          skills: ['Accounting', 'Financial Analysis', 'QuickBooks'],
          certifications: ['CPA', 'Financial Management'],
          notes: 'Detail-oriented accountant with strong analytical skills',
          isSystem: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '4',
          firstName: 'Nour',
          lastName: 'Ibrahim',
          email: 'nour.ibrahim@company.com',
          phone: '+201234567896',
          dateOfBirth: '1992-04-18',
          gender: 'female',
          address: {
            street: '321 Elm Street',
            city: 'Sharm El Sheikh',
            state: 'South Sinai',
            country: 'Egypt',
            zipCode: '46619',
          },
          employeeId: 'EMP004',
          department: 'Marketing',
          position: 'Marketing Specialist',
          role: 'marketing',
          salary: 9000,
          hireDate: '2022-08-05',
          status: 'active',
          workSchedule: 'full-time',
          emergencyContact: {
            name: 'Ahmed Ibrahim',
            relationship: 'Father',
            phone: '+201234567897',
          },
          skills: ['Digital Marketing', 'Social Media', 'Content Creation'],
          certifications: ['Google Analytics', 'Facebook Marketing'],
          notes: 'Creative marketing professional with digital expertise',
          isSystem: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '5',
          firstName: 'Mahmoud',
          lastName: 'Sayed',
          email: 'mahmoud.sayed@company.com',
          phone: '+201234567898',
          dateOfBirth: '1995-09-30',
          gender: 'male',
          address: {
            street: '654 Maple Drive',
            city: 'Luxor',
            state: 'Luxor',
            country: 'Egypt',
            zipCode: '85951',
          },
          employeeId: 'EMP005',
          department: 'Sales',
          position: 'Sales Representative',
          role: 'sales',
          salary: 8000,
          hireDate: '2023-01-01',
          status: 'active',
          workSchedule: 'full-time',
          emergencyContact: {
            name: 'Amina Sayed',
            relationship: 'Mother',
            phone: '+201234567899',
          },
          skills: ['Sales', 'Customer Relations', 'Negotiation'],
          certifications: ['Sales Management', 'Customer Service'],
          notes: 'Motivated sales professional with excellent communication skills',
          isSystem: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      localStorage.setItem(this.storageKey, JSON.stringify(defaultStaff));
    }
  }

  // Get all staff
  getAllStaff() {
    try {
      const staff = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      return staff;
    } catch (error) {
      console.error('Error getting staff:', error);
      return [];
    }
  }

  // Get active staff only
  getActiveStaff() {
    try {
      const staff = this.getAllStaff();
      return staff.filter((member) => member.status === 'active');
    } catch (error) {
      console.error('Error getting active staff:', error);
      return [];
    }
  }

  // Get inactive staff only
  getInactiveStaff() {
    try {
      const staff = this.getAllStaff();
      return staff.filter((member) => member.status === 'inactive');
    } catch (error) {
      console.error('Error getting inactive staff:', error);
      return [];
    }
  }

  // Get staff by ID
  getStaffById(id) {
    try {
      const staff = this.getAllStaff();
      return staff.find((member) => member.id === id);
    } catch (error) {
      console.error('Error getting staff by ID:', error);
      return null;
    }
  }

  // Get staff by email
  getStaffByEmail(email) {
    try {
      const staff = this.getAllStaff();
      return staff.find((member) => member.email === email);
    } catch (error) {
      console.error('Error getting staff by email:', error);
      return null;
    }
  }

  // Get staff by employee ID
  getStaffByEmployeeId(employeeId) {
    try {
      const staff = this.getAllStaff();
      return staff.find((member) => member.employeeId === employeeId);
    } catch (error) {
      console.error('Error getting staff by employee ID:', error);
      return null;
    }
  }

  // Create new staff member
  createStaff(staffData) {
    try {
      const staff = this.getAllStaff();

      // Check if email already exists
      const existingStaff = staff.find((member) => member.email === staffData.email);
      if (existingStaff) {
        throw new Error('Staff member with this email already exists');
      }

      // Check if employee ID already exists
      const existingEmployeeId = staff.find((member) => member.employeeId === staffData.employeeId);
      if (existingEmployeeId) {
        throw new Error('Staff member with this employee ID already exists');
      }

      const newStaff = {
        id: Date.now().toString(),
        ...staffData,
        status: staffData.status || 'active',
        workSchedule: staffData.workSchedule || 'full-time',
        skills: staffData.skills || [],
        certifications: staffData.certifications || [],
        notes: staffData.notes || '',
        hireDate: new Date().toISOString().split('T')[0],
        isSystem: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      staff.push(newStaff);
      localStorage.setItem(this.storageKey, JSON.stringify(staff));
      return newStaff;
    } catch (error) {
      console.error('Error creating staff member:', error);
      throw error;
    }
  }

  // Update staff member
  updateStaff(id, staffData) {
    try {
      const staff = this.getAllStaff();
      const staffIndex = staff.findIndex((member) => member.id === id);

      if (staffIndex === -1) {
        throw new Error('Staff member not found');
      }

      // Check if email already exists (excluding current staff member)
      if (staffData.email && staffData.email !== staff[staffIndex].email) {
        const existingStaff = staff.find(
          (member) => member.email === staffData.email && member.id !== id,
        );
        if (existingStaff) {
          throw new Error('Staff member with this email already exists');
        }
      }

      // Check if employee ID already exists (excluding current staff member)
      if (staffData.employeeId && staffData.employeeId !== staff[staffIndex].employeeId) {
        const existingEmployeeId = staff.find(
          (member) => member.employeeId === staffData.employeeId && member.id !== id,
        );
        if (existingEmployeeId) {
          throw new Error('Staff member with this employee ID already exists');
        }
      }

      staff[staffIndex] = {
        ...staff[staffIndex],
        ...staffData,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(staff));
      return staff[staffIndex];
    } catch (error) {
      console.error('Error updating staff member:', error);
      throw error;
    }
  }

  // Soft delete staff member
  deleteStaff(id) {
    try {
      const staff = this.getAllStaff();
      const staffIndex = staff.findIndex((member) => member.id === id);

      if (staffIndex === -1) {
        throw new Error('Staff member not found');
      }

      staff[staffIndex] = {
        ...staff[staffIndex],
        status: 'deleted',
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(staff));
      return staff[staffIndex];
    } catch (error) {
      console.error('Error deleting staff member:', error);
      throw error;
    }
  }

  // Restore staff member
  restoreStaff(id) {
    try {
      const staff = this.getAllStaff();
      const staffIndex = staff.findIndex((member) => member.id === id);

      if (staffIndex === -1) {
        throw new Error('Staff member not found');
      }

      staff[staffIndex] = {
        ...staff[staffIndex],
        status: 'active',
        deletedAt: null,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(staff));
      return staff[staffIndex];
    } catch (error) {
      console.error('Error restoring staff member:', error);
      throw error;
    }
  }

  // Permanently delete staff member
  permanentDeleteStaff(id) {
    try {
      const staff = this.getAllStaff();
      const staffIndex = staff.findIndex((member) => member.id === id);

      if (staffIndex === -1) {
        throw new Error('Staff member not found');
      }

      const filteredStaff = staff.filter((member) => member.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredStaff));
      return true;
    } catch (error) {
      console.error('Error permanently deleting staff member:', error);
      throw error;
    }
  }

  // Search staff
  searchStaff(query) {
    try {
      const staff = this.getAllStaff();
      const lowercaseQuery = query.toLowerCase();

      return staff.filter(
        (member) =>
          member.firstName.toLowerCase().includes(lowercaseQuery) ||
          member.lastName.toLowerCase().includes(lowercaseQuery) ||
          member.email.toLowerCase().includes(lowercaseQuery) ||
          member.phone.includes(query) ||
          member.employeeId.toLowerCase().includes(lowercaseQuery) ||
          member.department.toLowerCase().includes(lowercaseQuery) ||
          member.position.toLowerCase().includes(lowercaseQuery) ||
          member.skills.some((skill) => skill.toLowerCase().includes(lowercaseQuery)),
      );
    } catch (error) {
      console.error('Error searching staff:', error);
      return [];
    }
  }

  // Get staff statistics
  getStaffStats() {
    try {
      const staff = this.getAllStaff();
      const activeStaff = staff.filter((s) => s.status === 'active');
      const inactiveStaff = staff.filter((s) => s.status === 'inactive');
      const deletedStaff = staff.filter((s) => s.status === 'deleted');

      // Group by department
      const departmentStats = {};
      activeStaff.forEach((member) => {
        const dept = member.department;
        departmentStats[dept] = (departmentStats[dept] || 0) + 1;
      });

      // Group by role
      const roleStats = {};
      activeStaff.forEach((member) => {
        const role = member.role;
        roleStats[role] = (roleStats[role] || 0) + 1;
      });

      // Calculate total salary
      const totalSalary = activeStaff.reduce((sum, member) => sum + (member.salary || 0), 0);
      const averageSalary = activeStaff.length > 0 ? totalSalary / activeStaff.length : 0;

      return {
        total: staff.length,
        active: activeStaff.length,
        inactive: inactiveStaff.length,
        deleted: deletedStaff.length,
        departments: Object.keys(departmentStats).length,
        departmentStats,
        roles: Object.keys(roleStats).length,
        roleStats,
        totalSalary,
        averageSalary,
      };
    } catch (error) {
      console.error('Error getting staff statistics:', error);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        deleted: 0,
        departments: 0,
        departmentStats: {},
        roles: 0,
        roleStats: {},
        totalSalary: 0,
        averageSalary: 0,
      };
    }
  }

  // Get all departments
  getAllDepartments() {
    try {
      const staff = this.getActiveStaff();
      const departments = [...new Set(staff.map((s) => s.department))];
      return departments.sort();
    } catch (error) {
      console.error('Error getting departments:', error);
      return [];
    }
  }

  // Get all positions
  getAllPositions() {
    try {
      const staff = this.getActiveStaff();
      const positions = [...new Set(staff.map((s) => s.position))];
      return positions.sort();
    } catch (error) {
      console.error('Error getting positions:', error);
      return [];
    }
  }

  // Get all skills
  getAllSkills() {
    try {
      const staff = this.getActiveStaff();
      const skills = [...new Set(staff.flatMap((s) => s.skills))];
      return skills.sort();
    } catch (error) {
      console.error('Error getting skills:', error);
      return [];
    }
  }

  // Get staff by department
  getStaffByDepartment(department) {
    try {
      const staff = this.getActiveStaff();
      return staff.filter((member) => member.department === department);
    } catch (error) {
      console.error('Error getting staff by department:', error);
      return [];
    }
  }

  // Get staff by role
  getStaffByRole(role) {
    try {
      const staff = this.getActiveStaff();
      return staff.filter((member) => member.role === role);
    } catch (error) {
      console.error('Error getting staff by role:', error);
      return [];
    }
  }
}

// Create service instance
const staffService = new StaffService();

// Export individual methods
export const getAllStaff = () => staffService.getAllStaff();
export const getActiveStaff = () => staffService.getActiveStaff();
export const getInactiveStaff = () => staffService.getInactiveStaff();
export const getStaffById = (id) => staffService.getStaffById(id);
export const getStaffByEmail = (email) => staffService.getStaffByEmail(email);
export const getStaffByEmployeeId = (employeeId) => staffService.getStaffByEmployeeId(employeeId);
export const createStaff = (staffData) => staffService.createStaff(staffData);
export const updateStaff = (id, staffData) => staffService.updateStaff(id, staffData);
export const deleteStaff = (id) => staffService.deleteStaff(id);
export const restoreStaff = (id) => staffService.restoreStaff(id);
export const permanentDeleteStaff = (id) => staffService.permanentDeleteStaff(id);
export const searchStaff = (query) => staffService.searchStaff(query);
export const getStaffStats = () => staffService.getStaffStats();
export const getAllDepartments = () => staffService.getAllDepartments();
export const getAllPositions = () => staffService.getAllPositions();
export const getAllSkills = () => staffService.getAllSkills();
export const getStaffByDepartment = (department) => staffService.getStaffByDepartment(department);
export const getStaffByRole = (role) => staffService.getStaffByRole(role);

// MSW Handlers for API compatibility
export const StaffHandlers = [];

export default staffService;
