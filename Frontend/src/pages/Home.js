import React from 'react';
import ProductCard from '../components/ProductCard.js';
import './Home.css';

const Home = ({ addToCart, products }) => {
  return (
    <div className="home-page">
      <h1>Products</h1>
      <div className="product-grid">
        {products.length === 0 ? 
            <h1 className="no-results">No results found</h1>
        :
        products.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))
        }
      </div>
    </div>
  );
};

export default Home;
