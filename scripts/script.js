//class
class Cart {
  constructor() {
    this.product = {};
    this.price = [];
  }

  emptyCart() {
    this.product = {};
  }

  cartAddandQuantity(item) {

    if (this.product[item.id] === undefined) {
      this.product[item.id] = item;
      this.product[item.id].quantity = 1;
    } else {
      this.product[item.id].quantity++;
    }

  }

  removeItem(item) {
    delete this.product[item.id];
  }

  totalQty() {
    quantity = 0;
    for (let i = 0; i < Object.keys(this.product).length; i++) {
      quantity += this.product[i + 1].quantity;
    }
    return quantity;
  }
}

let cart = new Cart();
$(".table").hide();
$("#checkout").hide()
let data = {};

//product fetch
window.onload = function () {
  fetch("https://fakestoreapi.com/products").
    then(response => response.json()).
    then((json) => {
      data = json;

      data.forEach(productShow);
      let catalog_container = document.getElementById("products"); // assuming your target is <div class='row' id='catalog'>
      jQuery(catalog_container).imagesLoaded(function () {
        let msnry = new Masonry(catalog_container); // this initializes the masonry container AFTER the product images are loaded
      });
    }).then(addCart);
}

//display the items
function productShow(element) {
  let button = $(`.add-to-cart`).length;

  let html =
    `<div class="col-sm-6 col-lg-4 mb-4">
    <div class="card" id = "product${button + 1}">
    <image src = "${element.image}">

    <div class="card-body">
      <h5 class="card-title">${element.title}</h5>
      
      <p class = "price" id = "price${button + 1}">Price: ${element.price} CAD</p>
      <p class="card-text">${element.description}</p>
      <button class = "add-to-cart" id = "button-${button + 1}" onclick= addToCart(${element.id})>Add to Cart</button>
      </div>
  </div>
</div>`
  $(`#products`).append(html);


}

//add-to-cart
function addToCart(id) {
  $("#checkout").show();
  $("#begin").hide();
  $(".table").show();

  for (let item of data) {
    if (item.id === id) {
      cart.cartAddandQuantity(item);
    }
  }
  displayAndRemove();
}
let quantity = 0;
//showing in the cart
function displayAndRemove() {
  let txt = "";
  let txt2 = "";
  let subtotal = 0;
  let shipping_cost = parseInt(cart.totalQty()) * 5;

  for (let item in cart.product) {

    let total = 0;
    quantity += parseInt(cart.product[item].quantity);




    total = (total + cart.product[item].quantity * cart.product[item].price).toFixed(2);
    subtotal = parseFloat(total) + parseFloat(subtotal);
    txt += `<div id = "div${cart.product[item].id}"><tr>
      <td>${cart.product[item].title}</td>
      <td>CA$${(cart.product[item].price).toFixed(2)}</td>
      <td>${cart.product[item].quantity}</td>
      <td>CA$${total} </td>
      <td><button class = "remove" id = "remove-button-${cart.product[item].id}"> <span class="material-symbols-outlined">
      delete
      </span> </button>
      </tr></div>`

    txt2 += `<div><tr>
    <td>${cart.product[item].title}</td>
    <td>CA$${(cart.product[item].price).toFixed(2)}</td>
    <td>${cart.product[item].quantity}</td>
    <td>CA$${total} </td>
    </tr>
    </div>`


  }
  let tax = parseFloat((subtotal * 7) / 100).toFixed(2);
  let order_total = parseFloat(tax) + parseFloat(shipping_cost) + parseFloat(subtotal);
  $("#order-total").html(`<b>Order Total: </b><span class = "subtotal"><b>CA$${parseFloat(order_total).toFixed(2)}</b></span>`);

  $("#body").html(txt);
  $("#body2").html(txt2);
  $("#item").html(`<b>Subtotal: </b><span id = "subtotal">CA$${parseFloat(subtotal).toFixed(2)}</span>`);
  $("#subtotal-final").html(`<b>Subtotal: </b><span class = "subtotal">CA$${parseFloat(subtotal).toFixed(2)}</span>`);
  $("#shipping-cost").html(`<b>Shipping Cost: </b><span class = "subtotal">CA$${parseFloat(shipping_cost).toFixed(2)}</span>`);
  $("#tax").html(`<b>Tax: </b><span class = "subtotal">CA$${parseFloat(tax).toFixed(2)}</span>`);
  if (Object.keys(cart.product).length == 0) {
    $(`.table`).hide();
    $(`#begin`).show();
    $(`#checkout`).hide();
    $(`#item`).hide();
    $("view-cart").val("View Cart");
    click = 0;
  }

  $(".remove").click(function () {
    let buttonID = this.id.slice(14, 16);
    for (let item in cart.product) {
      if (cart.product[item].id == buttonID) {
        $("#view-cart").val(`View Cart (${Object.keys(cart.product).length})`);
        cart.removeItem(cart.product[item]);
        displayAndRemove();
        changeCurrency();
      }
    }
  });
}



let click = 0;

function addCart() {

  let v_cart = document.getElementById("view-cart")
  $(".add-to-cart").click(function () {
    v_cart.value = `View Cart (${Object.keys(cart.product).length})`;
  });

  $("#empty-cart").click(function () {
    click = 0;
    $(".table").hide();
    $("#begin").show();
    $("#body").html("");
    $("#view-cart").val("View Cart");
    $("#checkout").hide();
  });

}

let currency = {};
function currency_convert() {
  fetch("https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/cad.json").
    then(response => response.json()).
    then((json) => {
      currency = json;
      changeCurrency(currency);
    });
};



function changeCurrency() {
  let option = document.getElementById("select");
  let value = select.options[option.selectedIndex].value;

  if (value == "usd") {
    data.forEach(usd_convert);
  } else if (value == "bdt") {
    data.forEach(bdt_convert);
  } else if (value == "cad") {
    data.forEach(cad_convert);
  }
}

let usd_array = [];
let bdt_array = [];
let cad_array = [];
function cad_convert(element) {
  let changed_price = element.price;
  cad_array.push(changed_price);
  for (let i = 0; i < cad_array.length; i++) {
    $(`#price${i + 1}`).html(`Price: ${cad_array[i].toFixed(2)} CAD`);
  }
  displayAndRemove();
  let txt = "";
  let txt2 = "";

  let shipping_cost = parseInt(cart.totalQty()) * 5;
  for (let item in cart.product) {

    let total = 0;


    total = ((total + cart.product[item].quantity * cart.product[item].price)).toFixed(2);

    subtotal = parseFloat(total) + parseFloat(subtotal);
    txt += `<div id = "div${cart.product[item].id}"><tr>
      <td>${cart.product[item].title}</td>
      <td>CA$${((cart.product[item].price)).toFixed(2)}</td>
      <td>${cart.product[item].quantity}</td>
      <td>CA$${total} </td>
      <td><button class = "remove" id = "remove-button-${cart.product[item].id}"> <span class="material-symbols-outlined">
      delete
      </span> </button>
      </tr></div>`

    txt2 += `<div><tr>
      <td>${cart.product[item].title}</td>
      <td>${((cart.product[item].price)).toFixed(2)}</td>
      <td>${cart.product[item].quantity}</td>
      <td>CA$${total} </td>
      </tr>
      </div>`


  }
  let tax = parseFloat((subtotal * 7) / 100).toFixed(2);
  let order_total = parseFloat(tax) + parseFloat(shipping_cost) + parseFloat(subtotal);
  $("#order-total").html(`<b>Order Total: </b><span class = "subtotal"><b>CA$${parseFloat(order_total).toFixed(2)}</b></span>`);

  $("#body").html(txt);
  $("#body2").html(txt2);
  $("#item").html(`<b>Subtotal: </b><span id = "subtotal">CA$${parseFloat(subtotal).toFixed(2)}</span>`);
  $("#subtotal-final").html(`<b>Subtotal: </b><span class = "subtotal">CA$${parseFloat(subtotal).toFixed(2)}</span>`);
  $("#shipping-cost").html(`<b>Shipping Cost: </b><span class = "subtotal">CA$${parseFloat(shipping_cost).toFixed(2)}</span>`);
  $("#tax").html(`<b>Tax: </b><span class = "subtotal">CA$${parseFloat(tax).toFixed(2)}</span>`);
  if (Object.keys(cart.product).length == 0) {
    $(`.table`).hide();
    $(`#begin`).show();
    $(`#checkout`).hide();
    $(`#item`).hide();
  }

  $(".remove").click(function () {
    let buttonID = this.id.slice(14, 16);
    for (let item in cart.product) {
      if (cart.product[item].id == buttonID) {
        $("#view-cart").val(`View Cart (${Object.keys(cart.product).length})`);

        cart.removeItem(cart.product[item]);
        displayAndRemove();
        changeCurrency();
      }
    }
  }


  )

}





function bdt_convert(element) {
  let changed_price = currency.cad.bdt * element.price;
  bdt_array.push(changed_price);
  for (let i = 0; i < bdt_array.length; i++) {
    $(`#price${i + 1}`).html(`Price: ${bdt_array[i].toFixed(2)} BDT`);
  }
  displayAndRemove();
  let txt = "";
  let txt2 = "";
  subtotal = parseFloat(parseInt(cart.totalQty()) * 5 * currency.cad.bdt);

  let shipping_cost = parseFloat(parseInt(cart.totalQty()) * 5 * currency.cad.bdt);

  for (let item in cart.product) {

    let total = 0;


    total = ((total + cart.product[item].quantity * cart.product[item].price) * currency.cad.bdt).toFixed(2);

    subtotal = parseFloat(total) + parseFloat(subtotal);
    txt += `<div id = "div${cart.product[item].id}"><tr>
      <td>${cart.product[item].title}</td>
      <td>&#2547;${((cart.product[item].price) * currency.cad.bdt).toFixed(2)}</td>
      <td>${cart.product[item].quantity}</td>
      <td>&#2547;${total} </td>
      <td><button class = "remove" id = "remove-button-${cart.product[item].id}"> <span class="material-symbols-outlined">
      delete
      </span> </button>
      </tr></div>`

    txt2 += `<div><tr>
      <td>${cart.product[item].title}</td>
      <td>&#2547;${((cart.product[item].price) * currency.cad.bdt).toFixed(2)}</td>
      <td>${cart.product[item].quantity}</td>
      <td>&#2547;${total} </td>
      </tr>
      </div>`


  }
  let tax = parseFloat((subtotal * 7) / 100).toFixed(2);
  let order_total = parseFloat(tax) + parseFloat(shipping_cost) + parseFloat(subtotal);
  $("#order-total").html(`<b>Order Total: </b><span class = "subtotal"><b>&#2547;${parseFloat(order_total).toFixed(2)}</b></span>`);

  $("#body").html(txt);
  $("#body2").html(txt2);
  $("#item").html(`<b>Subtotal: </b><span id = "subtotal">&#2547;${parseFloat(subtotal).toFixed(2)}</span>`);
  $("#subtotal-final").html(`<b>Subtotal: </b><span class = "subtotal">&#2547;${parseFloat(subtotal).toFixed(2)}</span>`);
  $("#shipping-cost").html(`<b>Shipping Cost: </b><span class = "subtotal">&#2547;${parseFloat(shipping_cost).toFixed(2)}</span>`);
  $("#tax").html(`<b>Tax: </b><span class = "subtotal">&#2547;${parseFloat(tax).toFixed(2)}</span>`);
  if (Object.keys(cart.product).length == 0) {
    $(`.table`).hide();
    $(`#begin`).show();
    $(`#checkout`).hide();
    $(`#item`).hide();
  }

  $(".remove").click(function () {
    let buttonID = this.id.slice(14, 16);
    for (let item in cart.product) {
      if (cart.product[item].id == buttonID) {
        $("#view-cart").val(`View Cart (${Object.keys(cart.product).length})`);

        cart.removeItem(cart.product[item]);
        displayAndRemove();
        changeCurrency();
      }
    }
  }


  )

}


function usd_convert(element) {
  let changed_price = currency.cad.usd * element.price;
  usd_array.push(changed_price);
  for (let i = 0; i < usd_array.length; i++) {
    $(`#price${i + 1}`).html(`Price: ${usd_array[i].toFixed(2)} USD`);
  }
  displayAndRemove();
  let txt = "";
  let txt2 = "";
  subtotal = 0;
  let shipping_cost = parseFloat(parseInt(cart.totalQty()) * 5 * currency.cad.usd);
  for (let item in cart.product) {

    let total = 0;


    total = ((total + cart.product[item].quantity * cart.product[item].price) * currency.cad.usd).toFixed(2);
    subtotal = parseFloat(total) + parseFloat(subtotal);

    txt += `<div id = "div${cart.product[item].id}"><tr>
      <td>${cart.product[item].title}</td>
      <td>$${((cart.product[item].price) * currency.cad.usd).toFixed(2)}</td>
      <td>${cart.product[item].quantity}</td>
      <td>$${total} </td>
      <td><button class = "remove" id = "remove-button-${cart.product[item].id}"> <span class="material-symbols-outlined">
      delete
      </span> </button>
      </tr></div>`

    txt2 += `<div><tr>
    <td>${cart.product[item].title}</td>
    <td>$${((cart.product[item].price) * currency.cad.usd).toFixed(2)}</td>
    <td>${cart.product[item].quantity}</td>
    <td>$${total} </td>
    </tr>
    </div>`


  }
  let tax = parseFloat((subtotal * 7) / 100).toFixed(2);
  let order_total = parseFloat(tax) + parseFloat(shipping_cost) + parseFloat(subtotal);

  $("#order-total").html(`<b>Order Total: </b><span class = "subtotal">$${parseFloat(order_total).toFixed(2)}</span>`);

  $("#body").html(txt);
  $("#body2").html(txt2);
  $("#item").html(`<b>Subtotal: </b><span id = "subtotal">$${parseFloat(subtotal).toFixed(2)}</span>`);
  $("#subtotal-final").html(`<b>Subtotal: </b><span class = "subtotal">$${parseFloat(subtotal).toFixed(2)}</span>`);
  $("#shipping-cost").html(`<b>Shipping Cost: </b><span class = "subtotal"><b>$${parseFloat(shipping_cost).toFixed(2)}</b></span>`);
  $("#tax").html(`<b>Tax: </b><span class = "subtotal">$${parseFloat(tax).toFixed(2)}</span>`);
  if (Object.keys(cart.product).length == 0) {
    $(`.table`).hide();
    $(`#begin`).show();
    $(`#checkout`).hide();
    $(`#item`).hide();
  }

  $(".remove").click(function () {
    let buttonID = this.id.slice(14, 16);
    for (let item in cart.product) {
      if (cart.product[item].id == buttonID) {
        $("#view-cart").val(`View Cart (${Object.keys(cart.product).length})`);
        cart.removeItem(cart.product[item]);
        displayAndRemove();
        changeCurrency();
      }
    }
  }


  )

}






set_cookie("shopping_cart_items", cart.product);
let data1 = get_cookie("shopping_cart_items");
jQuery(".add-to-cart").click(function () {
  // get the product id from a data attribute of the button that looks like this:
  // Add To Cart

  var product_id = jQuery(this).attr(id);
  var cart_items = get_cookie("shopping_cart_items"); // get the data stored as a "cookie"

  // initialize the cart items if it returns null
  if (cart_items === null) {
    cart_items = {};
  }

  // make sure the object is defined;
  if (cart_items[product_id] === undefined) {
    cart_items[product_id] = 0;
  }

  cart_items[product_id]++;

  set_cookie("shopping_cart_items", cart.product); // setting the cart items back to the "cookie" storage
});


//checkout

$("#checkout").click(function () {
  $('#myModal').modal('show');
  $("#myTab").addClass("nav-fill");
});



/*tab-show:
var triggerTabList = [].slice.call(document.querySelectorAll('#myTab a'))
triggerTabList.forEach(function (triggerEl) {
  var tabTrigger = new bootstrap.Tab(triggerEl)

  triggerEl.addEventListener('click', function (event) {
    event.preventDefault()
    tabTrigger.show()
  })
})
*/
function shipping_show_hide() {
  if ($("#check").checked == true) {
    $(`#billing-shipping`).hide();
  } else {
    $(`#billing-shipping`).show();
  }
}

$("#confirm-button").click(function(){
  $('#confirmation').modal('show');
  $('#myModal').modal('hide');
  cart.emptyCart();
    $(".table").hide();
    $("#begin").show();
    $("#body").html("");
    $("#view-cart").val("View Cart");
    $("#checkout").hide();
})