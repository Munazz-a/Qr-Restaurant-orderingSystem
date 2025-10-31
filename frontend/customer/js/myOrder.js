let cart = [];
let CART_KEY = '';
let sessionId;
const totalAmount = document.getElementById('totalAmount');
const orderList = document.getElementById('order-list');
const placeOrderBtn = document.getElementById('placeOrderBtn');
const paymentModal = document.getElementById('paymentModal');
let PLACED_KEY;

document.addEventListener("DOMContentLoaded", () => {
    sessionId = localStorage.getItem("sessionId");
    CART_KEY = `table_${sessionId}`;
    PLACED_KEY = `${CART_KEY}_placed`;
    cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

    if(localStorage.getItem(PLACED_KEY) === "true"){
        console.log("got PLACED_KEY", PLACED_KEY);
        placeOrderBtn.disabled = true;
        placeOrderBtn.classList.add("opacity-50", "cursor-not-allowed");

        orderStatus.innerText = " ✅ Order Confirmed! Please wait for your food.";
        orderStatus.classList.remove("hidden");
    }

    console.log(cart)
    displayCartItems(cart);
})

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  console.log("Cart updated:", cart);

  if(cart.length === 0){
        orderList.innerHTML = `<p class="text-center text-gray-500">Your cart is empty</p>`;
        totalAmount.textContent = "";
        return;
    }

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
    totalAmount.textContent = `Total: ₹${totalAmt}`;
    
}

// payment logic

placeOrderBtn.addEventListener('click', () => {
    paymentModal.classList.remove('hidden');
    paymentModal.classList.add('flex');
})
paymentModal.addEventListener('click', (e) => {
    if(e.target === paymentModal){
        paymentModal.classList.add('hidden');
    }
})
document.getElementById('confirmPaymentBtn').addEventListener('click', () => {
    const selectedPayment = document.querySelector('input[name="payment"]:checked').value;
    console.log("selected: ", selectedPayment);
    paymentModal.classList.add('hidden');

    if(selectedPayment === 'Pay later'){
        savingToDb('Pay later', 'Pending');
    }
})

const orderStatus = document.getElementById('orderStatus');
async function savingToDb(paymentMethod, paymentStatus){
    try{
        const tableRes = await fetch(`/api/table/${sessionId}`);
        const tableData = await tableRes.json();

        const tableNo = tableData.tableNumber;

        const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const orderRes = await fetch('/api/order', {
            method : 'POST',
            headers : { "Content-Type" : "application/json" },
            body : JSON.stringify({
                tableNo,
                cart,
                totalAmount,
                paymentMethod,
                paymentStatus
            })
        })
        const orderData = await orderRes.json();
        console.log(orderData);

        if(orderData.success){
            PLACED_KEY = `${CART_KEY}_placed`;
            localStorage.setItem(PLACED_KEY, "true");

            placeOrderBtn.disabled = true;
            placeOrderBtn.classList.add("opacity-50", "cursor-not-allowed");

            orderStatus.innerText = " ✅ Order Confirmed! Please wait for your food.";
            orderStatus.classList.remove("hidden");
        }

    } catch(err){
        console.error('Error getting order response: ', err);
    }
}
// online payment

// const paymentClient = new google.payment.api.PaymentClient({ environment : "TEST" });
// const paymentRequest = {
//   apiVersion: 2,
//   apiVersionMinor: 0,
//   allowedPaymentMethods: [{
//     type: 'CARD',
//     parameters: {
//       allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
//       allowedCardNetworks: ['MASTERCARD', 'VISA']
//     },
//     tokenizationSpecification: {
//       type: 'PAYMENT_GATEWAY',
//       parameters: {
//         gateway: 'razorpay',  // or your provider (stripe, etc.)
//         gatewayMerchantId: 'your_merchant_id_here'
//       }
//     }
//   }],
//   merchantInfo: {
//     merchantId: '12345678901234567890',
//     merchantName: 'QR Restaurant'
//   },
//   transactionInfo: {
//     totalPriceStatus: 'FINAL',
//     totalPrice: totalAmount.toString(),
//     currencyCode: 'INR'
//   }
// };

async function onlinePayment(){
    try{
        const paymentData = await paymentClient.loadPaymentData(paymentRequest);
        const verifyRes = await fetch('/api/payment', {
            method : "POST",
            headers : { "Content-Type" : "application/json" },
            body : JSON.stringify({ paymentData })
        });
        const verifyResult = await verifyRes.json();

        if(verifyResult.success){
            console.log('Payment Verified!!');
            await savingToDb('Pay later', 'Paid');
        } else {
            console.error('Payment Error');
        }
    } catch(err){
        console.log('GPay error: ',err);
    }
}