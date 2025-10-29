let cart = [];
let CART_KEY = '';
const totalAmount = document.getElementById('totalAmount');
const orderList = document.getElementById('order-list');

document.addEventListener("DOMContentLoaded", () => {
    const sessionId = localStorage.getItem("sessionId");
    CART_KEY = `table_${sessionId}`;
    cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

    console.log(cart)

    displayCartItems(cart);
})

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  console.log("Cart updated:", cart);

}

function increaseQty(btn){
    const itemdiv = btn.closest('.item');
    const qty = itemdiv.querySelector('.qty');
    const nameSpan = itemdiv.querySelector('.nameSpan');
    const itemName = nameSpan.getAttribute('data-name');

    qty.textContent = Number(qty.textContent) + 1;

    const item = cart.find(i => i.name === itemName );
    item.quantity++;
    nameSpan.textContent = `${item.name} X ${item.quantity}`;

    saveCart()
    priceUpdate(btn, item)
}

function decreaseQty(btn){
    const itemdiv = btn.closest('.item');
    const qty = itemdiv.querySelector('.qty');
    const nameSpan = itemdiv.querySelector('.nameSpan');
    const itemName = nameSpan.getAttribute('data-name');

  let newQty = Number(qty.textContent) - 1;
  if(newQty <= 0){
    orderList.removeChild(itemdiv);
  } else {
    qty.textContent = newQty;
  }

  const item = cart.find(i => i.name === itemName);
  item.quantity--;
  nameSpan.textContent = `${item.name} X ${item.quantity}`;

  if(item.quantity <= 0){
    cart = cart.filter(i => i.name !== itemName);
  }
  saveCart()
  priceUpdate(btn, item)
}

function priceUpdate(btn, item){
    const itemdiv = btn.closest('.item');
    const pricespan = itemdiv.querySelector('.priceSpan');

    const total = `₹${item.price * item.quantity}`;
    pricespan.textContent = total;
    saveCart();
   totalBill();
}

function totalBill(){
    let price = 0;
    cart.forEach(item => {
        price += item.price * item.quantity;
    })
    totalAmount.textContent = `₹${price}`;
}


// let priceSpan = 0;

function displayCartItems(cart){

    if(cart.length === 0){
        orderList.innerHTML = `<p class="text-center text-gray-500">Your cart is empty</p>`;
        totalAmount.textContent = "";
        return;
    }

    let totalAmt = 0;
    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item flex bg-gray-100 p-3 rounded-lg mx-3 items-center justify-between';

        // name, price div
        const leftDiv = document.createElement('div');
        leftDiv.className = 'flex flex-col';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'nameSpan';
        nameSpan.setAttribute("data-name", item.name);
        nameSpan.textContent = `${item.name} X ${item.quantity}`;

        const priceSpan = document.createElement('span');
        priceSpan.className = 'priceSpan';
        priceSpan.setAttribute("data-name", item.name);
        priceSpan.textContent = `₹${item.price * item.quantity}`

        leftDiv.appendChild(nameSpan);
        leftDiv.appendChild(priceSpan);

        // controlDiv
        const rightDiv = document.createElement('div');
        rightDiv.classList = 'flex items-center gap-4';
        rightDiv.innerHTML = `
            <div class="mt-2 flex justify-end items-center gap-4">
                <div class="qty-box flex items-center gap-3">
                    <button class="decrease bg-gray-200 px-2 pb-1 rounded" onclick="decreaseQty(this)">-</button>
                    <span class="qty text-lg font-bold">${item.quantity}</span>
                    <button class="increase bg-gray-200 px-2 pb-1 rounded" onclick="increaseQty(this)">+</button>
                </div>
            </div>`

        
        itemDiv.appendChild(leftDiv);
        itemDiv.appendChild(rightDiv);
        orderList.appendChild(itemDiv);
        totalAmt += item.price * item.quantity;

    })
    totalAmount.textContent = `total: ${totalAmt}`;
}
