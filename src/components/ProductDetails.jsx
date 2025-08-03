import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, CardMedia, Chip, Button } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';

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

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    const foundProduct = storedProducts.find((item) => item.id === parseInt(id));
    setProduct(foundProduct);
  }, [id]);

  if (!product) {
    return (
      <Container>
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          Loading product details...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card elevation={0} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }} >
        <CardMedia
          component="img"
          height="400"
          image={product.image}
          alt={product.title}
        />
        <CardContent>
          <Typography variant="h5" gutterBottom>{product.title}</Typography>
          <Chip label={product.category} sx={{ mb:3}} />
          <Typography variant="body1" sx={{ mb: 2 }}>{product.description}</Typography>
          <Typography variant="h5" color="primary">${product.price}</Typography>
          <Button
            variant="contained"
            startIcon={<ShoppingCart />}
            onClick={() => addToCart(product)}
         >
            Add to Cart
         </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProductDetails;
