// خدمة إدارة الطلبات
const ORDERS_STORAGE_KEY = 'kontainar_orders';

// البيانات الافتراضية للطلبات
const defaultOrders = {
  pending: [
    {
      id: 'ORD-001',
      customer: {
        name: 'Ahmed Hassan',
        email: 'ahmed.hassan@email.com',
        phone: '+20 123 456 7890',
        avatar: null,
      },
      items: [
        { name: 'iPhone 15 Pro', quantity: 2, price: 999 },
        { name: 'AirPods Pro', quantity: 3, price: 249 },
      ],
      total: 2745,
      status: 'pending',
      orderStatus: 'Draft',
      paymentStatus: 'Pending',
      paymentMethod: 'Credit Card',
      shippingAddress: '123 Main St, Cairo, Egypt',
      orderDate: '2024-01-15',
      createdDate: '2024-01-15T10:30:00Z',
      estimatedDelivery: '2024-01-20',
      deliveryNumber: 'DEL-001',
      notes: 'Customer requested express shipping',
    },
    {
      id: 'ORD-002',
      customer: {
        name: 'Fatma Ali',
        email: 'fatma.ali@email.com',
        phone: '+20 987 654 3210',
        avatar: null,
      },
      items: [
        { name: 'Samsung Galaxy S24', quantity: 1, price: 899 },
        { name: 'Wireless Charger', quantity: 2, price: 49 },
      ],
      total: 997,
      status: 'pending',
      orderStatus: 'Packaging',
      paymentStatus: 'Paid',
      paymentMethod: 'PayPal',
      shippingAddress: '456 Oak Ave, Alexandria, Egypt',
      orderDate: '2024-01-16',
      createdDate: '2024-01-16T14:20:00Z',
      estimatedDelivery: '2024-01-22',
      deliveryNumber: 'DEL-002',
      notes: '',
    },
    {
      id: 'ORD-003',
      customer: {
        name: 'Mohamed Ibrahim',
        email: 'mohamed.ibrahim@email.com',
        phone: '+20 555 123 4567',
        avatar: null,
      },
      items: [
        { name: 'MacBook Pro M3', quantity: 1, price: 1999 },
        { name: 'Magic Mouse', quantity: 2, price: 79 },
        { name: 'USB-C Hub', quantity: 1, price: 89 },
      ],
      total: 2246,
      status: 'pending',
      orderStatus: 'Canceled',
      paymentStatus: 'Failed',
      paymentMethod: 'Bank Transfer',
      shippingAddress: '789 Pine St, Giza, Egypt',
      orderDate: '2024-01-17',
      createdDate: '2024-01-17T09:15:00Z',
      estimatedDelivery: '2024-01-25',
      deliveryNumber: 'DEL-003',
      notes: 'High-value order - requires signature confirmation',
    },
    {
      id: 'ORD-004',
      customer: {
        name: 'Nour El-Din',
        email: 'nour.eldin@email.com',
        phone: '+20 111 222 3333',
        avatar: null,
      },
      items: [
        { name: 'iPad Air', quantity: 1, price: 599 },
        { name: 'Apple Pencil', quantity: 2, price: 129 },
      ],
      total: 857,
      status: 'pending',
      orderStatus: 'Completed',
      paymentStatus: 'Paid',
      paymentMethod: 'Credit Card',
      shippingAddress: '321 Elm St, Luxor, Egypt',
      orderDate: '2024-01-18',
      createdDate: '2024-01-18T16:45:00Z',
      estimatedDelivery: '2024-01-23',
      deliveryNumber: 'DEL-004',
      notes: '',
    },
  ],
  received: [
    {
      id: 'ORD-101',
      customer: {
        name: 'Sarah Mohamed',
        email: 'sarah.mohamed@email.com',
        phone: '+20 444 555 6666',
        avatar: null,
      },
      items: [
        { name: 'Dell XPS 13', quantity: 1, price: 1299 },
        { name: 'Wireless Mouse', quantity: 3, price: 29 },
      ],
      total: 1386,
      status: 'received',
      orderStatus: 'Completed',
      paymentStatus: 'Paid',
      paymentMethod: 'Credit Card',
      shippingAddress: '555 Tech St, Cairo, Egypt',
      orderDate: '2024-01-10',
      createdDate: '2024-01-10T11:20:00Z',
      receivedDate: '2024-01-15',
      deliveryDate: '2024-01-14',
      deliveryNumber: 'DEL-101',
      trackingNumber: 'TRK123456789',
      rating: 5,
      review: 'Excellent service and fast delivery!',
      notes: 'Customer was very satisfied',
    },
    {
      id: 'ORD-102',
      customer: {
        name: 'Omar Hassan',
        email: 'omar.hassan@email.com',
        phone: '+20 777 888 9999',
        avatar: null,
      },
      items: [
        { name: 'Sony WH-1000XM5', quantity: 1, price: 399 },
        { name: 'Phone Case', quantity: 4, price: 19 },
      ],
      total: 475,
      status: 'received',
      orderStatus: 'Completed',
      paymentStatus: 'Paid',
      paymentMethod: 'PayPal',
      shippingAddress: '888 Music Ave, Alexandria, Egypt',
      orderDate: '2024-01-12',
      createdDate: '2024-01-12T13:30:00Z',
      receivedDate: '2024-01-17',
      deliveryDate: '2024-01-16',
      deliveryNumber: 'DEL-102',
      trackingNumber: 'TRK987654321',
      rating: 4,
      review: 'Good quality products, delivery was on time.',
      notes: '',
    },
  ],
};

// حفظ البيانات في localStorage
export const saveOrdersToStorage = (orders) => {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving orders to localStorage:', error);
  }
};

// تحميل البيانات من localStorage
export const loadOrdersFromStorage = () => {
  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading orders from localStorage:', error);
  }

  // إذا لم توجد بيانات محفوظة، احفظ البيانات الافتراضية
  saveOrdersToStorage(defaultOrders);
  return defaultOrders;
};

// الحصول على جميع الطلبات
export const getAllOrders = () => {
  return loadOrdersFromStorage();
};

// الحصول على الطلبات المعلقة
export const getPendingOrders = () => {
  const orders = loadOrdersFromStorage();
  return orders.pending || [];
};

// الحصول على الطلبات المستلمة
export const getReceivedOrders = () => {
  const orders = loadOrdersFromStorage();
  return orders.received || [];
};

// تحديث حالة الطلب من معلق إلى مستلم
export const processOrder = (orderId) => {
  const orders = loadOrdersFromStorage();
  const pendingIndex = orders.pending.findIndex((order) => order.id === orderId);

  if (pendingIndex !== -1) {
    const order = orders.pending[pendingIndex];

    // تحديث حالة الطلب
    const processedOrder = {
      ...order,
      status: 'received',
      receivedDate: new Date().toISOString().split('T')[0],
      deliveryDate: new Date().toISOString().split('T')[0],
      trackingNumber: `TRK${Date.now()}`,
      rating: Math.floor(Math.random() * 2) + 4, // تقييم عشوائي بين 4-5
      review: getRandomReview(),
    };

    // نقل الطلب من المعلقة إلى المستلمة
    orders.pending.splice(pendingIndex, 1);
    orders.received.unshift(processedOrder);

    // حفظ التحديثات
    saveOrdersToStorage(orders);

    return processedOrder;
  }

  return null;
};

// إلغاء الطلب
export const cancelOrder = (orderId) => {
  const orders = loadOrdersFromStorage();
  const pendingIndex = orders.pending.findIndex((order) => order.id === orderId);

  if (pendingIndex !== -1) {
    orders.pending.splice(pendingIndex, 1);
    saveOrdersToStorage(orders);
    return true;
  }

  return false;
};

// وضع علامة مكتمل على الطلب المستلم
export const completeOrder = (orderId) => {
  const orders = loadOrdersFromStorage();
  const receivedIndex = orders.received.findIndex((order) => order.id === orderId);

  if (receivedIndex !== -1) {
    orders.received[receivedIndex].status = 'completed';
    saveOrdersToStorage(orders);
    return true;
  }

  return false;
};

// إضافة طلب جديد
export const addNewOrder = (orderData) => {
  const orders = loadOrdersFromStorage();
  const newOrder = {
    ...orderData,
    id: `ORD-${Date.now()}`,
    status: 'pending',
    orderStatus: 'Draft',
    paymentStatus: 'Pending',
    orderDate: new Date().toISOString().split('T')[0],
    createdDate: new Date().toISOString(),
    deliveryNumber: `DEL-${Date.now()}`,
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 أيام من الآن
  };

  orders.pending.unshift(newOrder);
  saveOrdersToStorage(orders);

  return newOrder;
};

// مراجعات عشوائية
const getRandomReview = () => {
  const reviews = [
    'Excellent service and fast delivery!',
    'Good quality products, delivery was on time.',
    'Perfect! My kids love it. Will definitely order again.',
    'Professional equipment, excellent packaging and delivery.',
    'Great product, fast shipping, highly recommended!',
    'Amazing quality and customer service.',
    'Exactly as described, very satisfied with the purchase.',
    'Quick delivery and excellent packaging.',
  ];

  return reviews[Math.floor(Math.random() * reviews.length)];
};

// إحصائيات الطلبات
export const getOrdersStats = () => {
  const orders = loadOrdersFromStorage();
  const pending = orders.pending || [];
  const received = orders.received || [];

  const totalRevenue = received.reduce((sum, order) => sum + order.total, 0);
  const averageRating =
    received.length > 0
      ? received.reduce((sum, order) => sum + (order.rating || 0), 0) / received.length
      : 0;

  return {
    totalPending: pending.length,
    totalReceived: received.length,
    totalRevenue,
    averageRating: Math.round(averageRating * 10) / 10,
    pendingRevenue: pending.reduce((sum, order) => sum + order.total, 0),
  };
};
