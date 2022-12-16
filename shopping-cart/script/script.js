const path = `https://fakestoreapi.com/products`;
let cartStore = JSON.parse(sessionStorage.getItem("cart")) || [];

function addCartHandler(...data) {
  const [title, image, price] = data;
  const findDup = cartStore.find((item) => item?.title === title);
  if (findDup) {
    findDup.count = findDup.count + 1;
    findDup.total = findDup.total * findDup.count;

    const mapped = cartStore.map((item) =>
      item.id === findDup.id ? findDup : item
    );
    cartStore = mapped;
    sessionStorage.setItem("cart", JSON.stringify(mapped));
    return cartItemsDisplay();
  }

  const pattern = {
    id: Math.floor(Math.random() * 10000000),
    count: 1,
    title,
    image,
    price,
    total: price,
  };

  cartStore.push(pattern);
  sessionStorage.setItem("cart", JSON.stringify(cartStore));
  return cartItemsDisplay();
}

function increaseCount(id) {
  const findCart = cartStore.find((item) => item.id === id);
  if (findCart) {
    findCart.count = findCart.count + 1;
    findCart.total = Number(findCart.total) + Number(findCart.price);

    const mapped = cartStore.map((item) =>
      item.id === findCart.id ? findCart : item
    );
    cartStore = mapped;
    sessionStorage.setItem("cart", JSON.stringify(mapped));
    return cartItemsDisplay();
  }
}

function decreaseCount(id) {
  const findCart = cartStore.find((item) => item.id === id);

  if (findCart && findCart.count <= 1) {
    const filtered = cartStore.filter((item) =>
      item.id !== findCart.id ? item : ""
    );
    cartStore = filtered;
  } else {
    findCart.count = findCart.count - 1;
    findCart.total = Number(findCart.total) - Number(findCart.price);
    const mapped = cartStore.map((item) =>
      item.id === findCart.id ? findCart : item
    );
    cartStore = mapped;
  }
  sessionStorage.setItem("cart", JSON.stringify(cartStore));
  cartItemsDisplay();
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: path,
    success: (response) => {
      let temp = "";
      if (Array.isArray(response) && response.length > 0) {
        response.forEach((item) => {
          temp += `
                 <div class="item">
                   <img src="${item?.image}" alt="${item?.title}">
                   <div class="item-desc">
                   <h5>${
                     item?.title?.length > 35
                       ? item.title.substring(0, 30)
                       : item.title
                   }...</h5>
                   <p>${
                     item.description.length > 90
                       ? item.description.substring(0, 60)
                       : item?.description
                   }..</p>
                   <button onclick="addCartHandler('${item?.title}'  ,'${
            item?.image
          }','${item?.price}')" class="add-cart-btn">
                    <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="{1.5}"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
            Add to cart
                   </button>
                   </div>
                 </div>
              `;
        });
      } else {
        temp = `
            <div class="loading">
             <h2>Loading...</h2>
            </div>
         `;
      }

      $(".items-container").html(temp);
    },
  });

  $("#cart-btn").on("click", function () {
    $(".side-container").addClass("active");
  });

  $(".side-container").on("click", function (e) {
    if (e.target.className.includes("side-container")) {
      $(".side-container").removeClass("active");
    }
  });

  cartItemsDisplay();
});

function cartItemsDisplay() {
  let temp = ``;

  for (let i = 0; i < cartStore.length; i++) {
    temp += `
         <li class="cart-item">
          <div class="cart-img">
           <img src="${cartStore[i].image}" alt="${cartStore[i].title}">
          </div>
          <div class="cart-desc">
           <h4>${cartStore[i].title}</h4>
           <div class="cart-desc-action">
           <button onclick="increaseCount(${
             cartStore[i].id
           })" id="increase">+</button>
           <span>${cartStore[i].count}</span>
           <button onclick="decreaseCount(${
             cartStore[i].id
           })" id="decrease">-</button>
           </div>
           <h5>${formatMoney(cartStore[i].total)}</h5>
          </div>
         </li>
      `;
  }

  $("#items-cart").html(temp);
  $("#cart-count").html(cartStore?.length);
}
