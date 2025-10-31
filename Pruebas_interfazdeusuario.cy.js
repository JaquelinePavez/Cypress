// Test00 de prueba
describe('Visitar página principal', () => {
  it('Debería cargar la página correctamente', () => {
    cy.visit('https://www.saucedemo.com/');
    cy.title().should('include', 'Swag Labs');
  });
});

// PUNTO2 - Fallo de login
describe('Fallo de Login', () => {
  it('Debería mostrar error de credenciales inválidas', () => {
    cy.visit('https://www.saucedemo.com/');
    cy.get('[data-test="username"]').type('new_user');
    cy.get('[data-test="password"]').type('sauce');
    cy.get('[data-test="login-button"]').click();

    cy.contains(
      'Epic sadface: Username and password do not match any user in this service'
    ).should('be.visible');
  });
});

// ----------------------------------------------------------------------------------------------------------------------
// PUNTO1 + PUNTO3 + PUNTO4 + OPCIONALES
//agrupe todos los tests que requieren login, para no repetir codigo
describe('LOGIN EXITOSO', () => {
  beforeEach(() => {
 
    cy.visit('https://www.saucedemo.com/');
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();

    // ACEPTACION PUNTO1- la URL incluye /inventory y se visualiza “Products”
    cy.url().should('include', '/inventory');
    cy.contains('Products').should('be.visible');
  });

  // PUNTO3 - Confirmar acceso al inventario
  it('Debería ingresar correctamente al inventario', () => {
    cy.url().should('include', '/inventory');
  });

  // PUNTO3 - Verificar que hay al menos 6 productos.
  it('Debería mostrar al menos 6 productos', () => {
    cy.get('.inventory_item', { timeout: 10000 }).should('have.length.at.least', 6);
  });

  // Aceptación PUNTO3: asertar nombre y precio en al menos 2 ítems.
  it('Verifica nombre y precio de los primeros 2 ítems', () => {
    cy.get('.inventory_item').eq(0).within(() => {
      cy.get('.inventory_item_name').should('be.visible');//PRIMER ITEM NOMBRE
      cy.get('.inventory_item_price').should('be.visible');
    });

    cy.get('.inventory_item').eq(1).within(() => {
      cy.get('.inventory_item_name').should('be.visible');//SEGUNDO ITEM
      cy.get('.inventory_item_price').should('be.visible');
    });
  });

  // PUNTO4 - Ordenamiento-Usar el selector de sort: Name (A to Z) y Price (low to high).
  it('Ordenar por Name (A to Z)', () => {
    cy.get('[data-test="product-sort-container"]').select('Name (A to Z)');
    cy.get('.inventory_item_name')
      .first()
      .should('contain.text', 'Sauce Labs Backpack');
  });

  it('Ordenar por Price (low to high)', () => {
    cy.get('[data-test="product-sort-container"]').select('Price (low to high)');
    cy.get('.inventory_item_price')
      .first()
      .invoke('text')
      .then((text) => parseFloat(text.replace('$', '')))
      .should('be.gte', 0);
  });

  // TEST OPCIONALES- Carrito Agregar 2 productos desde el inventario; abrir carrito; remover 1.

  it('Agregar y remover productos del carrito', () => {
    // Agregar dos productos
    cy.get('.inventory_item').eq(0).find('button').click();
    cy.get('.inventory_item').eq(1).find('button').click();
    cy.get('.shopping_cart_badge').should('have.text', '2');

    // Entrar al carrito
    cy.get('.shopping_cart_link').click();
    cy.get('.cart_item').should('have.length', 2);

    // Eliminar un producto
    cy.get('.cart_item').eq(0).find('button').click();
    cy.get('.cart_item').should('have.length', 1);
  });
});

