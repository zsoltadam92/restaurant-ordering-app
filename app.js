import menuArray from "./data.js";
import { validateFullName,validateCardNumber } from './formValidate.js';

let menuList = document.getElementById('menu')
const order = document.getElementById('order')
let orderList = []
const container = document.querySelector('.container')

function renderMenuList() {

  menuList.innerHTML = menuArray.reduce((total, item) => { 
  return total +  `
    <section class="item">
    <div class="item__product">
      <div class="item__picture">${item.emoji}</div>
      <div class="item__details">
        <h2 class="item__name">${item.name}</h2>
        <p class="item__ingredients">${item.ingredients}</p>
        <h3 class="item__price">${item.price} $</h3>
      </div>
    </div>
    <button class="item__add-button" data-add_button="${item.id}">+</button>
  </section>
    `}, ``)
}

renderMenuList()

document.addEventListener('click', (e) => {
  if(e.target.dataset.add_button) {
    handleAddButtonClick(e.target.dataset.add_button)
    }
  if(e.target.dataset.remove_button) {
    handleRemoveButtonClick(e.target.dataset.remove_button)
    }
  if(e.target.className === 'order__complete') {
    handleCompleteOrderButtonClick()
  }
  })

function handleAddButtonClick(addButtonId) {

  if (order.innerHTML === '') {
   createOrderElements()
  } else if(document.querySelector('.order__success')) {
      order.removeChild(document.querySelector('.order__success'))
      createOrderElements()
    }
  
  renderOrderList(addButtonId)
  
}

function createOrderElements() {
  let orderTitle
  let orderList
  let orderTotal
  let orderButton
  
  createNewElement(orderTitle,'h2',order,'order__title','Your order')
  createNewElement(orderList,'div',order,'order__list','')
  createNewElement(orderTotal,'section',order,'order__total','')
  createNewElement(orderButton,'button',order,'order__complete','Complete order')
}

function createNewElement(name, element, parent,className,text) {
  name = document.createElement(element)
  parent.appendChild(name)
  name.classList.add(className)
  name.textContent = text
}

function renderOrderList(addButtonId) {
  if(document.querySelector('.order__list')) {

    const targetMenu = menuArray.filter(menu =>  addButtonId == menu.id)[0]
    if(!orderList.includes(targetMenu)) {
      targetMenu.quantity = 1
      orderList.push(targetMenu)
      getOrderItem()
    } else if(orderList.includes(targetMenu)) {
      orderList.forEach(menu => {
        if(menu.id == addButtonId) {
          menu.quantity = menu.quantity + 1
          getOrderItem()
        } 
      })
    }
    const total = orderList.reduce((total,item) => total + (item.price * item.quantity) ,0)
    renderTotal(total)
  
  }
}

function getOrderItem() {
  document.querySelector('.order__list').innerHTML = orderList.map(menu => {
    return `<section class="order__item">
    <h2 class="order__name">${menu.name}</h2>
    <input type="number" class="order__quantity" name="quantity" min="1" value="${menu.quantity}" aria-label="quantity"  readonly/>
    <i class="fa-solid fa-trash order__remove" data-remove_button="${menu.id}" aria-hidden="true" title="Remove"></i> 
    <h3 class="order__price">${menu.price * menu.quantity} $</h3>
    </section>`
  }).join('')
}

function renderTotal(total) {
  if(document.querySelector('.order__total').innerHTML === '') {
    document.querySelector('.order__total').innerHTML += `
      <h2 class="order__name">Total price:</h2>
      <h3 class="order__price total_price">${total}$</h3>
    `
  } else {
    document.querySelector('.total_price').textContent = `${total} $`
  }
}

function handleRemoveButtonClick(removeButtonId) {
  const findIndex = orderList.findIndex(menu =>  removeButtonId == menu.id)
  orderList.splice(findIndex,1)
  getOrderItem()

  const total = orderList.reduce((total,item) => total + (item.price * item.quantity) ,0)
  renderTotal(total)

  if(orderList.length === 0) {
    order.innerHTML = ''
  }
}

function handleCompleteOrderButtonClick() {
  let orderComplete
  let getModalHtml = `
  <h2 class="modal__title"> Enter card details</h2>
  <input 
    class="modal__input"
    type="text" 
    name="fullName" 
    id="fullName" 
    placeholder="Enter your name" 
    required 
    aria-label="full name">
    <p class="error" aria-live="polite"></p>
    <input 
    class="modal__input" 
    type="text" 
    name="cardNumber" 
    id="cardNumber" 
    placeholder="Enter card number" 
    required 
    aria-label="card number"
    minlength ="19"
    maxlength ="19">
    <p class="error" aria-live="polite"></p>
  <input 
    class="modal__input" 
    type="password" 
    name="card_CVV" 
    id="card_CVV" 
    placeholder="Enter CVV" 
    required 
    aria-label="CVV"
    minlength ="3"
    maxlength ="3">
  <button class="modal__pay" type="submit">Pay</button>
  `
  orderComplete = document.createElement('form')
  container.appendChild(orderComplete)
  orderComplete.classList.add('modal')
  orderComplete.innerHTML = getModalHtml

  validateFullName()
  

  document.getElementById('cardNumber').addEventListener('keyup', () => {
    let cardNumber = document.getElementById('cardNumber')
    let index = cardNumber.value.lastIndexOf('-')
    let test = cardNumber.value.substr(index + 1)
    if(test.length  === 4 && cardNumber.value.length < 19) {
      cardNumber.value += '-'
    }
    validateCardNumber()
  })

  handlePayClick()
}

function handlePayClick() {
  document.querySelector('.modal').addEventListener('submit', (e) => {
    let fullName = document.getElementById('fullName').value
    let firstName = fullName.split(" ")[0]
    e.preventDefault()
    container.removeChild(document.querySelector('.modal'))
    orderList = []
    document.querySelector('.order').innerHTML = `
    <p class="order__success">Thanks, ${firstName}! Your order is on its way!</p>
    `
   
    
  })
}
