// Warehouse Service - إدارة المستودع والمشتريات والمخزون
import { v4 as uuidv4 } from 'uuid';

class WarehouseService {
  constructor() {
    this.purchasesKey = 'warehouse_purchases';
    this.inventoryKey = 'warehouse_inventory';
    this.suppliersKey = 'warehouse_suppliers';
    this.initializeDefaultData();
  }

  // Initialize default data
  initializeDefaultData() {
    this.initializeSuppliers();
    this.initializeInventory();
    this.initializePurchases();
  }

  // Initialize default suppliers
  initializeSuppliers() {
    try {
      const existingSuppliers = localStorage.getItem(this.suppliersKey);
      if (!existingSuppliers || JSON.parse(existingSuppliers).length === 0) {
        const defaultSuppliers = [
          {
            id: 'supplier-1',
            name: 'Tech Solutions Ltd',
            contactPerson: 'Ahmed Hassan',
            email: 'ahmed@techsolutions.com',
            phone: '+20 123 456 7890',
            address: '123 Tech Street, Cairo, Egypt',
            category: 'Electronics',
            status: 'active',
            creditLimit: 50000,
            paymentTerms: '30 days',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'supplier-2',
            name: 'Fashion World',
            contactPerson: 'Fatma Ali',
            email: 'fatma@fashionworld.com',
            phone: '+20 987 654 3210',
            address: '456 Fashion Ave, Alexandria, Egypt',
            category: 'Fashion',
            status: 'active',
            creditLimit: 30000,
            paymentTerms: '15 days',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'supplier-3',
            name: 'Home & Garden Supplies',
            contactPerson: 'Mohamed Ibrahim',
            email: 'mohamed@homesupplies.com',
            phone: '+20 555 123 4567',
            address: '789 Garden St, Giza, Egypt',
            category: 'Home & Garden',
            status: 'active',
            creditLimit: 25000,
            paymentTerms: '45 days',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        localStorage.setItem(this.suppliersKey, JSON.stringify(defaultSuppliers));
      }
    } catch (error) {
      console.error('Error initializing suppliers:', error);
    }
  }

  // Initialize default inventory
  initializeInventory() {
    try {
      const existingInventory = localStorage.getItem(this.inventoryKey);
      if (!existingInventory || JSON.parse(existingInventory).length === 0) {
        const defaultInventory = [
          {
            id: 'inv-1',
            productId: 'PROD-001',
            productName: 'iPhone 15 Pro Max',
            sku: 'IPH15PM-001',
            category: 'Electronics',
            currentStock: 25,
            minStock: 5,
            maxStock: 100,
            unitCost: 800,
            sellingPrice: 1079,
            location: 'A-01-01',
            supplierId: 'supplier-1',
            lastUpdated: new Date().toISOString(),
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'inv-2',
            productId: 'PROD-002',
            productName: 'Samsung Galaxy S24 Ultra',
            sku: 'SGS24U-002',
            category: 'Electronics',
            currentStock: 15,
            minStock: 3,
            maxStock: 80,
            unitCost: 750,
            sellingPrice: 1104,
            location: 'A-01-02',
            supplierId: 'supplier-1',
            lastUpdated: new Date().toISOString(),
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'inv-3',
            productId: 'PROD-004',
            productName: 'Nike Air Max 270',
            sku: 'NAM270-004',
            category: 'Fashion',
            currentStock: 50,
            minStock: 10,
            maxStock: 200,
            unitCost: 80,
            sellingPrice: 120,
            location: 'B-02-01',
            supplierId: 'supplier-2',
            lastUpdated: new Date().toISOString(),
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        localStorage.setItem(this.inventoryKey, JSON.stringify(defaultInventory));
      }
    } catch (error) {
      console.error('Error initializing inventory:', error);
    }
  }

  // Initialize default purchases
  initializePurchases() {
    try {
      const existingPurchases = localStorage.getItem(this.purchasesKey);
      if (!existingPurchases || JSON.parse(existingPurchases).length === 0) {
        const defaultPurchases = [
          {
            id: 'purchase-1',
            purchaseNumber: 'PO-2024-001',
            supplierId: 'supplier-1',
            supplierName: 'Tech Solutions Ltd',
            orderDate: '2024-01-15',
            expectedDelivery: '2024-01-25',
            status: 'pending',
            items: [
              {
                id: 'item-1',
                productId: 'PROD-001',
                productName: 'iPhone 15 Pro Max',
                sku: 'IPH15PM-001',
                quantity: 50,
                unitCost: 800,
                totalCost: 40000,
              },
              {
                id: 'item-2',
                productId: 'PROD-002',
                productName: 'Samsung Galaxy S24 Ultra',
                sku: 'SGS24U-002',
                quantity: 30,
                unitCost: 750,
                totalCost: 22500,
              },
            ],
            subtotal: 62500,
            tax: 6250,
            total: 68750,
            notes: 'Urgent order for new product launch',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'purchase-2',
            purchaseNumber: 'PO-2024-002',
            supplierId: 'supplier-2',
            supplierName: 'Fashion World',
            orderDate: '2024-01-20',
            expectedDelivery: '2024-01-30',
            status: 'delivered',
            items: [
              {
                id: 'item-3',
                productId: 'PROD-004',
                productName: 'Nike Air Max 270',
                sku: 'NAM270-004',
                quantity: 100,
                unitCost: 80,
                totalCost: 8000,
              },
            ],
            subtotal: 8000,
            tax: 800,
            total: 8800,
            notes: 'Regular stock replenishment',
            deliveredDate: '2024-01-28',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        localStorage.setItem(this.purchasesKey, JSON.stringify(defaultPurchases));
      }
    } catch (error) {
      console.error('Error initializing purchases:', error);
    }
  }

  // ==================== SUPPLIERS ====================

  // Get all suppliers
  getAllSuppliers() {
    try {
      const suppliers = JSON.parse(localStorage.getItem(this.suppliersKey) || '[]');
      return Promise.resolve(suppliers);
    } catch (error) {
      console.error('Error getting suppliers:', error);
      return Promise.reject(error);
    }
  }

  // Get supplier by ID
  getSupplierById(id) {
    try {
      const suppliers = JSON.parse(localStorage.getItem(this.suppliersKey) || '[]');
      const supplier = suppliers.find((s) => s.id === id);
      return Promise.resolve(supplier || null);
    } catch (error) {
      console.error('Error getting supplier by ID:', error);
      return Promise.reject(error);
    }
  }

  // Create new supplier
  createSupplier(supplierData) {
    try {
      const suppliers = JSON.parse(localStorage.getItem(this.suppliersKey) || '[]');

      // Check if supplier name already exists
      const nameExists = suppliers.some(
        (s) => s.name.toLowerCase() === supplierData.name.toLowerCase(),
      );

      if (nameExists) {
        return Promise.reject(new Error('Supplier name already exists'));
      }

      const newSupplier = {
        id: uuidv4(),
        ...supplierData,
        status: supplierData.status || 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      suppliers.push(newSupplier);
      localStorage.setItem(this.suppliersKey, JSON.stringify(suppliers));

      return Promise.resolve(newSupplier);
    } catch (error) {
      console.error('Error creating supplier:', error);
      return Promise.reject(error);
    }
  }

  // Update supplier
  updateSupplier(id, supplierData) {
    try {
      const suppliers = JSON.parse(localStorage.getItem(this.suppliersKey) || '[]');
      const index = suppliers.findIndex((s) => s.id === id);

      if (index === -1) {
        return Promise.reject(new Error('Supplier not found'));
      }

      // Check if new name already exists (excluding current supplier)
      const nameExists = suppliers.some(
        (s) => s.id !== id && s.name.toLowerCase() === supplierData.name.toLowerCase(),
      );

      if (nameExists) {
        return Promise.reject(new Error('Supplier name already exists'));
      }

      const updatedSupplier = {
        ...suppliers[index],
        ...supplierData,
        updatedAt: new Date().toISOString(),
      };

      suppliers[index] = updatedSupplier;
      localStorage.setItem(this.suppliersKey, JSON.stringify(suppliers));

      return Promise.resolve(updatedSupplier);
    } catch (error) {
      console.error('Error updating supplier:', error);
      return Promise.reject(error);
    }
  }

  // Delete supplier
  deleteSupplier(id) {
    try {
      const suppliers = JSON.parse(localStorage.getItem(this.suppliersKey) || '[]');
      const filteredSuppliers = suppliers.filter((s) => s.id !== id);
      localStorage.setItem(this.suppliersKey, JSON.stringify(filteredSuppliers));
      return Promise.resolve(true);
    } catch (error) {
      console.error('Error deleting supplier:', error);
      return Promise.reject(error);
    }
  }

  // ==================== INVENTORY ====================

  // Get all inventory items
  getAllInventory() {
    try {
      const inventory = JSON.parse(localStorage.getItem(this.inventoryKey) || '[]');
      return Promise.resolve(inventory);
    } catch (error) {
      console.error('Error getting inventory:', error);
      return Promise.reject(error);
    }
  }

  // Get inventory item by ID
  getInventoryById(id) {
    try {
      const inventory = JSON.parse(localStorage.getItem(this.inventoryKey) || '[]');
      const item = inventory.find((i) => i.id === id);
      return Promise.resolve(item || null);
    } catch (error) {
      console.error('Error getting inventory by ID:', error);
      return Promise.reject(error);
    }
  }

  // Create new inventory item
  createInventoryItem(inventoryData) {
    try {
      const inventory = JSON.parse(localStorage.getItem(this.inventoryKey) || '[]');

      // Check if SKU already exists
      const skuExists = inventory.some(
        (i) => i.sku.toLowerCase() === inventoryData.sku.toLowerCase(),
      );

      if (skuExists) {
        return Promise.reject(new Error('SKU already exists'));
      }

      const newItem = {
        id: uuidv4(),
        ...inventoryData,
        status: inventoryData.status || 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      inventory.push(newItem);
      localStorage.setItem(this.inventoryKey, JSON.stringify(inventory));

      return Promise.resolve(newItem);
    } catch (error) {
      console.error('Error creating inventory item:', error);
      return Promise.reject(error);
    }
  }

  // Update inventory item
  updateInventoryItem(id, inventoryData) {
    try {
      const inventory = JSON.parse(localStorage.getItem(this.inventoryKey) || '[]');
      const index = inventory.findIndex((i) => i.id === id);

      if (index === -1) {
        return Promise.reject(new Error('Inventory item not found'));
      }

      // Check if new SKU already exists (excluding current item)
      const skuExists = inventory.some(
        (i) => i.id !== id && i.sku.toLowerCase() === inventoryData.sku.toLowerCase(),
      );

      if (skuExists) {
        return Promise.reject(new Error('SKU already exists'));
      }

      const updatedItem = {
        ...inventory[index],
        ...inventoryData,
        updatedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      inventory[index] = updatedItem;
      localStorage.setItem(this.inventoryKey, JSON.stringify(inventory));

      return Promise.resolve(updatedItem);
    } catch (error) {
      console.error('Error updating inventory item:', error);
      return Promise.reject(error);
    }
  }

  // Update stock quantity
  updateStock(id, quantity, operation = 'set') {
    try {
      const inventory = JSON.parse(localStorage.getItem(this.inventoryKey) || '[]');
      const index = inventory.findIndex((i) => i.id === id);

      if (index === -1) {
        return Promise.reject(new Error('Inventory item not found'));
      }

      let newStock;
      switch (operation) {
        case 'add':
          newStock = inventory[index].currentStock + quantity;
          break;
        case 'subtract':
          newStock = Math.max(0, inventory[index].currentStock - quantity);
          break;
        case 'set':
        default:
          newStock = Math.max(0, quantity);
          break;
      }

      inventory[index].currentStock = newStock;
      inventory[index].lastUpdated = new Date().toISOString();
      inventory[index].updatedAt = new Date().toISOString();

      localStorage.setItem(this.inventoryKey, JSON.stringify(inventory));

      return Promise.resolve(inventory[index]);
    } catch (error) {
      console.error('Error updating stock:', error);
      return Promise.reject(error);
    }
  }

  // Delete inventory item
  deleteInventoryItem(id) {
    try {
      const inventory = JSON.parse(localStorage.getItem(this.inventoryKey) || '[]');
      const filteredInventory = inventory.filter((i) => i.id !== id);
      localStorage.setItem(this.inventoryKey, JSON.stringify(filteredInventory));
      return Promise.resolve(true);
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      return Promise.reject(error);
    }
  }

  // ==================== PURCHASES ====================

  // Get all purchases
  getAllPurchases() {
    try {
      const purchases = JSON.parse(localStorage.getItem(this.purchasesKey) || '[]');
      return Promise.resolve(purchases);
    } catch (error) {
      console.error('Error getting purchases:', error);
      return Promise.reject(error);
    }
  }

  // Get purchase by ID
  getPurchaseById(id) {
    try {
      const purchases = JSON.parse(localStorage.getItem(this.purchasesKey) || '[]');
      const purchase = purchases.find((p) => p.id === id);
      return Promise.resolve(purchase || null);
    } catch (error) {
      console.error('Error getting purchase by ID:', error);
      return Promise.reject(error);
    }
  }

  // Create new purchase order
  createPurchaseOrder(purchaseData) {
    try {
      const purchases = JSON.parse(localStorage.getItem(this.purchasesKey) || '[]');

      // Generate purchase number
      const purchaseNumber = `PO-${new Date().getFullYear()}-${String(
        purchases.length + 1,
      ).padStart(3, '0')}`;

      const newPurchase = {
        id: uuidv4(),
        purchaseNumber,
        ...purchaseData,
        status: purchaseData.status || 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      purchases.push(newPurchase);
      localStorage.setItem(this.purchasesKey, JSON.stringify(purchases));

      return Promise.resolve(newPurchase);
    } catch (error) {
      console.error('Error creating purchase order:', error);
      return Promise.reject(error);
    }
  }

  // Update purchase order
  updatePurchaseOrder(id, purchaseData) {
    try {
      const purchases = JSON.parse(localStorage.getItem(this.purchasesKey) || '[]');
      const index = purchases.findIndex((p) => p.id === id);

      if (index === -1) {
        return Promise.reject(new Error('Purchase order not found'));
      }

      const updatedPurchase = {
        ...purchases[index],
        ...purchaseData,
        updatedAt: new Date().toISOString(),
      };

      purchases[index] = updatedPurchase;
      localStorage.setItem(this.purchasesKey, JSON.stringify(purchases));

      return Promise.resolve(updatedPurchase);
    } catch (error) {
      console.error('Error updating purchase order:', error);
      return Promise.reject(error);
    }
  }

  // Update purchase status
  updatePurchaseStatus(id, status, deliveredDate = null) {
    try {
      const purchases = JSON.parse(localStorage.getItem(this.purchasesKey) || '[]');
      const index = purchases.findIndex((p) => p.id === id);

      if (index === -1) {
        return Promise.reject(new Error('Purchase order not found'));
      }

      const updatedPurchase = {
        ...purchases[index],
        status,
        ...(deliveredDate && { deliveredDate }),
        updatedAt: new Date().toISOString(),
      };

      purchases[index] = updatedPurchase;
      localStorage.setItem(this.purchasesKey, JSON.stringify(purchases));

      // If status is delivered, update inventory
      if (status === 'delivered') {
        this.updateInventoryFromPurchase(updatedPurchase);
      }

      return Promise.resolve(updatedPurchase);
    } catch (error) {
      console.error('Error updating purchase status:', error);
      return Promise.reject(error);
    }
  }

  // Update inventory from delivered purchase
  updateInventoryFromPurchase(purchase) {
    try {
      const inventory = JSON.parse(localStorage.getItem(this.inventoryKey) || '[]');

      purchase.items.forEach((item) => {
        const inventoryIndex = inventory.findIndex((i) => i.sku === item.sku);
        if (inventoryIndex !== -1) {
          inventory[inventoryIndex].currentStock += item.quantity;
          inventory[inventoryIndex].lastUpdated = new Date().toISOString();
          inventory[inventoryIndex].updatedAt = new Date().toISOString();
        }
      });

      localStorage.setItem(this.inventoryKey, JSON.stringify(inventory));
    } catch (error) {
      console.error('Error updating inventory from purchase:', error);
    }
  }

  // Delete purchase order
  deletePurchaseOrder(id) {
    try {
      const purchases = JSON.parse(localStorage.getItem(this.purchasesKey) || '[]');
      const filteredPurchases = purchases.filter((p) => p.id !== id);
      localStorage.setItem(this.purchasesKey, JSON.stringify(filteredPurchases));
      return Promise.resolve(true);
    } catch (error) {
      console.error('Error deleting purchase order:', error);
      return Promise.reject(error);
    }
  }

  // ==================== ANALYTICS ====================

  // Get warehouse statistics
  getWarehouseStats() {
    try {
      const inventory = JSON.parse(localStorage.getItem(this.inventoryKey) || '[]');
      const purchases = JSON.parse(localStorage.getItem(this.purchasesKey) || '[]');
      const suppliers = JSON.parse(localStorage.getItem(this.suppliersKey) || '[]');

      const totalInventoryValue = inventory.reduce(
        (sum, item) => sum + item.currentStock * item.unitCost,
        0,
      );

      const lowStockItems = inventory.filter((item) => item.currentStock <= item.minStock);

      const pendingPurchases = purchases.filter((p) => p.status === 'pending');
      const totalPendingValue = pendingPurchases.reduce((sum, p) => sum + p.total, 0);

      return Promise.resolve({
        totalItems: inventory.length,
        totalInventoryValue,
        lowStockItems: lowStockItems.length,
        totalSuppliers: suppliers.length,
        activeSuppliers: suppliers.filter((s) => s.status === 'active').length,
        pendingPurchases: pendingPurchases.length,
        totalPendingValue,
        totalPurchases: purchases.length,
      });
    } catch (error) {
      console.error('Error getting warehouse stats:', error);
      return Promise.reject(error);
    }
  }
}

// Create and export singleton instance
const warehouseService = new WarehouseService();

// Export individual methods
export const getAllSuppliers = () => warehouseService.getAllSuppliers();
export const getSupplierById = (id) => warehouseService.getSupplierById(id);
export const createSupplier = (data) => warehouseService.createSupplier(data);
export const updateSupplier = (id, data) => warehouseService.updateSupplier(id, data);
export const deleteSupplier = (id) => warehouseService.deleteSupplier(id);

export const getAllInventory = () => warehouseService.getAllInventory();
export const getInventoryById = (id) => warehouseService.getInventoryById(id);
export const createInventoryItem = (data) => warehouseService.createInventoryItem(data);
export const updateInventoryItem = (id, data) => warehouseService.updateInventoryItem(id, data);
export const updateStock = (id, quantity, operation) =>
  warehouseService.updateStock(id, quantity, operation);
export const deleteInventoryItem = (id) => warehouseService.deleteInventoryItem(id);

export const getAllPurchases = () => warehouseService.getAllPurchases();
export const getPurchaseById = (id) => warehouseService.getPurchaseById(id);
export const createPurchaseOrder = (data) => warehouseService.createPurchaseOrder(data);
export const updatePurchaseOrder = (id, data) => warehouseService.updatePurchaseOrder(id, data);
export const updatePurchaseStatus = (id, status, deliveredDate) =>
  warehouseService.updatePurchaseStatus(id, status, deliveredDate);
export const deletePurchaseOrder = (id) => warehouseService.deletePurchaseOrder(id);

export const getWarehouseStats = () => warehouseService.getWarehouseStats();

export default warehouseService;
