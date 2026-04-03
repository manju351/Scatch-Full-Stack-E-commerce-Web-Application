// 1️⃣ Signup Email
exports.welcomeEmail = (name) => `
  <h2>Welcome to Scatch 🎉</h2>
  <p>Hi ${name},</p>
  <p>Your account has been created successfully.</p>
  <p>Start shopping now 🛍️</p>
`;

exports.orderPlacedEmail = (order) => {

  let productHTML = "";

  order.products.forEach(item => {
    let product = item.productId;

    productHTML += `
      <div style="display:flex; gap:10px; margin-bottom:15px;">
        <img src="https://scatch-full-stack-e-commerce-web.onrender.com/product/${product._id}/image" width="60" />
        
        <div>
          <p><b>${product.name}</b></p>
          <p>Qty: ${item.quantity}</p>
          <p>₹ ${product.price - product.discount}</p>
        </div>
      </div>
    `;
  });

  return `
    <div style="font-family:Arial; padding:20px;">
      
      <h2>Order ${order.status} 📦</h2>
      <p>Order ID: <b>${order.orderId}</b></p>

      <hr/>

      <h3>🛍 Products</h3>
      ${productHTML}

      <hr/>

      <h3>💰 Price Details</h3>
      <p>Total Amount: <b>₹ ${order.total}</b></p>

      <hr/>

      <h3>📍 Delivery Address</h3>
      <p>${order.address.name}</p>
      <p>${order.address.location}</p>
      <p>${order.address.pincode}</p>

      <hr/>

      <p>Status: <b>${order.status}</b></p>

      <br/>

      <p>Thank you for shopping ❤️</p>

    </div>
  `;
};

exports.orderStatusEmail = (order) => {

  let productHTML = "";
  let totalMRP = 0;
  let totalDiscount = 0;

  order.products.forEach(item => {
    let product = item.productId;

    let price = product.price;
    let discount = product.discount || 0;
    let finalPrice = price - discount;

    totalMRP += price * item.quantity;
    totalDiscount += discount * item.quantity;

    productHTML += `
      <div style="display:flex; gap:10px; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
        
        <img src="https://scatch-full-stack-e-commerce-web.onrender.com/product/${product._id}/image" width="60" />

        <div>
          <p style="margin:0;"><b>${product.name}</b></p>
          <p style="margin:0; color:gray;">Qty: ${item.quantity}</p>

          <p style="margin:0;">
            <span style="text-decoration:line-through; color:gray;">₹${price}</span>
            <span style="color:green; margin-left:5px;">₹${finalPrice}</span>
          </p>
        </div>

      </div>
    `;
  });

  return `
    <div style="font-family:Arial, sans-serif; background:#f5f5f5; padding:20px;">
      
      <div style="max-width:600px; margin:auto; background:white; padding:20px; border-radius:10px;">
        
        <h2 style="color:#2874f0;">Scatch Store 🛒</h2>

        <h3>Order Update 📦</h3>

        <p>Hello <b>${order.address.name}</b>,</p>

        <p>Your order <b>${order.orderId}</b> is now:</p>

        <!-- STATUS BADGE -->
        <h2 style="
          background:#e3f2fd;
          display:inline-block;
          padding:8px 15px;
          border-radius:20px;
          color:#1565c0;
        ">
          ${order.status}
        </h2>

        <hr/>

        <!-- PRODUCTS -->
        <h3>🛍 Order Items</h3>
        ${productHTML}

        <hr/>

        <!-- PRICE BREAKDOWN -->
        <h3>💰 Price Details</h3>

        <p>
          Listing Price: 
          <span style="text-decoration:line-through; color:gray;">
            ₹ ${totalMRP}
          </span>
        </p>

        <p style="color:green;">
          Discount: - ₹ ${totalDiscount}
        </p>

        <p>
          Delivery Charges: 
          <span style="color:green;">FREE</span>
        </p>

        <p>
          Platform Fee: ₹ 20
        </p>

        <hr/>

        <p style="font-size:18px;">
          <b>Total Amount: ₹ ${order.total}</b>
        </p>

        <hr/>

        <!-- ADDRESS -->
        <h3>📍 Delivery Address</h3>
        <p style="margin:0;">${order.address.name}</p>
        <p style="margin:0;">${order.address.location}</p>
        <p style="margin:0;">${order.address.pincode}</p>

        <hr/>

        <!-- FOOTER -->
        <p style="font-size:12px; color:gray;">
          Thank you for shopping with Scatch ❤️
        </p>

      </div>

    </div>
  `;
};
