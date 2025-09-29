class CustomersService {
  constructor() {
    this.storageKey = 'customers';
    this.initializeDefaultCustomers();
  }

  // Initialize default customers
  initializeDefaultCustomers() {
    const existingCustomers = localStorage.getItem(this.storageKey);
    if (!existingCustomers) {
      const defaultCustomers = [
        {
          id: '1',
          firstName: 'Ahmed',
          lastName: 'Hassan',
          email: 'ahmed.hassan@email.com',
          phone: '+201234567890',
          dateOfBirth: '1990-05-15',
          gender: 'male',
          address: {
            street: '123 Main Street',
            city: 'Cairo',
            state: 'Cairo',
            country: 'Egypt',
            zipCode: '11511',
          },
          status: 'active',
          customerType: 'premium',
          registrationDate: '2023-01-15',
          lastLogin: '2024-01-10',
          totalOrders: 25,
          totalSpent: 15000,
          notes: 'VIP customer with high purchase frequency',
          tags: ['VIP', 'Frequent Buyer'],
          isSystem: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          firstName: 'Fatma',
          lastName: 'Ali',
          email: 'fatma.ali@email.com',
          phone: '+201234567891',
          dateOfBirth: '1985-08-22',
          gender: 'female',
          address: {
            street: '456 Oak Avenue',
            city: 'Alexandria',
            state: 'Alexandria',
            country: 'Egypt',
            zipCode: '21500',
          },
          status: 'active',
          customerType: 'regular',
          registrationDate: '2023-03-10',
          lastLogin: '2024-01-08',
          totalOrders: 12,
          totalSpent: 8500,
          notes: 'Regular customer, prefers online shopping',
          tags: ['Online Shopper'],
          isSystem: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          firstName: 'Mohamed',
          lastName: 'Ibrahim',
          email: 'mohamed.ibrahim@email.com',
          phone: '+201234567892',
          dateOfBirth: '1992-12-03',
          gender: 'male',
          address: {
            street: '789 Pine Road',
            city: 'Giza',
            state: 'Giza',
            country: 'Egypt',
            zipCode: '12511',
          },
          status: 'inactive',
          customerType: 'regular',
          registrationDate: '2023-06-20',
          lastLogin: '2023-11-15',
          totalOrders: 5,
          totalSpent: 3200,
          notes: 'Inactive customer, last purchase was 2 months ago',
          tags: ['Inactive'],
          isSystem: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '4',
          firstName: 'Nour',
          lastName: 'Mahmoud',
          email: 'nour.mahmoud@email.com',
          phone: '+201234567893',
          dateOfBirth: '1988-04-18',
          gender: 'female',
          address: {
            street: '321 Elm Street',
            city: 'Sharm El Sheikh',
            state: 'South Sinai',
            country: 'Egypt',
            zipCode: '46619',
          },
          status: 'active',
          customerType: 'premium',
          registrationDate: '2022-11-05',
          lastLogin: '2024-01-12',
          totalOrders: 45,
          totalSpent: 28000,
          notes: 'Premium customer, high value purchases',
          tags: ['VIP', 'High Value', 'Loyal'],
          isSystem: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '5',
          firstName: 'Omar',
          lastName: 'Sayed',
          email: 'omar.sayed@email.com',
          phone: '+201234567894',
          dateOfBirth: '1995-09-30',
          gender: 'male',
          address: {
            street: '654 Maple Drive',
            city: 'Luxor',
            state: 'Luxor',
            country: 'Egypt',
            zipCode: '85951',
          },
          status: 'active',
          customerType: 'new',
          registrationDate: '2024-01-01',
          lastLogin: '2024-01-12',
          totalOrders: 2,
          totalSpent: 1200,
          notes: 'New customer, first-time buyer',
          tags: ['New Customer'],
          isSystem: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      localStorage.setItem(this.storageKey, JSON.stringify(defaultCustomers));
    }
  }

  // Get all customers
  getAllCustomers() {
    try {
      const customers = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      return customers;
    } catch (error) {
      console.error('Error getting customers:', error);
      return [];
    }
  }

  // Get active customers only
  getActiveCustomers() {
    try {
      const customers = this.getAllCustomers();
      return customers.filter((customer) => customer.status === 'active');
    } catch (error) {
      console.error('Error getting active customers:', error);
      return [];
    }
  }

  // Get inactive customers only
  getInactiveCustomers() {
    try {
      const customers = this.getAllCustomers();
      return customers.filter((customer) => customer.status === 'inactive');
    } catch (error) {
      console.error('Error getting inactive customers:', error);
      return [];
    }
  }

  // Get customer by ID
  getCustomerById(id) {
    try {
      const customers = this.getAllCustomers();
      return customers.find((customer) => customer.id === id);
    } catch (error) {
      console.error('Error getting customer by ID:', error);
      return null;
    }
  }

  // Get customer by email
  getCustomerByEmail(email) {
    try {
      const customers = this.getAllCustomers();
      return customers.find((customer) => customer.email === email);
    } catch (error) {
      console.error('Error getting customer by email:', error);
      return null;
    }
  }

  // Create new customer
  createCustomer(customerData) {
    try {
      const customers = this.getAllCustomers();

      // Check if email already exists
      const existingCustomer = customers.find((customer) => customer.email === customerData.email);
      if (existingCustomer) {
        throw new Error('Customer with this email already exists');
      }

      const newCustomer = {
        id: Date.now().toString(),
        ...customerData,
        status: customerData.status || 'active',
        customerType: customerData.customerType || 'regular',
        totalOrders: 0,
        totalSpent: 0,
        tags: customerData.tags || [],
        notes: customerData.notes || '',
        registrationDate: new Date().toISOString().split('T')[0],
        lastLogin: null,
        isSystem: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      customers.push(newCustomer);
      localStorage.setItem(this.storageKey, JSON.stringify(customers));
      return newCustomer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  // Update customer
  updateCustomer(id, customerData) {
    try {
      const customers = this.getAllCustomers();
      const customerIndex = customers.findIndex((customer) => customer.id === id);

      if (customerIndex === -1) {
        throw new Error('Customer not found');
      }

      // Check if email already exists (excluding current customer)
      if (customerData.email && customerData.email !== customers[customerIndex].email) {
        const existingCustomer = customers.find(
          (customer) => customer.email === customerData.email && customer.id !== id,
        );
        if (existingCustomer) {
          throw new Error('Customer with this email already exists');
        }
      }

      customers[customerIndex] = {
        ...customers[customerIndex],
        ...customerData,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(customers));
      return customers[customerIndex];
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }

  // Soft delete customer
  deleteCustomer(id) {
    try {
      const customers = this.getAllCustomers();
      const customerIndex = customers.findIndex((customer) => customer.id === id);

      if (customerIndex === -1) {
        throw new Error('Customer not found');
      }

      customers[customerIndex] = {
        ...customers[customerIndex],
        status: 'deleted',
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(customers));
      return customers[customerIndex];
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  }

  // Restore customer
  restoreCustomer(id) {
    try {
      const customers = this.getAllCustomers();
      const customerIndex = customers.findIndex((customer) => customer.id === id);

      if (customerIndex === -1) {
        throw new Error('Customer not found');
      }

      customers[customerIndex] = {
        ...customers[customerIndex],
        status: 'active',
        deletedAt: null,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(customers));
      return customers[customerIndex];
    } catch (error) {
      console.error('Error restoring customer:', error);
      throw error;
    }
  }

  // Permanently delete customer
  permanentDeleteCustomer(id) {
    try {
      const customers = this.getAllCustomers();
      const customerIndex = customers.findIndex((customer) => customer.id === id);

      if (customerIndex === -1) {
        throw new Error('Customer not found');
      }

      const filteredCustomers = customers.filter((customer) => customer.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredCustomers));
      return true;
    } catch (error) {
      console.error('Error permanently deleting customer:', error);
      throw error;
    }
  }

  // Search customers
  searchCustomers(query) {
    try {
      const customers = this.getAllCustomers();
      const lowercaseQuery = query.toLowerCase();

      return customers.filter(
        (customer) =>
          customer.firstName.toLowerCase().includes(lowercaseQuery) ||
          customer.lastName.toLowerCase().includes(lowercaseQuery) ||
          customer.email.toLowerCase().includes(lowercaseQuery) ||
          customer.phone.includes(query) ||
          customer.address.city.toLowerCase().includes(lowercaseQuery) ||
          customer.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
      );
    } catch (error) {
      console.error('Error searching customers:', error);
      return [];
    }
  }

  // Get customer statistics
  getCustomerStats() {
    try {
      const customers = this.getAllCustomers();
      const activeCustomers = customers.filter((c) => c.status === 'active');
      const inactiveCustomers = customers.filter((c) => c.status === 'inactive');
      const deletedCustomers = customers.filter((c) => c.status === 'deleted');
      const premiumCustomers = customers.filter((c) => c.customerType === 'premium');
      const regularCustomers = customers.filter((c) => c.customerType === 'regular');
      const newCustomers = customers.filter((c) => c.customerType === 'new');

      // Calculate total revenue
      const totalRevenue = customers.reduce((sum, customer) => sum + (customer.totalSpent || 0), 0);
      const totalOrders = customers.reduce((sum, customer) => sum + (customer.totalOrders || 0), 0);

      // Group by city
      const cityStats = {};
      activeCustomers.forEach((customer) => {
        const city = customer.address.city;
        cityStats[city] = (cityStats[city] || 0) + 1;
      });

      return {
        total: customers.length,
        active: activeCustomers.length,
        inactive: inactiveCustomers.length,
        deleted: deletedCustomers.length,
        premium: premiumCustomers.length,
        regular: regularCustomers.length,
        new: newCustomers.length,
        totalRevenue,
        totalOrders,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        cities: Object.keys(cityStats).length,
        cityStats,
      };
    } catch (error) {
      console.error('Error getting customer statistics:', error);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        deleted: 0,
        premium: 0,
        regular: 0,
        new: 0,
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        cities: 0,
        cityStats: {},
      };
    }
  }

  // Get all cities
  getAllCities() {
    try {
      const customers = this.getActiveCustomers();
      const cities = [...new Set(customers.map((c) => c.address.city))];
      return cities.sort();
    } catch (error) {
      console.error('Error getting cities:', error);
      return [];
    }
  }

  // Get all tags
  getAllTags() {
    try {
      const customers = this.getActiveCustomers();
      const tags = [...new Set(customers.flatMap((c) => c.tags))];
      return tags.sort();
    } catch (error) {
      console.error('Error getting tags:', error);
      return [];
    }
  }

  // Update customer order stats
  updateCustomerOrderStats(customerId, orderAmount) {
    try {
      const customers = this.getAllCustomers();
      const customerIndex = customers.findIndex((customer) => customer.id === customerId);

      if (customerIndex === -1) {
        throw new Error('Customer not found');
      }

      customers[customerIndex] = {
        ...customers[customerIndex],
        totalOrders: (customers[customerIndex].totalOrders || 0) + 1,
        totalSpent: (customers[customerIndex].totalSpent || 0) + orderAmount,
        lastLogin: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(customers));
      return customers[customerIndex];
    } catch (error) {
      console.error('Error updating customer order stats:', error);
      throw error;
    }
  }
}

// Create service instance
const customersService = new CustomersService();

// Export individual methods
export const getAllCustomers = () => customersService.getAllCustomers();
export const getActiveCustomers = () => customersService.getActiveCustomers();
export const getInactiveCustomers = () => customersService.getInactiveCustomers();
export const getCustomerById = (id) => customersService.getCustomerById(id);
export const getCustomerByEmail = (email) => customersService.getCustomerByEmail(email);
export const createCustomer = (customerData) => customersService.createCustomer(customerData);
export const updateCustomer = (id, customerData) =>
  customersService.updateCustomer(id, customerData);
export const deleteCustomer = (id) => customersService.deleteCustomer(id);
export const restoreCustomer = (id) => customersService.restoreCustomer(id);
export const permanentDeleteCustomer = (id) => customersService.permanentDeleteCustomer(id);
export const searchCustomers = (query) => customersService.searchCustomers(query);
export const getCustomerStats = () => customersService.getCustomerStats();
export const getAllCities = () => customersService.getAllCities();
export const getAllTags = () => customersService.getAllTags();
export const updateCustomerOrderStats = (customerId, orderAmount) =>
  customersService.updateCustomerOrderStats(customerId, orderAmount);

// MSW Handlers for API compatibility
export const CustomersHandlers = [];

export default customersService;
