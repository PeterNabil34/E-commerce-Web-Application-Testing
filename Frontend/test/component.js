import { expect } from 'chai';
import { Builder, By, until } from 'selenium-webdriver';

describe('E-commerce Unit Tests', function() {
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

  describe('Product List Tests', function() {
    it('should display all products initially', async function() {
      const products = await driver.findElements(By.className('product-card'));
      expect(products.length).to.equal(3);
    });

    it('should show correct product details in each card', async function() {
      const firstCard = await driver.findElement(By.className('product-card'));
      const title = await firstCard.findElement(By.css('h2'));
      const price = await firstCard.findElement(By.className('product-price'));
      
      await driver.wait(until.elementIsVisible(title), 5000);
      await driver.wait(until.elementIsVisible(price), 5000);
      
      expect(await title.getText()).to.equal('Oraimo Watch 2R');
      expect(await price.getText()).to.equal('$100');
    });

    it('should filter products correctly on search', async function() {
      const searchInput = await driver.findElement(By.css('.search-bar input'));
      await searchInput.clear();
      await searchInput.sendKeys('Watch');
      await driver.findElement(By.css('.search-bar button')).click();
      
      await driver.wait(until.elementLocated(By.className('product-card')), 5000);
      const products = await driver.findElements(By.className('product-card'));
      expect(products.length).to.equal(1);
      
      const productTitle = await products[0].findElement(By.css('h2'));
      expect(await productTitle.getText()).to.contain('Watch');
    });

    it('should show no results message for invalid search', async function() {
      const searchInput = await driver.findElement(By.css('.search-bar input'));
      await searchInput.clear();
      await searchInput.sendKeys('NonexistentProduct');
      await driver.findElement(By.css('.search-bar button')).click();
      
      await driver.wait(until.elementLocated(By.className('no-results')), 5000);
      const noResults = await driver.findElement(By.className('no-results'));
      expect(await noResults.getText()).to.equal('No results found');
    });
  });

  describe('Product Detail Tests', function() {
    it('should display correct product information', async function() {
      // Wait for and click the first product's details button
      await driver.wait(until.elementLocated(By.css('.view-details')), 5000);
      const detailsButton = await driver.findElement(By.css('.view-details'));
      await detailsButton.click();
      
      // Wait for detail page elements
      await driver.wait(until.elementLocated(By.css('.product-info h2')), 5000);
      
      const title = await driver.findElement(By.css('.product-info h2'));
      const price = await driver.findElement(By.className('product-price'));
      const stock = await driver.findElement(By.className('stock-level'));
      
      expect(await title.getText()).to.equal('Oraimo Watch 2R');
      expect(await price.getText()).to.equal('$100');
      expect(await stock.getText()).to.contain('15');
    });

    it('should handle quantity validation', async function() {
      await driver.wait(until.elementLocated(By.css('.view-details')), 5000);
      const detailsButton = await driver.findElement(By.css('.view-details'));
      await detailsButton.click();
      
      await driver.wait(until.elementLocated(By.css('input[type="number"]')), 5000);
      const quantityInput = await driver.findElement(By.css('input[type="number"]'));
      await quantityInput.clear();
      await quantityInput.sendKeys('6');
      
      await driver.wait(until.elementLocated(By.className('error-message')), 5000);
      const error = await driver.findElement(By.className('error-message'));
      expect(await error.getText()).to.equal('Quantity must be between 1 and 5');
    });
  });

  describe('Cart Unit Tests', function() {
    it('should show empty cart message initially', async function() {
      const cartButton = await driver.findElement(By.css('.header .cart a'));
      await cartButton.click();
      
      const emptyMessage = await driver.findElement(By.className('.cart-page p'));
      expect(await emptyMessage.getText()).to.equal('Your cart is empty');
    });

    it('should update cart count in header', async function() {
      await driver.wait(until.elementLocated(By.css('.product-card button')), 5000);
      const addToCartBtn = await driver.findElement(By.css('.product-card button'));
      await addToCartBtn.click();

      const cartBtn = await driver.findElement(By.css('.header .cart a'));
      expect(await cartBtn.getText()).to.include('1');
    });
  });
});