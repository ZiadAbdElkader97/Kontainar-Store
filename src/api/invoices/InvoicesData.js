class InvoicesService {
  constructor() {
    this.storageKey = 'invoices';
    this.initializeDefaultInvoices();
  }

  // Initialize default invoices if none exist
  initializeDefaultInvoices() {
    const existingInvoices = this.getAllInvoices();
    if (existingInvoices.length === 0) {
      const defaultInvoices = [
        {
          id: 1,
          invoiceNumber: 'INV-001',
          customerName: 'John Doe',
          customerEmail: 'john.doe@example.com',
          customerPhone: '+1234567890',
          customerAddress: '123 Main St, New York, NY 10001',
          items: [
            {
              id: 1,
              name: 'Product A',
              description: 'High quality product A',
              quantity: 2,
              unitPrice: 50.0,
              total: 100.0,
            },
            {
              id: 2,
              name: 'Product B',
              description: 'Premium product B',
              quantity: 1,
              unitPrice: 75.0,
              total: 75.0,
            },
          ],
          subtotal: 175.0,
          taxRate: 8.5,
          taxAmount: 14.88,
          discount: 10.0,
          total: 179.88,
          status: 'paid',
          paymentMethod: 'credit_card',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          issueDate: new Date().toISOString(),
          notes: 'Thank you for your business!',
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          invoiceNumber: 'INV-002',
          customerName: 'Jane Smith',
          customerEmail: 'jane.smith@example.com',
          customerPhone: '+1987654321',
          customerAddress: '456 Oak Ave, Los Angeles, CA 90210',
          items: [
            {
              id: 1,
              name: 'Service Package',
              description: 'Complete service package',
              quantity: 1,
              unitPrice: 200.0,
              total: 200.0,
            },
          ],
          subtotal: 200.0,
          taxRate: 10.0,
          taxAmount: 20.0,
          discount: 0.0,
          total: 220.0,
          status: 'pending',
          paymentMethod: 'bank_transfer',
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          issueDate: new Date().toISOString(),
          notes: 'Payment due within 15 days',
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 3,
          invoiceNumber: 'INV-003',
          customerName: 'Bob Johnson',
          customerEmail: 'bob.johnson@example.com',
          customerPhone: '+1122334455',
          customerAddress: '789 Pine St, Chicago, IL 60601',
          items: [
            {
              id: 1,
              name: 'Consultation',
              description: 'Professional consultation service',
              quantity: 3,
              unitPrice: 100.0,
              total: 300.0,
            },
          ],
          subtotal: 300.0,
          taxRate: 7.5,
          taxAmount: 22.5,
          discount: 25.0,
          total: 297.5,
          status: 'overdue',
          paymentMethod: 'check',
          dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          issueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Overdue payment - please contact us',
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(defaultInvoices));
    }
  }

  // Get all invoices (excluding deleted)
  getAllInvoices() {
    try {
      const invoices = localStorage.getItem(this.storageKey);
      const allInvoices = invoices ? JSON.parse(invoices) : [];
      return allInvoices.filter((invoice) => !invoice.isDeleted);
    } catch (error) {
      console.error('Error getting invoices:', error);
      return [];
    }
  }

  // Get all invoices including deleted
  getAllInvoicesIncludingDeleted() {
    try {
      const invoices = localStorage.getItem(this.storageKey);
      return invoices ? JSON.parse(invoices) : [];
    } catch (error) {
      console.error('Error getting all invoices:', error);
      return [];
    }
  }

  // Get deleted invoices only
  getDeletedInvoices() {
    try {
      const invoices = localStorage.getItem(this.storageKey);
      const allInvoices = invoices ? JSON.parse(invoices) : [];
      return allInvoices.filter((invoice) => invoice.isDeleted);
    } catch (error) {
      console.error('Error getting deleted invoices:', error);
      return [];
    }
  }

  // Get invoice by ID
  getInvoiceById(id) {
    try {
      const invoices = this.getAllInvoicesIncludingDeleted();
      return invoices.find((invoice) => invoice.id === parseInt(id));
    } catch (error) {
      console.error('Error getting invoice by ID:', error);
      return null;
    }
  }

  // Create new invoice
  createInvoice(invoiceData) {
    try {
      const invoices = this.getAllInvoicesIncludingDeleted();
      const newInvoice = {
        id: Date.now(),
        invoiceNumber: invoiceData.invoiceNumber,
        customerName: invoiceData.customerName,
        customerEmail: invoiceData.customerEmail,
        customerPhone: invoiceData.customerPhone,
        customerAddress: invoiceData.customerAddress,
        items: invoiceData.items || [],
        subtotal: invoiceData.subtotal || 0,
        taxRate: invoiceData.taxRate || 0,
        taxAmount: invoiceData.taxAmount || 0,
        discount: invoiceData.discount || 0,
        total: invoiceData.total || 0,
        status: invoiceData.status || 'draft',
        paymentMethod: invoiceData.paymentMethod || '',
        dueDate: invoiceData.dueDate,
        issueDate: invoiceData.issueDate || new Date().toISOString(),
        notes: invoiceData.notes || '',
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      invoices.push(newInvoice);
      localStorage.setItem(this.storageKey, JSON.stringify(invoices));
      return newInvoice;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  // Update invoice
  updateInvoice(id, invoiceData) {
    try {
      const invoices = this.getAllInvoicesIncludingDeleted();
      const index = invoices.findIndex((invoice) => invoice.id === parseInt(id));

      if (index === -1) {
        throw new Error('Invoice not found');
      }

      invoices[index] = {
        ...invoices[index],
        ...invoiceData,
        id: parseInt(id),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(invoices));
      return invoices[index];
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  }

  // Soft delete invoice
  deleteInvoice(id) {
    try {
      const invoices = this.getAllInvoicesIncludingDeleted();
      const index = invoices.findIndex((invoice) => invoice.id === parseInt(id));

      if (index === -1) {
        throw new Error('Invoice not found');
      }

      invoices[index].isDeleted = true;
      invoices[index].deletedAt = new Date().toISOString();
      invoices[index].updatedAt = new Date().toISOString();

      localStorage.setItem(this.storageKey, JSON.stringify(invoices));
      return true;
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  }

  // Restore deleted invoice
  restoreInvoice(id) {
    try {
      const invoices = this.getAllInvoicesIncludingDeleted();
      const index = invoices.findIndex((invoice) => invoice.id === parseInt(id));

      if (index === -1) {
        throw new Error('Invoice not found');
      }

      invoices[index].isDeleted = false;
      invoices[index].restoredAt = new Date().toISOString();
      invoices[index].updatedAt = new Date().toISOString();
      delete invoices[index].deletedAt;

      localStorage.setItem(this.storageKey, JSON.stringify(invoices));
      return invoices[index];
    } catch (error) {
      console.error('Error restoring invoice:', error);
      throw error;
    }
  }

  // Permanently delete invoice
  permanentDeleteInvoice(id) {
    try {
      const invoices = this.getAllInvoicesIncludingDeleted();
      const filteredInvoices = invoices.filter((invoice) => invoice.id !== parseInt(id));
      localStorage.setItem(this.storageKey, JSON.stringify(filteredInvoices));
      return true;
    } catch (error) {
      console.error('Error permanently deleting invoice:', error);
      throw error;
    }
  }

  // Search invoices
  searchInvoices(query) {
    try {
      const invoices = this.getAllInvoices();
      const lowercaseQuery = query.toLowerCase();

      return invoices.filter(
        (invoice) =>
          invoice.invoiceNumber.toLowerCase().includes(lowercaseQuery) ||
          invoice.customerName.toLowerCase().includes(lowercaseQuery) ||
          invoice.customerEmail.toLowerCase().includes(lowercaseQuery) ||
          invoice.status.toLowerCase().includes(lowercaseQuery),
      );
    } catch (error) {
      console.error('Error searching invoices:', error);
      return [];
    }
  }

  // Get invoices by status
  getInvoicesByStatus(status) {
    try {
      const invoices = this.getAllInvoices();
      return invoices.filter((invoice) => invoice.status === status);
    } catch (error) {
      console.error('Error getting invoices by status:', error);
      return [];
    }
  }

  // Update invoice status
  updateInvoiceStatus(id, status) {
    try {
      const invoices = this.getAllInvoicesIncludingDeleted();
      const index = invoices.findIndex((invoice) => invoice.id === parseInt(id));

      if (index === -1) {
        throw new Error('Invoice not found');
      }

      invoices[index].status = status;
      invoices[index].updatedAt = new Date().toISOString();

      localStorage.setItem(this.storageKey, JSON.stringify(invoices));
      return invoices[index];
    } catch (error) {
      console.error('Error updating invoice status:', error);
      throw error;
    }
  }

  // Generate next invoice number
  generateInvoiceNumber() {
    try {
      const invoices = this.getAllInvoicesIncludingDeleted();
      const invoiceNumbers = invoices.map((invoice) => invoice.invoiceNumber);
      let counter = 1;

      while (true) {
        const newNumber = `INV-${counter.toString().padStart(3, '0')}`;
        if (!invoiceNumbers.includes(newNumber)) {
          return newNumber;
        }
        counter++;
      }
    } catch (error) {
      console.error('Error generating invoice number:', error);
      return `INV-${Date.now()}`;
    }
  }

  // Get invoice statistics
  getInvoiceStats() {
    try {
      const invoices = this.getAllInvoices();
      const totalInvoices = invoices.length;
      const paidInvoices = invoices.filter((invoice) => invoice.status === 'paid').length;
      const pendingInvoices = invoices.filter((invoice) => invoice.status === 'pending').length;
      const overdueInvoices = invoices.filter((invoice) => invoice.status === 'overdue').length;
      const draftInvoices = invoices.filter((invoice) => invoice.status === 'draft').length;

      const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
      const paidAmount = invoices
        .filter((invoice) => invoice.status === 'paid')
        .reduce((sum, invoice) => sum + invoice.total, 0);
      const pendingAmount = invoices
        .filter((invoice) => invoice.status === 'pending')
        .reduce((sum, invoice) => sum + invoice.total, 0);
      const overdueAmount = invoices
        .filter((invoice) => invoice.status === 'overdue')
        .reduce((sum, invoice) => sum + invoice.total, 0);

      return {
        totalInvoices,
        paidInvoices,
        pendingInvoices,
        overdueInvoices,
        draftInvoices,
        totalAmount,
        paidAmount,
        pendingAmount,
        overdueAmount,
      };
    } catch (error) {
      console.error('Error getting invoice stats:', error);
      return {
        totalInvoices: 0,
        paidInvoices: 0,
        pendingInvoices: 0,
        overdueInvoices: 0,
        draftInvoices: 0,
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
        overdueAmount: 0,
      };
    }
  }
}

// Create instance and export methods
const invoicesService = new InvoicesService();

export const getAllInvoices = () => invoicesService.getAllInvoices();
export const getAllInvoicesIncludingDeleted = () =>
  invoicesService.getAllInvoicesIncludingDeleted();
export const getDeletedInvoices = () => invoicesService.getDeletedInvoices();
export const getInvoiceById = (id) => invoicesService.getInvoiceById(id);
export const createInvoice = (invoiceData) => invoicesService.createInvoice(invoiceData);
export const updateInvoice = (id, invoiceData) => invoicesService.updateInvoice(id, invoiceData);
export const deleteInvoice = (id) => invoicesService.deleteInvoice(id);
export const restoreInvoice = (id) => invoicesService.restoreInvoice(id);
export const permanentDeleteInvoice = (id) => invoicesService.permanentDeleteInvoice(id);
export const searchInvoices = (query) => invoicesService.searchInvoices(query);
export const getInvoicesByStatus = (status) => invoicesService.getInvoicesByStatus(status);
export const updateInvoiceStatus = (id, status) => invoicesService.updateInvoiceStatus(id, status);
export const generateInvoiceNumber = () => invoicesService.generateInvoiceNumber();
export const getInvoiceStats = () => invoicesService.getInvoiceStats();

// MSW Handlers for API compatibility
export const InvoiceHandlers = [];
