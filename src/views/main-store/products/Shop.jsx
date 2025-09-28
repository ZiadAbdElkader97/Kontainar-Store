import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Badge,
  Pagination,
  Alert,
  Avatar,
  Rating,
  Divider,
  Collapse,
  Drawer,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Sort as SortIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Clear as ClearIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer';
import {
  getAllProducts,
  filterProducts,
  searchProducts,
  getCategories,
  getBrands,
  getColors,
  getSizes,
} from '../../../services/productsService';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [expandedSections, setExpandedSections] = useState({
    category: false,
    gender: false,
    price: false,
    brands: false,
    colors: false,
    sizes: false,
  });

  // فلاتر البحث
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: 'all',
    gender: 'all',
    brands: [],
    colors: [],
    sizes: [],
    minPrice: 0,
    maxPrice: 2000,
    sortBy: 'newest',
  });

  const categories = getCategories();
  const brands = getBrands();
  const colors = getColors();
  const sizes = getSizes();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, products]);

  useEffect(() => {
    paginateProducts();
  }, [filteredProducts, currentPage]);

  const loadProducts = () => {
    setLoading(true);
    try {
      const allProducts = getAllProducts();
      setProducts(allProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // البحث النصي
    if (filters.searchTerm) {
      filtered = searchProducts(filters.searchTerm);
    }

    // تطبيق الفلاتر
    filtered = filterProducts(filters);

    setFilteredProducts(filtered);
    setCurrentPage(1); // إعادة تعيين الصفحة عند تغيير الفلاتر
  };

  const paginateProducts = () => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    setDisplayedProducts(filteredProducts.slice(startIndex, endIndex));
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleBrandToggle = (brand) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand],
    }));
  };

  const handleColorToggle = (color) => {
    setFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const handleSizeToggle = (size) => {
    setFilters((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      category: 'all',
      gender: 'all',
      brands: [],
      colors: [],
      sizes: [],
      minPrice: 0,
      maxPrice: 2000,
      sortBy: 'newest',
    });
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const renderStars = (rating) => {
    return <Rating value={rating} readOnly size="small" precision={0.1} />;
  };

  const renderProductCard = (product) => (
    <Card
      key={product.id}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 6,
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="250"
          image={product.images?.[0] || '/placeholder.jpg'}
          alt={product.title}
          sx={{ objectFit: 'cover' }}
        />
        {product.discount > 0 && (
          <Chip
            label={`-${product.discount}%`}
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
            }}
          />
        )}
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255,255,255,0.8)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.9)',
            },
          }}
        >
          <FavoriteBorderIcon />
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        <Typography variant="h6" component="h2" sx={{ mb: 1, fontWeight: 600, fontSize: '1rem' }}>
          {product.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, flexGrow: 1, fontSize: '0.875rem' }}
        >
          {product.description?.substring(0, 80)}...
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          {renderStars(product.rating)}
          <Typography variant="caption" color="text.secondary">
            ({product.rating.toFixed(1)})
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack>
            <Typography variant="h6" color="primary" fontWeight={600}>
              {formatPrice(product.salesPrice)}
            </Typography>
            {product.discount > 0 && (
              <Typography variant="caption" color="text.secondary">
                <s>{formatPrice(product.price)}</s>
              </Typography>
            )}
          </Stack>
          <Chip
            label={product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            color={product.stock > 0 ? 'success' : 'error'}
            size="small"
            variant="outlined"
          />
        </Stack>

        <Button
          variant="contained"
          startIcon={<ShoppingCartIcon />}
          fullWidth
          disabled={product.stock === 0}
          sx={{ mt: 'auto' }}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );

  const renderProductListItem = (product) => (
    <Card key={product.id} sx={{ mb: 2 }}>
      <Grid container>
        <Grid size={{ xs: 12, md: 3 }}>
          <CardMedia
            component="img"
            height="200"
            image={product.images?.[0]}
            alt={product.title}
            sx={{ objectFit: 'cover' }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  {product.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {product.brand} • {product.category}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {product.description}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  {renderStars(product.rating)}
                  <Typography variant="caption" color="text.secondary">
                    ({product.rating.toFixed(1)}) • {product.reviews} reviews
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  {product.colors.slice(0, 5).map((color, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: color,
                        border: '1px solid #ccc',
                      }}
                    />
                  ))}
                </Stack>
              </Box>
              <Box sx={{ textAlign: 'right', ml: 2 }}>
                <Typography variant="h6" color="primary" fontWeight={600} sx={{ mb: 1 }}>
                  {formatPrice(product.salesPrice)}
                </Typography>
                {product.discount > 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <s>{formatPrice(product.price)}</s>
                  </Typography>
                )}
                <Button variant="contained" startIcon={<ShoppingCartIcon />} size="small">
                  Add to Cart
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const FilterSection = ({ title, children, sectionKey }) => (
    <Box sx={{ mb: 2 }}>
      <Button
        fullWidth
        onClick={() => toggleSection(sectionKey)}
        endIcon={expandedSections[sectionKey] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        sx={{
          justifyContent: 'space-between',
          textAlign: 'left',
          color: 'text.primary',
          fontWeight: 600,
          mb: 1,
          p: 1,
        }}
      >
        {title}
      </Button>
      <Collapse in={expandedSections[sectionKey]}>{children}</Collapse>
      <Divider sx={{ mt: 2 }} />
    </Box>
  );

  const FilterDrawer = () => (
    <Drawer
      anchor="left"
      open={showFilters}
      onClose={() => setShowFilters(false)}
      variant="temporary"
      disableEnforceFocus
      disableAutoFocus
      disableRestoreFocus
      slotProps={{
        paper: {
          sx: {
            width: 320,
            bgcolor: 'background.paper',
          },
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Filters
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              onClick={clearFilters}
              startIcon={<ClearIcon />}
              variant="outlined"
            >
              Clear All
            </Button>
            <IconButton onClick={() => setShowFilters(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
        </Stack>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search products..."
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
          size="small"
        />

        {/* Category Filter */}
        <FilterSection title="Category" sectionKey="category">
          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category}
              label="Category"
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FilterSection>

        {/* Gender Filter */}
        <FilterSection title="Gender" sectionKey="gender">
          <FormControl fullWidth size="small">
            <InputLabel>Gender</InputLabel>
            <Select
              value={filters.gender}
              label="Gender"
              onChange={(e) => handleFilterChange('gender', e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Men">Man</MenuItem>
              <MenuItem value="Women">Women</MenuItem>
              <MenuItem value="Kids">Kids</MenuItem>
              <MenuItem value="Unisex">Unisex</MenuItem>
            </Select>
          </FormControl>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range" sectionKey="price">
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              ${filters.minPrice} - ${filters.maxPrice}
            </Typography>
            <Slider
              value={[filters.minPrice, filters.maxPrice]}
              onChange={(e, newValue) => {
                handleFilterChange('minPrice', newValue[0]);
                handleFilterChange('maxPrice', newValue[1]);
              }}
              valueLabelDisplay="auto"
              min={0}
              max={2000}
              step={50}
              size="small"
            />
          </Stack>
        </FilterSection>

        {/* Brands */}
        <FilterSection title="Brands" sectionKey="brands">
          <FormGroup>
            {brands.slice(0, 5).map((brand) => (
              <FormControlLabel
                key={brand}
                control={
                  <Checkbox
                    checked={filters.brands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    size="small"
                  />
                }
                label={brand}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
              />
            ))}
            {brands.length > 5 && (
              <Typography variant="caption" color="text.secondary">
                +{brands.length - 5} more brands
              </Typography>
            )}
          </FormGroup>
        </FilterSection>

        {/* Colors */}
        <FilterSection title="Colors" sectionKey="colors">
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {colors.slice(0, 12).map((color) => (
              <Box
                key={color}
                onClick={() => handleColorToggle(color)}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  backgroundColor: color,
                  border: filters.colors.includes(color)
                    ? '3px solid #1976d2'
                    : '2px solid #e0e0e0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: 2,
                  },
                }}
              />
            ))}
          </Stack>
        </FilterSection>

        {/* Sizes */}
        <FilterSection title="Sizes" sectionKey="sizes">
          <FormControl fullWidth size="small">
            <InputLabel>Size</InputLabel>
            <Select
              multiple
              value={filters.sizes}
              label="Size"
              onChange={(e) => setFilters((prev) => ({ ...prev, sizes: e.target.value }))}
              renderValue={(selected) => selected.join(', ')}
            >
              {sizes.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FilterSection>
      </Box>
    </Drawer>
  );

  return (
    <PageContainer title="Shop" description="Browse our products">
      <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
            Our Products
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Discover amazing products at great prices
          </Typography>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Sidebar Filters - Desktop Only */}
          <Box
            sx={{
              width: 320,
              minWidth: 320,
              borderRight: 1,
              borderColor: 'divider',
              overflow: 'auto',
              display: { xs: 'none', md: 'block' },
              bgcolor: 'background.paper',
            }}
          >
            <Box sx={{ p: 3 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <Typography variant="h6" fontWeight={600}>
                  Filters
                </Typography>
                <Button
                  size="small"
                  onClick={clearFilters}
                  startIcon={<ClearIcon />}
                  variant="outlined"
                >
                  Clear All
                </Button>
              </Stack>

              {/* Search */}
              <TextField
                fullWidth
                placeholder="Search products..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
                size="small"
              />

              {/* Category Filter */}
              <FilterSection title="Category" sectionKey="category">
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filters.category}
                    label="Category"
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </FilterSection>

              {/* Gender Filter */}
              <FilterSection title="Gender" sectionKey="gender">
                <FormControl fullWidth size="small">
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={filters.gender}
                    label="Gender"
                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="Men">Man</MenuItem>
                    <MenuItem value="Women">Women</MenuItem>
                    <MenuItem value="Kids">Kids</MenuItem>
                    <MenuItem value="Unisex">Unisex</MenuItem>
                  </Select>
                </FormControl>
              </FilterSection>

              {/* Price Range */}
              <FilterSection title="Price Range" sectionKey="price">
                <Stack spacing={2}>
                  <Typography variant="body2" color="text.secondary">
                    ${filters.minPrice} - ${filters.maxPrice}
                  </Typography>
                  <Slider
                    value={[filters.minPrice, filters.maxPrice]}
                    onChange={(e, newValue) => {
                      handleFilterChange('minPrice', newValue[0]);
                      handleFilterChange('maxPrice', newValue[1]);
                    }}
                    valueLabelDisplay="auto"
                    min={0}
                    max={2000}
                    step={50}
                    size="small"
                  />
                </Stack>
              </FilterSection>

              {/* Brands */}
              <FilterSection title="Brands" sectionKey="brands">
                <FormGroup>
                  {brands.slice(0, 5).map((brand) => (
                    <FormControlLabel
                      key={brand}
                      control={
                        <Checkbox
                          checked={filters.brands.includes(brand)}
                          onChange={() => handleBrandToggle(brand)}
                          size="small"
                        />
                      }
                      label={brand}
                      sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                    />
                  ))}
                  {brands.length > 5 && (
                    <Typography variant="caption" color="text.secondary">
                      +{brands.length - 5} more brands
                    </Typography>
                  )}
                </FormGroup>
              </FilterSection>

              {/* Colors */}
              <FilterSection title="Colors" sectionKey="colors">
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {colors.slice(0, 12).map((color) => (
                    <Box
                      key={color}
                      onClick={() => handleColorToggle(color)}
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        backgroundColor: color,
                        border: filters.colors.includes(color)
                          ? '3px solid #1976d2'
                          : '2px solid #e0e0e0',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          boxShadow: 2,
                        },
                      }}
                    />
                  ))}
                </Stack>
              </FilterSection>

              {/* Sizes */}
              <FilterSection title="Sizes" sectionKey="sizes">
                <FormControl fullWidth size="small">
                  <InputLabel>Size</InputLabel>
                  <Select
                    multiple
                    value={filters.sizes}
                    label="Size"
                    onChange={(e) => setFilters((prev) => ({ ...prev, sizes: e.target.value }))}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    {sizes.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </FilterSection>
            </Box>
          </Box>

          {/* Products Section */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Products Header */}
            <Box
              sx={{ p: 3, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={2}
              >
                <Typography variant="h6" fontWeight={600}>
                  {filteredProducts.length} Products Found
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setShowFilters(true)}
                    sx={{ display: { xs: 'block', md: 'none' } }}
                    startIcon={<FilterIcon />}
                  >
                    Filters
                  </Button>
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={filters.sortBy}
                      label="Sort By"
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    >
                      <MenuItem value="newest">Newest</MenuItem>
                      <MenuItem value="oldest">Oldest</MenuItem>
                      <MenuItem value="price-low">Price: Low to High</MenuItem>
                      <MenuItem value="price-high">Price: High to Low</MenuItem>
                      <MenuItem value="rating">Rating</MenuItem>
                      <MenuItem value="name">Name</MenuItem>
                    </Select>
                  </FormControl>
                  <IconButton
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    color={viewMode === 'grid' ? 'primary' : 'default'}
                    sx={{ border: 1, borderColor: 'divider' }}
                  >
                    {viewMode === 'grid' ? <ViewListIcon /> : <ViewModuleIcon />}
                  </IconButton>
                </Stack>
              </Stack>
            </Box>

            {/* Products Grid/List */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 3, bgcolor: 'background.default' }}>
              {loading ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography>Loading products...</Typography>
                </Box>
              ) : displayedProducts.length > 0 ? (
                <>
                  {viewMode === 'grid' ? (
                    <Grid container spacing={3}>
                      {displayedProducts.map((product) => (
                        <Grid size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} key={product.id}>
                          {renderProductCard(product)}
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box>{displayedProducts.map(renderProductListItem)}</Box>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(e, page) => setCurrentPage(page)}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                      />
                    </Box>
                  )}
                </>
              ) : (
                <Alert severity="info" sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    No products found
                  </Typography>
                  <Typography>Try adjusting your filters or search terms</Typography>
                </Alert>
              )}
            </Box>
          </Box>
        </Box>

        {/* Mobile Filter Drawer */}
        <FilterDrawer />
      </Box>
    </PageContainer>
  );
};

export default Shop;


