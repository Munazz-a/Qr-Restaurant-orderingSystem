const token = localStorage.getItem('token');

fetch('/api/admin/dashboard', {
    headers : {
        Authorization : `Bearer ${token}`
    }
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));

// fetching cart
// const sessionId = localStorage.getItem('sessionId');
// const CART_KEY = `table_${sessionId}`;
// const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
// const cartData = document.getElementById('cartData');

async function loadOrders(){
  const res = await fetch('/api/getOrders')
  const data = await res.json();
  renderOrder(data);
}

function renderOrder(data){
  const tdbody = document.getElementById('ordersTableBody');
    tdbody.innerHTML = '';

    data.forEach(order => appendOrder(order))
}

function appendOrder(order){
  const tbody = document.getElementById('ordersTableBody');
  const row = document.createElement('tr');
  row.className = "hover:bg-gray-50 transition";

  row.innerHTML = `
    <td class="px-6 py-4 text-gray-800 font-medium">${order.tableNo}</td>
    <td class="px-6 py-4 text-gray-600">${new Date(order.createdAt).toLocaleString("en-IN", {timeZone: "Asia/Kolkata"})}</td>
    <td class="px-6 py-4 text-gray-600">${order.cart.map(i => `${i.name} (${i.quantity})`).join('<br>')}</td>
    <td class="px-6 py-4 text-gray-600">${order.totalAmount}</td>
    <td class="px-6 py-4 text-gray-600">${order.paymentMethod}</td>
    <td class="px-6 py-4 text-gray-600">${order.paymentStatus}</td>
  `
  tbody.prepend(row);
}

const socket = io();

socket.on('newOrder', (order) => {
  appendOrder(order)
})

loadOrders();



