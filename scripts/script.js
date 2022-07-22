class Cart {
  constructor() {
    this.product = {};
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


}

let cart = new Cart();
$(".table").hide();
$("#checkout").hide()
var data = {};
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

function productShow(element) {
  let button = $(`.add-to-cart`).length;

  let html =
    `<div class="col-sm-6 col-lg-4 mb-4">
    <div class="card" id = "product${button + 1}">
    <image src = "${element.image}">

    <div class="card-body">
      <h5 class="card-title">${element.title}</h5>
      
      <p class = "price">Price: ${element.price} CAD</p>
      <p class="card-text">${element.description}</p>
      <button class = "add-to-cart" id = "button-${button + 1}" onclick= addToCart(${element.id})>Add to Cart</button>
      </div>
  </div>
</div>`
  $(`#products`).append(html);


}
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

function displayAndRemove() {
  let txt = "";

  for (let item in cart.product) {

    let total = 0;


    total = total + cart.product[item].quantity * cart.product[item].price;
    txt += `<div id = "div${cart.product[item].id}"><tr>
      <td>#${cart.product[item].title}</td>
      <td>${cart.product[item].price}</td>
      <td>${cart.product[item].quantity}</td>
      <td>${total} </td>
      <td><button class = "remove" id = "remove-button-${cart.product[item].id}"> x </button>
      </tr></div>`


  }

  $("#body").html(txt);
  if (Object.keys(cart.product).length == 0) {
    $(`.table`).hide();
    $(`#begin`).show();
    $(`#checkout`).hide();
  }

  $(".remove").click(function () {
    let buttonID = this.id.slice(14, 16);
    for (let item in cart.product) {
      if (cart.product[item].id == buttonID) {
        cart.removeItem(cart.product[item]);
        let v_cart_val = $("#view-cart").val();
        let value = v_cart_val.slice(10, 11);
        console.log(value);
        displayAndRemove();
      }
    }
  }


  )

}





function addCart() {
  let click = 0;
  let v_cart = document.getElementById("view-cart")
  $(".add-to-cart").click(function () {

    click = click + 1;
    v_cart.value = `View Cart(${click})`;
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





let items = {};
set_cookie("shopping_cart_items", items);
let data1 = get_cookie("shopping_cart_items");
jQuery(".add-to-cart-button").click(function () {
  // get the product id from a data attribute of the button that looks like this:
  // Add To Cart

  var product_id = jQuery(this).attr("data-id");
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

  set_cookie("shopping_cart_items", cart_items); // setting the cart items back to the "cookie" storage
});







