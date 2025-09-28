// Products Service - إدارة المنتجات
import { sub } from 'date-fns';
import s1 from 'src/assets/images/products/s1.jpg';
import s2 from 'src/assets/images/products/s2.jpg';
import s3 from 'src/assets/images/products/s3.jpg';
import s4 from 'src/assets/images/products/s4.jpg';
import s5 from 'src/assets/images/products/s5.jpg';
import s6 from 'src/assets/images/products/s6.jpg';
import s7 from 'src/assets/images/products/s7.jpg';
import s8 from 'src/assets/images/products/s8.jpg';
import s9 from 'src/assets/images/products/s9.jpg';
import s10 from 'src/assets/images/products/s10.jpg';
import s11 from 'src/assets/images/products/s11.jpg';
import s12 from 'src/assets/images/products/s12.jpg';

// بيانات المنتجات الافتراضية
const defaultProducts = [
  {
    id: 'PROD-001',
    title: 'iPhone 15 Pro Max',
    description: 'Latest iPhone with advanced camera system and A17 Pro chip',
    price: 1199,
    discount: 10,
    salesPrice: 1079,
    category: 'Electronics',
    subcategory: 'Smartphones',
    gender: 'Unisex',
    brand: 'Apple',
    colors: ['#000000', '#FFFFFF', '#FFD700'],
    sizes: ['128GB', '256GB', '512GB', '1TB'],
    stock: 50,
    isActive: true,
    isDeleted: false,
    rating: 4.8,
    reviews: 1250,
    images: [s1, s2],
    tags: ['smartphone', 'apple', 'premium', 'camera'],
    specifications: {
      display: '6.7-inch Super Retina XDR',
      processor: 'A17 Pro',
      camera: '48MP Main, 12MP Ultra Wide, 12MP Telephoto',
      battery: 'Up to 29 hours video playback',
      storage: '128GB, 256GB, 512GB, 1TB',
    },
    createdAt: sub(new Date(), { days: 5, hours: 2, minutes: 30 }),
    updatedAt: new Date(),
  },
  {
    id: 'PROD-002',
    title: 'Samsung Galaxy S24 Ultra',
    description: 'Premium Android smartphone with S Pen and advanced AI features',
    price: 1299,
    discount: 15,
    salesPrice: 1104,
    category: 'Electronics',
    subcategory: 'Smartphones',
    gender: 'Unisex',
    brand: 'Samsung',
    colors: ['#000000', '#C0C0C0', '#696969'],
    sizes: ['256GB', '512GB', '1TB'],
    stock: 35,
    isActive: true,
    isDeleted: false,
    rating: 4.7,
    reviews: 980,
    images: [s3, s4],
    tags: ['smartphone', 'samsung', 'android', 's-pen'],
    specifications: {
      display: '6.8-inch Dynamic AMOLED 2X',
      processor: 'Snapdragon 8 Gen 3',
      camera: '200MP Main, 50MP Periscope, 12MP Ultra Wide',
      battery: '5000mAh',
      storage: '256GB, 512GB, 1TB',
    },
    createdAt: sub(new Date(), { days: 3, hours: 8, minutes: 15 }),
    updatedAt: new Date(),
  },
  {
    id: 'PROD-003',
    title: 'MacBook Pro 16-inch',
    description: 'Professional laptop with M3 Pro chip for creators and developers',
    price: 2499,
    discount: 5,
    salesPrice: 2374,
    category: 'Electronics',
    subcategory: 'Laptops',
    gender: 'Unisex',
    brand: 'Apple',
    colors: ['#C0C0C0', '#696969'],
    sizes: ['512GB', '1TB', '2TB', '4TB'],
    stock: 20,
    isActive: true,
    isDeleted: false,
    rating: 4.9,
    reviews: 650,
    images: [s5, s6],
    tags: ['laptop', 'macbook', 'professional', 'm3-pro'],
    specifications: {
      display: '16.2-inch Liquid Retina XDR',
      processor: 'M3 Pro',
      memory: '18GB Unified Memory',
      graphics: '18-core GPU',
      storage: '512GB, 1TB, 2TB, 4TB SSD',
    },
    createdAt: sub(new Date(), { days: 7, hours: 4, minutes: 45 }),
    updatedAt: new Date(),
  },
  {
    id: 'PROD-004',
    title: 'Nike Air Max 270',
    description: 'Comfortable running shoes with Max Air cushioning',
    price: 150,
    discount: 20,
    salesPrice: 120,
    category: 'Fashion',
    subcategory: 'Shoes',
    gender: 'Men',
    brand: 'Nike',
    colors: ['#000000', '#FFFFFF', '#FF0000'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    stock: 100,
    isActive: true,
    isDeleted: false,
    rating: 4.5,
    reviews: 2100,
    images: [s7, s8],
    tags: ['shoes', 'nike', 'running', 'comfortable'],
    specifications: {
      material: 'Mesh and synthetic upper',
      sole: 'Rubber outsole with Max Air unit',
      weight: 'Approximately 320g',
      features: 'Breathable, lightweight, durable',
    },
    createdAt: sub(new Date(), { days: 2, hours: 6, minutes: 20 }),
    updatedAt: new Date(),
  },
  {
    id: 'PROD-005',
    title: 'Adidas Ultraboost 22',
    description: 'Premium running shoes with Boost midsole technology',
    price: 180,
    discount: 25,
    salesPrice: 135,
    category: 'Fashion',
    subcategory: 'Shoes',
    gender: 'Women',
    brand: 'Adidas',
    colors: ['#FFFFFF', '#FF69B4', '#0000FF'],
    sizes: ['5', '6', '7', '8', '9', '10'],
    stock: 75,
    isActive: true,
    isDeleted: false,
    rating: 4.6,
    reviews: 1800,
    images: [s9, s10],
    tags: ['shoes', 'adidas', 'running', 'boost'],
    specifications: {
      material: 'Primeknit+ upper',
      sole: 'Boost midsole with Continental rubber outsole',
      weight: 'Approximately 280g',
      features: 'Energy return, responsive, lightweight',
    },
    createdAt: sub(new Date(), { days: 4, hours: 3, minutes: 10 }),
    updatedAt: new Date(),
  },
  {
    id: 'PROD-006',
    title: 'Sony WH-1000XM5',
    description: 'Industry-leading noise canceling wireless headphones',
    price: 399,
    discount: 10,
    salesPrice: 359,
    category: 'Electronics',
    subcategory: 'Audio',
    gender: 'Unisex',
    brand: 'Sony',
    colors: ['#000000', '#C0C0C0'],
    sizes: ['One Size'],
    stock: 40,
    isActive: true,
    isDeleted: false,
    rating: 4.8,
    reviews: 3200,
    images: [s11, s12],
    tags: ['headphones', 'sony', 'noise-canceling', 'wireless'],
    specifications: {
      driver: '30mm dynamic drivers',
      battery: 'Up to 30 hours playback',
      connectivity: 'Bluetooth 5.2, NFC',
      features: 'Industry-leading noise canceling, Quick Attention mode',
    },
    createdAt: sub(new Date(), { days: 1, hours: 5, minutes: 30 }),
    updatedAt: new Date(),
  },
  {
    id: 'PROD-007',
    title: "Levi's 501 Original Jeans",
    description: 'Classic straight-fit jeans in authentic denim',
    price: 89,
    discount: 15,
    salesPrice: 76,
    category: 'Fashion',
    subcategory: 'Clothing',
    gender: 'Men',
    brand: "Levi's",
    colors: ['#0000FF', '#000000', '#87CEEB'],
    sizes: ['28', '30', '32', '34', '36', '38', '40'],
    stock: 200,
    isActive: true,
    isDeleted: false,
    rating: 4.4,
    reviews: 1500,
    images: [s1, s2],
    tags: ['jeans', 'levis', 'classic', 'denim'],
    specifications: {
      material: '100% Cotton denim',
      fit: 'Straight fit',
      wash: 'Original',
      features: 'Button fly, 5-pocket styling',
    },
    createdAt: sub(new Date(), { days: 6, hours: 1, minutes: 45 }),
    updatedAt: new Date(),
  },
  {
    id: 'PROD-008',
    title: 'Zara Blazer',
    description: 'Elegant blazer perfect for office and formal occasions',
    price: 79,
    discount: 30,
    salesPrice: 55,
    category: 'Fashion',
    subcategory: 'Clothing',
    gender: 'Women',
    brand: 'Zara',
    colors: ['#000000', '#000080', '#808080'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 60,
    isActive: true,
    isDeleted: false,
    rating: 4.3,
    reviews: 890,
    images: [s3, s4],
    tags: ['blazer', 'zara', 'formal', 'office'],
    specifications: {
      material: 'Polyester and viscose blend',
      fit: 'Regular fit',
      features: 'Notched lapels, two-button closure, two front pockets',
    },
    createdAt: sub(new Date(), { days: 8, hours: 7, minutes: 25 }),
    updatedAt: new Date(),
  },
  {
    id: 'PROD-009',
    title: 'Kids T-Shirt',
    description: 'Comfortable cotton t-shirt for kids with fun designs',
    price: 25,
    discount: 20,
    salesPrice: 20,
    category: 'Fashion',
    subcategory: 'Clothing',
    gender: 'Kids',
    brand: 'H&M Kids',
    colors: ['#FF0000', '#00FF00', '#FFFF00', '#FF69B4', '#00FFFF'],
    sizes: ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y'],
    stock: 150,
    isActive: true,
    isDeleted: false,
    rating: 4.2,
    reviews: 320,
    images: [s5, s6],
    tags: ['kids', 'tshirt', 'cotton', 'comfortable'],
    specifications: {
      material: '100% Cotton',
      fit: 'Regular fit',
      care: 'Machine washable',
      features: 'Fun designs, comfortable fit',
    },
    createdAt: sub(new Date(), { days: 2, hours: 3, minutes: 15 }),
    updatedAt: new Date(),
  },
  {
    id: 'PROD-010',
    title: 'Kids Sneakers',
    description: 'Durable and comfortable sneakers for active kids',
    price: 60,
    discount: 15,
    salesPrice: 51,
    category: 'Fashion',
    subcategory: 'Shoes',
    gender: 'Kids',
    brand: 'Nike Kids',
    colors: ['#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF69B4'],
    sizes: ['10C', '11C', '12C', '13C', '1Y', '2Y', '3Y'],
    stock: 80,
    isActive: true,
    isDeleted: false,
    rating: 4.6,
    reviews: 180,
    images: [s7, s8],
    tags: ['kids', 'sneakers', 'durable', 'comfortable'],
    specifications: {
      material: 'Synthetic upper with rubber sole',
      features: 'Breathable, lightweight, durable',
      closure: 'Velcro straps for easy wear',
    },
    createdAt: sub(new Date(), { days: 1, hours: 5, minutes: 30 }),
    updatedAt: new Date(),
  },
];

// تحميل المنتجات من localStorage
const loadProductsFromStorage = () => {
  try {
    const stored = localStorage.getItem('Kontainar-products');
    if (stored) {
      const products = JSON.parse(stored);
      return products;
    }
  } catch (error) {
    console.error('Error loading products from storage:', error);
  }
  return defaultProducts;
};

// حفظ المنتجات في localStorage
const saveProductsToStorage = (products) => {
  try {
    localStorage.setItem('Kontainar-products', JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products to storage:', error);
  }
};

// الحصول على جميع المنتجات النشطة
export const getAllProducts = () => {
  const products = loadProductsFromStorage();
  return products.filter((product) => product.isActive && !product.isDeleted);
};

// الحصول على جميع المنتجات (بما في ذلك المحذوفة)
export const getAllProductsAdmin = () => {
  return loadProductsFromStorage();
};

// الحصول على المنتجات المحذوفة
export const getDeletedProducts = () => {
  const products = loadProductsFromStorage();
  return products.filter((product) => product.isDeleted);
};

// الحصول على منتج بالمعرف
export const getProductById = (id) => {
  const products = loadProductsFromStorage();
  return products.find((product) => product.id === id);
};

// إضافة منتج جديد
export const addNewProduct = (productData) => {
  const products = loadProductsFromStorage();
  const newProduct = {
    ...productData,
    id: `PROD-${Date.now()}`,
    isActive: true,
    isDeleted: false,
    rating: 0,
    reviews: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  products.unshift(newProduct);
  saveProductsToStorage(products);
  return newProduct;
};

// تحديث منتج
export const updateProduct = (id, productData) => {
  const products = loadProductsFromStorage();
  const index = products.findIndex((product) => product.id === id);

  if (index !== -1) {
    products[index] = {
      ...products[index],
      ...productData,
      updatedAt: new Date(),
    };
    saveProductsToStorage(products);
    return products[index];
  }

  return null;
};

// حذف منتج (soft delete)
export const deleteProduct = (id) => {
  const products = loadProductsFromStorage();
  const index = products.findIndex((product) => product.id === id);

  if (index !== -1) {
    products[index] = {
      ...products[index],
      isDeleted: true,
      isActive: false,
      updatedAt: new Date(),
    };
    saveProductsToStorage(products);
    return true;
  }

  return false;
};

// حذف منتج نهائياً
export const permanentDeleteProduct = (id) => {
  const products = loadProductsFromStorage();
  const filteredProducts = products.filter((product) => product.id !== id);
  saveProductsToStorage(filteredProducts);
  return true;
};

// استعادة منتج محذوف
export const restoreProduct = (id) => {
  const products = loadProductsFromStorage();
  const index = products.findIndex((product) => product.id === id);

  if (index !== -1) {
    products[index] = {
      ...products[index],
      isDeleted: false,
      isActive: true,
      updatedAt: new Date(),
    };
    saveProductsToStorage(products);
    return true;
  }

  return false;
};

// فلترة المنتجات
export const filterProducts = (filters) => {
  let products = getAllProducts();

  // فلتر حسب الفئة
  if (filters.category && filters.category !== 'all') {
    products = products.filter((product) => product.category === filters.category);
  }

  // فلتر حسب النوع
  if (filters.gender && filters.gender !== 'all') {
    products = products.filter((product) => product.gender === filters.gender);
  }

  // فلتر حسب السعر
  if (filters.minPrice) {
    products = products.filter((product) => product.salesPrice >= filters.minPrice);
  }
  if (filters.maxPrice) {
    products = products.filter((product) => product.salesPrice <= filters.maxPrice);
  }

  // فلتر حسب الألوان
  if (filters.colors && filters.colors.length > 0) {
    products = products.filter((product) =>
      product.colors.some((color) => filters.colors.includes(color)),
    );
  }

  // فلتر حسب الأحجام
  if (filters.sizes && filters.sizes.length > 0) {
    products = products.filter((product) =>
      product.sizes.some((size) => filters.sizes.includes(size)),
    );
  }

  // فلتر حسب العلامة التجارية
  if (filters.brands && filters.brands.length > 0) {
    products = products.filter((product) => filters.brands.includes(product.brand));
  }

  // ترتيب المنتجات
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price-low':
        products.sort((a, b) => a.salesPrice - b.salesPrice);
        break;
      case 'price-high':
        products.sort((a, b) => b.salesPrice - a.salesPrice);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        products.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'name':
        products.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
  }

  return products;
};

// البحث في المنتجات
export const searchProducts = (searchTerm) => {
  const products = getAllProducts();
  const term = searchTerm.toLowerCase();

  return products.filter(
    (product) =>
      product.title.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.brand.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.tags.some((tag) => tag.toLowerCase().includes(term)),
  );
};

// الحصول على إحصائيات المنتجات
export const getProductsStats = () => {
  const allProducts = loadProductsFromStorage();
  const activeProducts = allProducts.filter((p) => p.isActive && !p.isDeleted);
  const deletedProducts = allProducts.filter((p) => p.isDeleted);

  const categories = [...new Set(activeProducts.map((p) => p.category))];
  const brands = [...new Set(activeProducts.map((p) => p.brand))];

  const totalRevenue = activeProducts.reduce(
    (sum, product) => sum + product.salesPrice * product.stock,
    0,
  );

  const averageRating =
    activeProducts.length > 0
      ? activeProducts.reduce((sum, product) => sum + product.rating, 0) / activeProducts.length
      : 0;

  return {
    totalProducts: activeProducts.length,
    totalDeleted: deletedProducts.length,
    totalCategories: categories.length,
    totalBrands: brands.length,
    totalRevenue,
    averageRating,
    categories,
    brands,
  };
};

// الحصول على الفئات المتاحة
export const getCategories = () => {
  const products = getAllProducts();
  return [...new Set(products.map((product) => product.category))];
};

// الحصول على العلامات التجارية المتاحة
export const getBrands = () => {
  const products = getAllProducts();
  return [...new Set(products.map((product) => product.brand))];
};

// الحصول على الألوان المتاحة
export const getColors = () => {
  const products = getAllProducts();
  const allColors = products.flatMap((product) => product.colors);
  return [...new Set(allColors)];
};

// الحصول على الأحجام المتاحة
export const getSizes = () => {
  const products = getAllProducts();
  const allSizes = products.flatMap((product) => product.sizes);
  return [...new Set(allSizes)];
};


