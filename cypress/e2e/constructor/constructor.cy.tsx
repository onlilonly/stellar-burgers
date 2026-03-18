describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');
    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    cy.setCookie('accessToken', 'testAccessToken');
    cy.window().then((res) => {
      res.localStorage.setItem('refreshToken', 'testRefreshToken');
    });
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(()=> {
    cy.clearCookie('accessToken')
    cy.window().then((res) => {
      res.localStorage.removeItem('refreshToken');
    });
  })

  describe('Добавление ингредиентов', () => {
    it('должен отображать ингредиенты из моков', () => {
      cy.contains('Краторная булка N-200i').should('exist');
      cy.contains('Биокотлета из марсианской Магнолии').should('exist');
    });

    it('должен добавлять булки в конструктор', () => {
      cy.contains('Краторная булка N-200i').parent().find('button').click();
      cy.get('[data-cy=burger-constructor]').should(
        'contain',
        'Краторная булка N-200i'
      );
    });

    it('должен добавлять начинку в конструктор', () => {
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .click();
      cy.get('[data-cy=burger-constructor]').should(
        'contain',
        'Биокотлета из марсианской Магнолии'
      );
    });

    it('должен добавлять соус в конструктор', () => {
      cy.contains('Соус фирменный Space Sauce').parent().find('button').click();
      cy.get('[data-cy=burger-constructor]').should(
        'contain',
        'Соус фирменный Space Sauce'
      );
    });

    it('должен добавлять булки, соус и начинку в конструктор', () => {
      cy.contains('Краторная булка N-200i').parent().find('button').click();
      cy.contains('Соус фирменный Space Sauce').parent().find('button').click();
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .click();
      cy.get('[data-cy=burger-constructor]')
        .should('contain', 'Краторная булка N-200i')
        .and('contain', 'Соус фирменный Space Sauce')
        .and('contain', 'Биокотлета из марсианской Магнолии');
    });
  });

  describe('Модальное окно с деталями ингредиента', () => {
    it('должен отрывать модальное окно ингредиента', () => {
      cy.contains('Соус фирменный Space Sauce').click();
      cy.get('[data-cy=Modal]').should('be.visible')
      cy.get('[data-cy=Modal]').contains('Соус фирменный Space Sauce').should('exist');
    });

    it('должен закрывать модальное окно ингредиента по клику на overlay', () => {
      cy.contains('Соус фирменный Space Sauce').click();
      cy.get('[data-cy=Modal-overlay]').click({ force: true });
      cy.get('[data-cy=Modal]').should('not.exist');
    });

    it('должен закрывать модальное окно ингредиента по клику на крестик', () => {
      cy.contains('Соус фирменный Space Sauce').click();
      cy.get('[data-cy=CloseModalButton]').click();
      cy.get('[data-cy=Modal]').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    it('должен создать заказ и проверить его номер', () => {
      cy.contains('Краторная булка N-200i').parent().find('button').click();
      cy.contains('Соус фирменный Space Sauce').parent().find('button').click();
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .click();
      cy.contains('Оформить заказ').click();
      cy.wait('@createOrder');
      cy.get('[data-cy=Modal]').should('be.visible');
      cy.get('[data-cy=OrderNumber]').should('contain', '102920');
    });
  });

  describe('Модальное окно с деталями заказа', () => {
    it('должен закрыть модальное окно заказа и проверить, что конструктор очищен', () => {
      cy.contains('Краторная булка N-200i').parent().find('button').click();
      cy.contains('Соус фирменный Space Sauce').parent().find('button').click();
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .click();
      cy.contains('Оформить заказ').click();
      cy.wait('@createOrder');
      cy.get('[data-cy=Modal]').should('be.visible');
      cy.get('[data-cy=Modal-overlay]').click({ force: true });
      cy.get('[data-cy=Modal]').should('not.exist');
      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');
    });
  });
});
