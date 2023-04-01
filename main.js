/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/List.js
class List {
  constructor(parentEl) {
    this.parentEl = parentEl;
  }
  static listMarkup(listName, localStorageKey) {
    return `
        <div class="list-wrapper">
          <div class="list">
            <div class="list-header">
              <h2 class="list-header-name">${listName}</h2>
            </div>
            <div class="list-cards" data-key="${localStorageKey}">
              <!-- раскрытое меню -->
              <div class="card-composer hide">
                <div class="card-composer list-card">
                  <div class="card-composer list-card-details">
                    <textarea class="card-composer-textarea hover" placeholder="Ввести заголовок для этой карточки"></textarea>
                  </div>
                </div>
                <div class="controls">
                  <div class="controls-section">
                    <input class="new-card-button hover" type="button" value="Добавить карточку">
                    <button class="icon-close hover" type="button"></button>
                  </div>
                </div>
              </div>
            </div>
            <!-- закрытое меню -->
            <div class="card-composer-container">
              <a class="open-card-composer hover">
                <span class="icon-add"></span>
                <span class="add-a-card">Добавить карточку</span>
              </a>
            </div>
          </div>
        </div>
    `;
  }
  static cardMarkup(title) {
    if (title !== '') {
      return `
        <a class="list-card hover" href="#">
          <div class="list-card-details">
            <span class="list-card-title">
              ${title}
            </span>
          </div>
          <div class="list-card-remover hover"></div>
        </a>
      `;
    }
    return '';
  }
  static get cardComposerSelector() {
    return '.card-composer';
  }
  static get cardComposerContainerSelector() {
    return '.card-composer-container';
  }
  static get iconCloseSelector() {
    return '.icon-close';
  }
  static get newCardButtonSelector() {
    return '.new-card-button';
  }
  static get textareaSelector() {
    return '.card-composer-textarea';
  }
  static get cardsListSelector() {
    return '.list-cards';
  }
  static get cardSelector() {
    return '.list-card';
  }
  static get cardRemoverSelector() {
    return '.list-card-remover';
  }
  bindToDOM() {
    const {
      listName,
      localStorageKey
    } = this.parentEl.dataset;
    this.parentEl.innerHTML = this.constructor.listMarkup(listName, localStorageKey);
    const data = localStorage.getItem(localStorageKey);
    const composer = this.parentEl.querySelector(this.constructor.cardComposerSelector);
    this.constructor.init(data, composer, this.constructor.cardMarkup);
    const opener = this.parentEl.querySelector(this.constructor.cardComposerContainerSelector);
    const textarea = this.parentEl.querySelector(this.constructor.textareaSelector);
    opener.addEventListener('click', () => this.constructor.openCardComposer(opener, composer, textarea));
    const closer = this.parentEl.querySelector(this.constructor.iconCloseSelector);
    closer.addEventListener('click', () => this.constructor.closeCardComposer(opener, composer));
    composer.addEventListener('click', () => this.constructor.focusOnCardComposer(composer));
    const addBtn = this.parentEl.querySelector(this.constructor.newCardButtonSelector);
    const cardsList = this.parentEl.querySelector(this.constructor.cardsListSelector);
    addBtn.addEventListener('click', () => this.constructor.addNewCard(cardsList, composer, this.constructor.cardMarkup(textarea.value)));
    cardsList.addEventListener('click', event => this.constructor.deleteCard(cardsList, event, this.constructor.cardSelector, this.constructor.cardRemoverSelector));
  }
  static init(data, composer, getMarkup) {
    if (data) {
      let html = '';
      const cardsTitles = data.split('\n');
      cardsTitles.forEach(cardTitle => {
        html += getMarkup(cardTitle);
      });
      composer.insertAdjacentHTML('beforebegin', html);
    }
  }
  static openCardComposer(opener, composer, textarea) {
    opener.classList.add('hide');
    composer.classList.remove('hide');
    textarea.focus();
  }
  static closeCardComposer(opener, composer) {
    opener.classList.remove('hide');
    composer.classList.add('hide');
  }
  static focusOnCardComposer(composer) {
    const textarea = composer.querySelector('textarea');
    textarea.focus();
  }
  static addNewCard(cardsList, composer, markup) {
    const textarea = composer.querySelector('textarea');
    if (markup !== '') {
      composer.insertAdjacentHTML('beforebegin', markup);
      localStorage.setItem(cardsList.dataset.key, cardsList.innerText);
      textarea.value = '';
    } else {
      textarea.focus();
    }
  }
  static deleteCard(cardsList, event, cardSelector, cardRemoverSelector) {
    const {
      target
    } = event;
    if (target.className.includes(cardRemoverSelector.slice(1))) {
      target.closest(cardSelector).remove();
      if (cardsList.children.length > 1) {
        localStorage.setItem(cardsList.dataset.key, cardsList.innerText);
      } else {
        localStorage.removeItem(cardsList.dataset.key);
      }
    }
  }
}
;// CONCATENATED MODULE: ./src/js/DnD.js
class DnD {
  constructor(board, hoverElements, cardsVerticalDistance) {
    this.board = board;
    this.hoverElements = hoverElements;
    this.cardsVerticalDistance = cardsVerticalDistance;
    this.draggedEl = null;
    this.ghostEl = null;
    this.template = null;
    this.origin = {};
  }
  toggleGrabbing() {
    document.body.parentElement.classList.toggle('grabbing');
    this.hoverElements.forEach(element => {
      element.classList.toggle('hover');
    });
  }
  insertElement(event, closest, element) {
    const card = closest.closest('.list-card');
    let list;
    if (!card) {
      list = closest;
      let upCard = document.elementFromPoint(event.clientX, event.clientY - this.cardsVerticalDistance);
      let downCard = document.elementFromPoint(event.clientX, event.clientY + this.cardsVerticalDistance);
      if (upCard.className.startsWith('list-card')) {
        upCard = upCard.closest('.list-card');
        if (upCard) {
          list.insertBefore(element, upCard.nextElementSibling);
        }
      } else if (downCard.className.startsWith('list-card')) {
        downCard = downCard.closest('.list-card');
        if (downCard) {
          list.insertBefore(element, downCard);
        }
      } else {
        list.insertAdjacentElement('afterbegin', element);
      }
    } else {
      list = card.closest('.list-cards');
      const {
        top
      } = card.getBoundingClientRect();
      if (event.pageY > window.scrollY + top + card.offsetHeight / 2) {
        list.insertBefore(element, card.nextElementSibling);
      } else {
        list.insertBefore(element, card);
      }
    }
  }
  getCardBack() {
    const target = this.origin.sibling;
    target.insertAdjacentElement(this.origin.position, this.draggedEl);
  }
  handleMousedown() {
    this.board.addEventListener('mousedown', event => {
      event.preventDefault();
      const card = event.target.closest('.list-card');
      if (!card || event.target.classList.contains('list-card-remover') || event.target.className.startsWith('card-composer')) {
        return;
      }
      if (card.nextElementSibling && card.nextElementSibling.classList.contains('list-card')) {
        this.origin.position = 'beforebegin';
        this.origin.sibling = card.nextElementSibling;
      } else if (card.previousElementSibling && card.previousElementSibling.classList.contains('list-card')) {
        this.origin.position = 'afterend';
        this.origin.sibling = card.previousElementSibling;
      } else {
        this.origin.position = 'afterbegin';
        this.origin.sibling = card.closest('.list-cards');
      }
      this.origin.shiftX = event.clientX - card.getBoundingClientRect().left;
      this.origin.shiftY = event.clientY - card.getBoundingClientRect().top;
      this.origin.left = event.pageX - this.origin.shiftX;
      this.origin.top = event.pageY - this.origin.shiftY;
      this.draggedEl = card;
      this.ghostEl = card.cloneNode(true);
      this.ghostEl.classList.add('dragged');
      document.body.appendChild(this.ghostEl);
      this.ghostEl.style.left = `${this.origin.left}px`;
      this.ghostEl.style.top = `${this.origin.top}px`;
      this.template = card.cloneNode(true);
      this.template.style.backgroundColor = '#e2e4ea';
      this.template.style.boxShadow = 'none';
      this.template.lastElementChild.style.display = 'none';
      this.template.style.cursor = 'grabbing';
      const title = this.template.querySelector('.list-card-title');
      title.style.color = '#e2e4ea';
      card.replaceWith(this.template);
      this.toggleGrabbing();
    });
  }
  handleMousemove() {
    this.board.addEventListener('mousemove', event => {
      event.preventDefault();
      if (!this.draggedEl) {
        return;
      }
      this.ghostEl.classList.add('transformed');
      this.template.remove();
      const closest = document.elementFromPoint(event.clientX, event.clientY);
      if (closest.className.startsWith('list-card')) {
        this.insertElement(event, closest, this.template);
      }
      this.ghostEl.style.left = `${event.pageX - this.origin.shiftX}px`;
      this.ghostEl.style.top = `${event.pageY - this.origin.shiftY}px`;
    });
  }
  handleMouseleave() {
    this.board.addEventListener('mouseleave', () => {
      if (!this.draggedEl) {
        return;
      }
      this.template.remove();
      this.getCardBack();
      document.body.removeChild(this.ghostEl);
      this.toggleGrabbing();
      this.ghostEl = null;
      this.draggedEl = null;
      this.template = null;
      this.origin = {};
    });
  }
  handleMouseup() {
    this.board.addEventListener('mouseup', event => {
      if (!this.draggedEl) {
        return;
      }
      this.template.remove();
      const closest = document.elementFromPoint(event.clientX, event.clientY);
      if (Math.trunc(this.origin.left) === parseInt(this.ghostEl.style.left, 10) && Math.trunc(this.origin.top) === parseInt(this.ghostEl.style.top, 10)) {
        const target = this.origin.sibling;
        target.insertAdjacentElement(this.origin.position, this.draggedEl);
      } else if (closest.className.startsWith('list-card')) {
        this.insertElement(event, closest, this.draggedEl);
        const originalCardsList = this.origin.sibling.closest('.list-cards');
        localStorage.setItem(originalCardsList.dataset.key, originalCardsList.innerText);
        const newCardsList = closest.closest('.list-cards');
        if (originalCardsList !== newCardsList) {
          localStorage.setItem(newCardsList.dataset.key, newCardsList.innerText);
        }
      } else {
        this.getCardBack();
      }
      document.body.removeChild(this.ghostEl);
      this.ghostEl = null;
      this.draggedEl = null;
      this.template = null;
      this.origin = {};
      this.toggleGrabbing();
    });
  }
}
;// CONCATENATED MODULE: ./src/js/app.js


const containers = document.querySelectorAll('.list-container');
containers.forEach(container => {
  const list = new List(container);
  list.bindToDOM();
});
const board = document.querySelector('.board');
const hoverElements = document.querySelectorAll('.hover');
const cardsVerticalDistance = 8;
const dragAndDrop = new DnD(board, hoverElements, cardsVerticalDistance);
dragAndDrop.handleMousedown();
dragAndDrop.handleMousemove();
dragAndDrop.handleMouseleave();
dragAndDrop.handleMouseup();
document.addEventListener('keyup', event => {
  if (event.key === 'Enter') {
    const cardsList = document.activeElement.closest('.list-cards');
    const addBtn = cardsList.querySelector('.new-card-button');
    const closeBtn = addBtn.nextElementSibling;
    addBtn.click();
    closeBtn.click();
    document.activeElement.value = '';
  }
});
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;