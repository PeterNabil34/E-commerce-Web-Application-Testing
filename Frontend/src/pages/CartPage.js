import React, { useState } from 'react';
import './CartPage.css';

const CartPage = ({ cart, onRemoveFromCart, onUpdateQuantity, onCheckout, error, setError }) => {
  const handleQuantityChange = (productId, newValue) => {
    const success = onUpdateQuantity(productId, parseInt(newValue));
    if (!success) {
      setError('Invalid quantity');
    }
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {error && <div className="error-message">{error}</div>}
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>Price: ${item.price.toFixed(2)}</p>
                  <p>In Stock: {item.stockLevel}</p>
                  <label htmlFor={`quantity-${item.id}`}>Quantity:</label>
                  <input
                    type="number"
                    id={`quantity-${item.id}`}
                    min="1"
                    max="5"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  />
                  <button onClick={() => onRemoveFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <h3>Total: ${cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}</h3>
          <button className="checkout-btn" onClick={onCheckout}>
            Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;
