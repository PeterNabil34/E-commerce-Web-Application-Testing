import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';

const products = [
  { 
    id: 1, 
    name: 'Oraimo Watch 2R', 
    price: 100, 
    description: "Bluetooth Calling Smart Watch for Men and Women,1.39\"HD Smart Fitness Watch with Stepping Meter Heart Rate Monitor,120+ Sports Modes & Quickly Reply SMS", 
    images: ['/img/product1.jpg', '/img/product1a.jpg', '/img/product1b.jpg', '/img/product1c.jpg'],
    reviews: [
      { user: 'Alice', rating: 4, comment: 'Great product, very useful!' },
      { user: 'Bob', rating: 5, comment: 'Amazing quality, totally worth it!' }
    ],
    stockLevel: 15
  },
  { 
    id: 2, 
    name: 'Razer BlackShark V2 X Gaming Headset', 
    price: 200, 
    description: 'Razer BlackShark V2 X Gaming Headset: 7.1 Surround Sound - 50mm Drivers - Memory Foam Cushion', 
    images: ['/img/product2.jpg', '/img/product2a.jpg', '/img/product2b.jpg', '/img/product2c.jpg'],
    reviews: [
      { user: 'John', rating: 3, comment: 'It\'s okay, but could be better.' },
      { user: 'Jane', rating: 5, comment: 'I love it! Highly recommend.' }
    ],
    stockLevel: 5
  },
  { 
    id: 3, 
    name: 'Hador OX 24 Mountain Bike', 
    price: 300, 
    description: 'Brand: HadorColor: BlackType: DiscMaterial: MixedProduct weight: 6 kilograms', 
    images: ['/img/product3.jpg', '/img/product3a.jpg', '/img/product3b.jpg', '/img/product3c.jpg'],
    reviews: [
      { user: 'John', rating: 3, comment: 'It\'s okay, but could be better.' },
      { user: 'Jane', rating: 5, comment: 'I love it! Highly recommend.' }
    ],
    stockLevel: 0
  },
];

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const product = products.find((prod) => prod.id === parseInt(id));
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product?.images[0]);
  const [error, setError] = useState('');

  if (!product) {
    return <h2>Product not found</h2>;
  }

  const handleQuantityChange = (value) => {
    const newValue = parseInt(value);
    if (newValue >= 1 && newValue <= 5) {
      setQuantity(newValue);
      setError('');
    } else {
      setError('Quantity must be between 1 and 5');
    }
  };

  const handleAddToCart = () => {
    if (product.stockLevel === 0) {
      setError('Product is out of stock');
      return;
    }
    
    const success = addToCart(product, quantity);
    if (!success) {
      setError('Could not add to cart');
    }
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-images">
          <img src={selectedImage} alt={product.name} className="main-image" />
          <div className="thumbnail-row">
            {product.images.map((img, index) => (
              <img 
                key={index} 
                src={img} 
                alt={`Thumbnail ${index}`} 
                className="thumbnail" 
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>
        <div className="product-info">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p className="product-price">${product.price}</p>
          <p className="stock-level">In Stock: {product.stockLevel}</p>

          <div className="quantity-selector">
            <label>Quantity: </label>
            <input 
              type="number" 
              value={quantity} 
              onChange={(e) => handleQuantityChange(e.target.value)} 
              min="1" 
              max="5"
              disabled={product.stockLevel === 0}
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          
          <button 
            className="add-to-cart-btn" 
            onClick={handleAddToCart}
            disabled={product.stockLevel === 0}
          >
            {product.stockLevel === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>

          <div className="customer-reviews">
            <h3>Customer Reviews</h3>
            {product.reviews.map((review, index) => (
              <div key={index} className="review">
                <p><strong>{review.user}</strong> <span className="rating">{'★'.repeat(review.rating)}</span></p>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;