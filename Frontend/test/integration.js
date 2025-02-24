import { expect } from 'chai';
import { Builder, By, until } from 'selenium-webdriver';

describe('E-commerce Integration Tests', function() {
  let driver;
  const url = 'http://localhost:3000';

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
  });

  beforeEach(async function() {
    await driver.get(url);
    // Wait for initial page load
    await driver.wait(until.elementLocated(By.className('product-card')), 5000);
  });

  after(async function() {
    await driver.quit();
  });

  describe('Shopping Flow Tests', function() {
    it('should complete full purchase flow with search', async function() {
      // Search for product
      const searchInput = await driver.findElement(By.css('.search-bar input'));
      await searchInput.clear();
      await searchInput.sendKeys('Watch');
      await driver.findElement(By.css('.search-bar button')).click();
      
      // Wait for search results and click details
      await driver.wait(until.elementLocated(By.className('product-card')), 5000);
      const viewDetailsBtn = await driver.findElement(By.css('.view-details'));
      await viewDetailsBtn.click();

      // Add to cart with quantity 2
      await driver.wait(until.elementLocated(By.css('input[type="number"]')), 5000);
      const quantityInput = await driver.findElement(By.css('input[type="number"]'));
      await quantityInput.clear();
      await quantityInput.sendKeys('2');
      
      await driver.findElement(By.css('.add-to-cart')).click();
      
      // Verify cart
      const cartButton = await driver.findElement(By.css('.header .cart a'));
      await cartButton.click();
      
      await driver.wait(until.elementLocated(By.className('cart-item')), 5000);
      const cartItems = await driver.findElements(By.className('cart-item'));
      expect(cartItems.length).to.equal(1);
      
      const totalPrice = await driver.findElement(By.className('cart-total'));
      expect(await totalPrice.getText()).to.include('200');
    });

    it('should handle out-of-stock products correctly', async function() {
      // Navigate to out-of-stock product (assuming the third product is out of stock)
      const products = await driver.findElements(By.className('product-card'));
      const viewDetailsButtons = await products[2].findElements(By.css('.view-details'));
      await viewDetailsButtons[0].click();
      
      await driver.wait(until.elementLocated(By.css('.add-to-cart')), 5000);
      const addToCartBtn = await driver.findElement(By.css('.add-to-cart'));
      
      expect(await addToCartBtn.getAttribute('disabled')).to.equal('true');
      expect(await addToCartBtn.getText()).to.equal('Out of Stock');
    });
  });

  describe('Cart Integration Tests', function() {
    it('should handle multiple add/remove operations with state persistence', async function() {
      // Add first product
      await driver.wait(until.elementLocated(By.css('.product-card button')), 5000);
      const addButtons = await driver.findElements(By.css('.product-card button'));
      await addButtons[0].click();
      
      // Add second product
      await driver.navigate().refresh();
      await driver.wait(until.elementLocated(By.css('.product-card button')), 5000);
      const newAddButtons = await driver.findElements(By.css('.product-card button'));
      await newAddButtons[1].click();
      
      // Check cart
      const cartButton = await driver.findElement(By.css('.header .cart a'));
      await cartButton.click();
      
      await driver.wait(until.elementLocated(By.className('cart-item')), 5000);
      let cartItems = await driver.findElements(By.className('cart-item'));
      expect(cartItems.length).to.equal(2);
      
      // Remove one item
      const removeButton = await driver.findElement(By.css('.remove-item'));
      await removeButton.click();
      
      await driver.wait(async () => {
        cartItems = await driver.findElements(By.className('cart-item'));
        return cartItems.length === 1;
      }, 5000);
      
      expect(cartItems.length).to.equal(1);
    });

    it('should enforce order amount limits', async function() {
      // Add expensive product multiple times
      await driver.wait(until.elementLocated(By.css('.product-card button')), 5000);
      const addButtons = await driver.findElements(By.css('.product-card button'));
      
      // Add the most expensive product 4 times
      for(let i = 0; i < 4; i++) {
        await addButtons[2].click();
        await driver.wait(until.elementLocated(By.css('.cart-count')), 5000);
      }
      
      // Go to cart and try to checkout
      const cartButton = await driver.findElement(By.css('.header .cart a'));
      await cartButton.click();
      
      await driver.wait(until.elementLocated(By.css('.checkout-button')), 5000);
      await driver.findElement(By.css('.checkout-button')).click();
      
      // Verify error message
      await driver.wait(until.elementLocated(By.className('error-message')), 5000);
      const error = await driver.findElement(By.className('error-message'));
      expect(await error.getText()).to.equal('Maximum order amount is $1000');
    });
  });
});