class AllUsersService {
  constructor() {
    this.storageKey = 'all-users-data';
    this.initializeDefaultUsers();
  }

  initializeDefaultUsers() {
    const existingData = localStorage.getItem(this.storageKey);
    if (!existingData) {
      const defaultUsers = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          role: 'admin',
          status: 'active',
          avatar: null,
          department: 'IT',
          position: 'System Administrator',
          joinDate: new Date().toISOString(),
          lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          permissions: ['read', 'write', 'delete', 'admin'],
          isEmailVerified: true,
          isPhoneVerified: true,
          twoFactorEnabled: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          phone: '+1234567891',
          role: 'manager',
          status: 'active',
          avatar: null,
          department: 'Sales',
          position: 'Sales Manager',
          joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
          lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          permissions: ['read', 'write'],
          isEmailVerified: true,
          isPhoneVerified: false,
          twoFactorEnabled: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          firstName: 'Mike',
          lastName: 'Johnson',
          email: 'mike.johnson@example.com',
          phone: '+1234567892',
          role: 'user',
          status: 'inactive',
          avatar: null,
          department: 'Marketing',
          position: 'Marketing Specialist',
          joinDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
          lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          permissions: ['read'],
          isEmailVerified: true,
          isPhoneVerified: true,
          twoFactorEnabled: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '4',
          firstName: 'Sarah',
          lastName: 'Wilson',
          email: 'sarah.wilson@example.com',
          phone: '+1234567893',
          role: 'user',
          status: 'deleted',
          avatar: null,
          department: 'HR',
          position: 'HR Assistant',
          joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
          lastLogin: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
          permissions: ['read'],
          isEmailVerified: true,
          isPhoneVerified: false,
          twoFactorEnabled: false,
          deletedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      localStorage.setItem(this.storageKey, JSON.stringify(defaultUsers));
    }
  }

  // Get all users
  getAllUsers() {
    try {
      const users = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      return users;
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  // Get user by ID
  getUserById(id) {
    try {
      const users = this.getAllUsers();
      return users.find((user) => user.id === id);
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  // Create new user
  createUser(userData) {
    try {
      const users = this.getAllUsers();
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        status: 'active',
        isEmailVerified: false,
        isPhoneVerified: false,
        twoFactorEnabled: false,
        joinDate: new Date().toISOString(),
        lastLogin: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem(this.storageKey, JSON.stringify(users));
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Update user
  updateUser(id, userData) {
    try {
      const users = this.getAllUsers();
      const userIndex = users.findIndex((user) => user.id === id);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      users[userIndex] = {
        ...users[userIndex],
        ...userData,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(users));
      return users[userIndex];
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Delete user (soft delete)
  deleteUser(id) {
    try {
      const users = this.getAllUsers();
      const userIndex = users.findIndex((user) => user.id === id);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      users[userIndex] = {
        ...users[userIndex],
        status: 'deleted',
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Permanently delete user
  permanentDeleteUser(id) {
    try {
      const users = this.getAllUsers();
      const filteredUsers = users.filter((user) => user.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredUsers));
      return true;
    } catch (error) {
      console.error('Error permanently deleting user:', error);
      throw error;
    }
  }

  // Restore user
  restoreUser(id) {
    try {
      const users = this.getAllUsers();
      const userIndex = users.findIndex((user) => user.id === id);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      users[userIndex] = {
        ...users[userIndex],
        status: 'active',
        deletedAt: null,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(users));
      return users[userIndex];
    } catch (error) {
      console.error('Error restoring user:', error);
      throw error;
    }
  }

  // Toggle user status
  toggleUserStatus(id) {
    try {
      const users = this.getAllUsers();
      const userIndex = users.findIndex((user) => user.id === id);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const currentStatus = users[userIndex].status;
      users[userIndex] = {
        ...users[userIndex],
        status: currentStatus === 'active' ? 'inactive' : 'active',
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(users));
      return users[userIndex];
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  }

  // Search users
  searchUsers(query) {
    try {
      const users = this.getAllUsers();
      const lowercaseQuery = query.toLowerCase();

      return users.filter((user) => {
        return (
          user.firstName.toLowerCase().includes(lowercaseQuery) ||
          user.lastName.toLowerCase().includes(lowercaseQuery) ||
          user.email.toLowerCase().includes(lowercaseQuery) ||
          user.phone.includes(query) ||
          user.department.toLowerCase().includes(lowercaseQuery) ||
          user.position.toLowerCase().includes(lowercaseQuery)
        );
      });
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  // Get users by status
  getUsersByStatus(status) {
    try {
      const users = this.getAllUsers();
      return users.filter((user) => user.status === status);
    } catch (error) {
      console.error('Error getting users by status:', error);
      return [];
    }
  }

  // Get users by role
  getUsersByRole(role) {
    try {
      const users = this.getAllUsers();
      return users.filter((user) => user.role === role);
    } catch (error) {
      console.error('Error getting users by role:', error);
      return [];
    }
  }

  // Get user statistics
  getUserStats() {
    try {
      const users = this.getAllUsers();
      const activeUsers = users.filter((user) => user.status === 'active');
      const inactiveUsers = users.filter((user) => user.status === 'inactive');
      const deletedUsers = users.filter((user) => user.status === 'deleted');
      const adminUsers = users.filter((user) => user.role === 'admin');
      const managerUsers = users.filter((user) => user.role === 'manager');
      const regularUsers = users.filter((user) => user.role === 'user');

      return {
        total: users.length,
        active: activeUsers.length,
        inactive: inactiveUsers.length,
        deleted: deletedUsers.length,
        admins: adminUsers.length,
        managers: managerUsers.length,
        users: regularUsers.length,
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        deleted: 0,
        admins: 0,
        managers: 0,
        users: 0,
      };
    }
  }

  // Update user permissions
  updateUserPermissions(id, permissions) {
    try {
      const users = this.getAllUsers();
      const userIndex = users.findIndex((user) => user.id === id);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      users[userIndex] = {
        ...users[userIndex],
        permissions,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(users));
      return users[userIndex];
    } catch (error) {
      console.error('Error updating user permissions:', error);
      throw error;
    }
  }

  // Verify user email
  verifyUserEmail(id) {
    try {
      const users = this.getAllUsers();
      const userIndex = users.findIndex((user) => user.id === id);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      users[userIndex] = {
        ...users[userIndex],
        isEmailVerified: true,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(users));
      return users[userIndex];
    } catch (error) {
      console.error('Error verifying user email:', error);
      throw error;
    }
  }

  // Verify user phone
  verifyUserPhone(id) {
    try {
      const users = this.getAllUsers();
      const userIndex = users.findIndex((user) => user.id === id);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      users[userIndex] = {
        ...users[userIndex],
        isPhoneVerified: true,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(users));
      return users[userIndex];
    } catch (error) {
      console.error('Error verifying user phone:', error);
      throw error;
    }
  }

  // Toggle two-factor authentication
  toggleTwoFactorAuth(id) {
    try {
      const users = this.getAllUsers();
      const userIndex = users.findIndex((user) => user.id === id);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      users[userIndex] = {
        ...users[userIndex],
        twoFactorEnabled: !users[userIndex].twoFactorEnabled,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(users));
      return users[userIndex];
    } catch (error) {
      console.error('Error toggling two-factor auth:', error);
      throw error;
    }
  }
}

// Create service instance
const allUsersService = new AllUsersService();

// Export individual methods
export const getAllUsers = () => allUsersService.getAllUsers();
export const getUserById = (id) => allUsersService.getUserById(id);
export const createUser = (userData) => allUsersService.createUser(userData);
export const updateUser = (id, userData) => allUsersService.updateUser(id, userData);
export const deleteUser = (id) => allUsersService.deleteUser(id);
export const permanentDeleteUser = (id) => allUsersService.permanentDeleteUser(id);
export const restoreUser = (id) => allUsersService.restoreUser(id);
export const toggleUserStatus = (id) => allUsersService.toggleUserStatus(id);
export const searchUsers = (query) => allUsersService.searchUsers(query);
export const getUsersByStatus = (status) => allUsersService.getUsersByStatus(status);
export const getUsersByRole = (role) => allUsersService.getUsersByRole(role);
export const getUserStats = () => allUsersService.getUserStats();
export const updateUserPermissions = (id, permissions) => allUsersService.updateUserPermissions(id, permissions);
export const verifyUserEmail = (id) => allUsersService.verifyUserEmail(id);
export const verifyUserPhone = (id) => allUsersService.verifyUserPhone(id);
export const toggleTwoFactorAuth = (id) => allUsersService.toggleTwoFactorAuth(id);

// MSW Handlers for API compatibility
export const AllUsersHandlers = [];