import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.js';
import ProductDetail from './pages/ProductDetail.js';
import CartPage from './pages/CartPage.js';
import Header from './components/Header.js';
import './App.css';

const allProducts = [
  { 
    id: 1, 
    name: 'Oraimo Watch 2R', 
    price: 100, 
    description: 'This is Product 1', 
    image: '/img/product1.jpg',
    stockLevel: 15
  },
  { 
    id: 2, 
    name: 'Razer BlackShark V2 X Gaming Headset', 
    price: 200, 
    description: 'This is Product 2', 
    image: '/img/product2.jpg',
    stockLevel: 5
  },
  { 
    id: 3, 
    name: 'Hador OX 24 Mountain Bike', 
    price: 300, 
    description: 'This is Product 3', 
    image: '/img/product3.jpg',
    stockLevel: 0
  },
];

function App() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState(allProducts);
  const [error, setErrorReact] = useState('');

  const setError = (error) => {
    setErrorReact(error);
    setTimeout(() => setErrorReact(''), 3000);
  }

  const MAX_CART_ITEMS = 10;
  const MAX_QUANTITY_PER_ITEM = 5;
  const MIN_ORDER_AMOUNT = 10;
  const MAX_ORDER_AMOUNT = 1000;

  const addToCart = (product, quantity = 1) => {
    if (quantity < 1) {
      setError('Quantity must be at least 1');
      return false;
    }

    if (product.stockLevel < quantity) {
      setError('Not enough items in stock');
      return false;
    }

    const currentItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (currentItemCount + quantity > MAX_CART_ITEMS) {
      setError(`Cannot add more than ${MAX_CART_ITEMS} items to cart`);
      return false;
    }

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > MAX_QUANTITY_PER_ITEM) {
        setError(`Cannot add more than ${MAX_QUANTITY_PER_ITEM} of the same item`);
        return false;
      }
      
      handleUpdateQuantity(product.id, newQuantity);
    } else {
      setCart([...cart, {...product, quantity}]);
    }
    return true;
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1 || newQuantity > MAX_QUANTITY_PER_ITEM) {
      setError(`Quantity must be between 1 and ${MAX_QUANTITY_PER_ITEM}`);
      return false;
    }

    const product = products.find(p => p.id === productId);
    if (product && product.stockLevel < newQuantity) {
      setError('Not enough items in stock');
      return false;
    }

    setCart(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
    return true;
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const validateCart = () => {
    const total = calculateTotal();
    if (total < MIN_ORDER_AMOUNT) {
      return `Minimum order amount is $${MIN_ORDER_AMOUNT}`;
    }
    if (total > MAX_ORDER_AMOUNT) {
      return `Maximum order amount is $${MAX_ORDER_AMOUNT}`;
    }
    if (cart.length === 0) {
      return 'Cart is empty';
    }
    return null;
  };

  const handleCheckout = () => {
    const error = validateCart();
    if (error) {
      setError(error);
      return false;
    }
    return true;
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const onSearch = (searchTerm) => {
    let filteredProducts = allProducts.filter((item) => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setProducts(filteredProducts);
  };

  const handleLogin = async (credentials) => {
    // Implement your login logic here
    return true; // Return true for successful login
  };
  
  const handleRegister = async (userData) => {
    // Implement your registration logic here
    return true; // Return true for successful registration
  };

  return (
    <Router>
      <Header cart={cart} onSearch={onSearch}/>
      <div className="error-banner">{error}</div>
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} products={products} />} />
        <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
        <Route path="/cart" element={
          <CartPage 
            cart={cart} 
            onRemoveFromCart={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
            onCheckout={handleCheckout}
            error={error}
            setError={setError}
          />
        } />
      </Routes>
    </Router>
  );
}

export default App;