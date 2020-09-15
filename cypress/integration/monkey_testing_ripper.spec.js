describe('Wikipedia under monkeys', function () {
    it('visits wikipedia and survives monkeys', function () {
        cy.visit('https://es.wikipedia.org/wiki/Wikipedia:Portada');
        cy.wait(1000);
        randomClick(10);
        randomEvent(10);
    })
})

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomClick(monkeysLeft) {
    var monkeysLeft = monkeysLeft;
    if (monkeysLeft > 0) {
        cy.get('a').then($links => {
            var randomLink = $links.get(getRandomInt(0, $links.length));
            if (!Cypress.dom.isHidden(randomLink)) {
                cy.wrap(randomLink).click({ force: true });
                monkeysLeft = monkeysLeft - 1;
            }
            cy.wait(500);
            randomClick(monkeysLeft);
        });
    }
}
const elements = ['a', 'input', 'select', 'button'];
function randomEvent(monkeysLeft) {
    if (monkeysLeft > 0) {
        const random = getRandomInt(0, 3);
        executeEvent(monkeysLeft - 1, elements[random], random);
    }
}

function checkIfExists(element) {
    return new Promise((resolve, reject) => {
        cy.get('body').then(body => {
            const searched = body.find(element);
            if (searched.length) {
                resolve();
            } else {
                reject();
            }
        });
    });
}

function executeEvent(monkeysLeft, element, action) {
    checkIfExists(element).then(el => {
        cy.get(element).then(searched => {
            console.log(searched);
            var randomElement = searched.get(getRandomInt(0, searched.length));
            if (randomElement) {
                if (!Cypress.dom.isHidden(randomElement)) {
                    if (action === 0 || action === 3) {
                        cy.wrap(randomElement).click({ force: true });
                    } else if (action === 1) {
                        cy.wrap(randomElement).type('123', { force: true });
                    } else if (action === 2) {
                        cy.wrap(randomElement).children('option').then(option => option.get(0).removeAttribute('disabled')).eq(0).then(option => {
                            cy.wrap(randomElement).select(option.val());
                        });
                    }
                } else {
                    cy.log('hidden element');
                }
                cy.wait(1000);
                randomEvent(monkeysLeft);
            }
        });
    }).catch(err => {
        cy.log(element + ' not present').then(el => {
            randomEvent(monkeysLeft);
        });
    });
}