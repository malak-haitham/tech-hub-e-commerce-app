import { useState, useEffect } from 'react';
import { 
  Container, 
  Grid,
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  TextField, 
  Box,
  Chip,
  Pagination,
  Stack,
  useTheme
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { ViewList, ViewModule } from '@mui/icons-material';



const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);
  const[gridView,setGridView]=useState(true);
  const navigate = useNavigate();
  const theme = useTheme();



  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
    setCurrentPage(1);
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/posts');
      const mockProducts = response.data.slice(0, 24).map(post => ({
        id: post.id,
        title: post.title,
        price: Math.floor(Math.random() * 500) + 20,
        category: ['Electronics', 'Clothing', 'Books', 'Home'][Math.floor(Math.random() * 4)],
        image: `https://picsum.photos/300/200?random=${post.id}`,
        description: post.body
      }));
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      localStorage.setItem('products', JSON.stringify(mockProducts));

    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loading) {
    return (
      <Container>
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          Loading products...
        </Typography>
      </Container>
    );
  }

  return (
    
    

    <Container maxWidth="lg">
      <Box sx={{ my: 4}}>
        <Typography variant="h4" gutterBottom>
          Products ({filteredProducts.length} items)
        </Typography>

        <Button
        
        variant="outlined"
        onClick={()=>setGridView(!gridView)}
        startIcon={gridView ? <ViewList /> : <ViewModule />}
        sx={{ mb: 2,
          color: theme.palette.mode === 'dark' ? '#b0a6b0ff' : '#2e7d32',
          borderColor: theme.palette.mode === 'dark' ? '#93589fff' : '#2e7d32',
         }}
        >
           {gridView ? 'List View' : 'Grid View'}
        </Button>

        <TextField
          fullWidth
          label="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
       />
        <Grid container spacing={3}>
          {currentProducts.map((product) => (
            gridView?(
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {product.title.length > 50 
                      ? `${product.title.substring(0, 50)}...` 
                      : product.title
                    }
                  </Typography>
              
                  <Chip 
                    label={product.category} 
                    size="small" 
                    sx={{ mb: 1 }} 
                  />
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {product.description.length > 100 
                      ? `${product.description.substring(0, 100)}...` 
                      : product.description
                    }
                  </Typography>
                  
                  <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                    ${product.price}
                  </Typography>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate(`/products/${product.id}`)}
                    sx={{
                      mb: 1,
                      color: theme.palette.mode === 'dark' ? '#1d1c1eff' : '#ffffffff',
                      borderColor: theme.palette.mode === 'dark' ? '#6d4d69ff' : '#88b47aff',
                      '&:hover': {
                        borderColor: theme.palette.mode === 'dark' ? '#bbbbbb' : '#333333',
                        color: theme.palette.mode === 'dark' ? '#bbbbbb' : '#222222',
                      }
                    }}
                  >
                    View Details
                  </Button>

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ShoppingCart />}
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
              
            </Grid>
            ):(
            <Grid item xs={12}  key={product.id}> 
            <Card sx={{ display: 'flex', gap: 2, p: 2, alignItems: 'flex-start' }}>

              <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.title}
                  sx={{
                   width: 150,
                   height: 250,
                   objectFit: 'cover',
                   borderRadius: 1,
                  }}
                />
                <CardContent sx={{ p: 0, flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {product.title.length > 50 
                      ? `${product.title.substring(0, 50)}...` 
                      : product.title
                    }
                  </Typography>
                  <Chip 
                    label={product.category} 
                    size="small" 
                    sx={{ mb: 1 }} 
                  />
                  <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {product.description.length > 100 
                      ? `${product.description.substring(0, 100)}...` 
                      : product.description
                    }
                  </Typography>
                  
                  <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                    ${product.price}
                  </Typography>
                   <Button
                        
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate(`/products/${product.id}`)}
                    sx={{
                      mb: 1,
                      color: theme.palette.mode === 'dark' ? '#1d1c1eff' : '#ffffffff',
                      borderColor: theme.palette.mode === 'dark' ? '#6d4d69ff' : '#88b47aff',
                      '&:hover': {
                        borderColor: theme.palette.mode === 'dark' ? '#bbbbbb' : '#333333',
                        color: theme.palette.mode === 'dark' ? '#bbbbbb' : '#222222',
                      }
                    }}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ShoppingCart />}
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </Button>
                  </Box>
                
                </CardContent>
            </Card>
            </Grid>
            )
          ))}
        </Grid>

        {totalPages > 1 && (
          <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
            <Typography variant="body2" color="text.secondary">
              Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
            </Typography>
          </Stack>
        )}

        {filteredProducts.length === 0 && (
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            No products found
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Products;