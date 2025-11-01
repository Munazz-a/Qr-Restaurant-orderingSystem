const token = localStorage.getItem('token');

fetch('/api/chef/dashboard', {
    headers : {
        Authorization : `Bearer ${token}`
    }
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));

// fetching cart

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
    <td class="px-6 py-4 text-gray-800 font-medium"> ${order.tableNo} </td>
    <td class="px-6 py-4 text-gray-600"> ${order.cart.map(i => `${i.name} (${(i.quantity)}) `).join('<br>')} </td>
    <td class="px-6 py-4 ext-gray-600 cursor-pointer text-red-500"> <i class="bi bi-x-lg"></i> </td>
  `
  row.querySelector('td:last-child').addEventListener('click', () => {
    row.remove();
  })
  tbody.prepend(row);
}

const socket = io();

socket.on('newOrder', (order) => {
  appendOrder(order)
})

loadOrders();

