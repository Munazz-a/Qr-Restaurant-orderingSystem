document.addEventListener('DOMContentLoaded', () => {
  restoreCartUI();
})

const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const mobileSearch = document.getElementById('mobileSearch');
const laptopSearch = document.getElementById('laptopSearch');
const viewCart = document.getElementById('viewCart')
const cartItems = document.getElementById('cartItems')


function toggleSidebar() {
  const isHidden = sidebar.classList.contains('-translate-x-full');
  sidebar.classList.toggle('-translate-x-full', !isHidden);
  sidebar.classList.toggle('translate-x-0', isHidden);
  overlay.classList.toggle('hidden', !isHidden);
}

function toggleSearch() {
  mobileSearch.classList.toggle('hidden');
}

// searchbar logic
const foodItem = document.querySelectorAll('.food-item');
const noResult = document.getElementById('noResult');
const mobileSearchInput = document.getElementById('mobileSearchInput');
const laptopSearchInput = document.getElementById('laptopSearchInput');

function updateSearchDisplay(){
  const visibleItem = [...foodItem].filter(item => item.style.display !== "none");
  noResult.style.display = visibleItem.length === 0 ? "block" : "none";

  // Hide sections that have no visible items
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    const hasVisible = section.querySelectorAll('.food-item:not([style*="display: none"])').length > 0;
    section.style.display = hasVisible ? "" : "none";
  });
}

[mobileSearchInput, laptopSearchInput].forEach( input => {
    if(!input) return;
    input.addEventListener('input', () => {
      const searchText = input.value.toLowerCase();

      foodItem.forEach(item => {
        const parent = item.closest('.food-item')
        const itemName = item.textContent.toLowerCase();
        parent.style.display = itemName.includes(searchText) ? "" : "none";
      })
      updateSearchDisplay();
    })
})


// add to cart (+ & -) logic
const sessionId = localStorage.getItem('sessionId');
const CART_KEY = `table_${sessionId}`;
let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  console.log("Cart updated:", cart);

  if(cart.length === 0){
    viewCart.classList.add('hidden')
  } else {
    cartItems.classList.remove('hidden');
    cartItems.innerHTML = cart.length;
  }
}

function addToCart(button){
  const card = button.parentElement;
  button.classList.add('hidden');
  card.querySelector('.qty-box').classList.remove('hidden');

  viewCart.classList.remove('hidden');

  // cart
  const itemElement = button.closest('.food-item');
  const name = itemElement.querySelector('.food-name').innerText;
  const price = itemElement.querySelector('p').innerText.replace('₹', '');

  if(!cart.find(item => item.name === name)){
    cart.push({
      name,
      price : Number(price),
      quantity : 1
    });
  }
  saveCart()
}

function increaseQty(btn){
  const qty = btn.parentElement.querySelector('.qty');
  qty.textContent = Number(qty.textContent) + 1;

  const itemElement = btn.closest('.food-item');
  const name = itemElement.querySelector('.food-name').innerText;

  const item = cart.find(i => i.name === name);
  item.quantity++;

  saveCart()
}

function decreaseQty(btn){
  const qty = btn.parentElement.querySelector('.qty');
  let newQty = Number(qty.textContent) - 1;
  if(newQty <= 0){
    const card = btn.parentElement.parentElement;
    card.querySelector('.add-btn').classList.remove('hidden');
    card.querySelector('.qty-box').classList.add('hidden');
    qty.textContent = 1;
  } else {
    qty.textContent = newQty;
  }

  const itemElement = btn.closest('.food-item');
  const name = itemElement.querySelector('.food-name').innerText;

  const item = cart.find(i => i.name === name);
  item.quantity--;

  if(item.quantity <= 0){
    cart = cart.filter(i => i.name !== name);
    itemElement.querySelector('.add-btn').classList.remove('hidden');
    itemElement.querySelector('.qty-box').classList.add('hidden')
  }
  saveCart()
}

window.onload = () => {
  toggleSidebar();
}

// sessionId & table number fetching.
// const sessionId = localStorage.getItem('sessionId');
fetch(`/api/table/${sessionId}`)
.then(res => res.json())
.then(data => {
  console.log(data);
  document.getElementById('tableNumber').innerText = data.tableNumber;
})

// reload cart on refresh
function restoreCartUI(){
  cart.forEach(item => {
    document.querySelectorAll('.food-item').forEach(card => {
      const nameEl = card.querySelector('.food-name');

      if(nameEl.innerHTML === item.name){
        card.querySelector('.add-btn').classList.add('hidden');
        card.querySelector('.qty-box').classList.remove('hidden');
        card.querySelector('.qty').textContent = item.quantity;
      }
    })
  })
  if(cart.length > 0){
    viewCart.classList.remove('hidden');
    cartItems.classList.remove('hidden');
    cartItems.innerHTML = cart.length;
  }
}