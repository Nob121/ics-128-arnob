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
}

let cart = new Cart();
$(".table").hide();
$("#checkout").hide();
$("#empty-cart").hide();
$("#myModal").find("#continue-button-2").hide();
$("#myModal").find("#continue-button-3").hide();
$("#myModal").find("#confirm-button").hide();
let data = {};

//product fetch





window.onload = function () {
  fetch("https://fakestoreapi.com/products").
    then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error("Something went wrong");
    }).then((json) => {
      data = json;

      data.forEach(productShow);
      let catalog_container = document.getElementById("products"); // assuming your target is <div class='row' id='catalog'>
      jQuery(catalog_container).imagesLoaded(function () {
        let msnry = new Masonry(catalog_container); // this initializes the masonry container AFTER the product images are loaded
      });
    })
    .catch((error) => {
      fetch("https://deepblue.camosun.bc.ca/~c0180354/ics128/final/fakestoreapi.json").
        then((response) => {
          if (response.status === 200) {
            return response.json();
          }
          throw new Error("Something went wrong");
        }).then((json) => {
          data = json;

          data.forEach(productShow);
          let catalog_container = document.getElementById("products"); // assuming your target is <div class='row' id='catalog'>
          jQuery(catalog_container).imagesLoaded(function () {
            let msnry = new Masonry(catalog_container); // this initializes the masonry container AFTER the product images are loaded
          });
        })
    }).then(addCart).
    then(cookies).
    catch((error) => {
      $("#products").html(`Sorry Something went wrong. Please try again`);
    });
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

function totalQty() {
  quantity = 0;
  for (let i = 0; i < data.length; i++) {
    if (cart.product[i + 1] === undefined) {
      continue;
    }
    quantity += cart.product[i + 1].quantity;
  }
  return quantity;
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
  let shipping_cost = parseInt(totalQty()) * 5;

  for (let item in cart.product) {

    let total = 0;




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
  $("#shipping-cost").html(`<b>Shipping Cost: </b><span class = "subtotal" id = "shipping_cost">CA$${parseFloat(shipping_cost).toFixed(2)}</span>`);
  $("#tax").html(`<b>Tax: </b><span class = "subtotal" id = "tax">CA$${parseFloat(tax).toFixed(2)}</span>`);
  if (Object.keys(cart.product).length == 0) {
    $("#empty-cart").hide();
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

        cart.removeItem(cart.product[item]);
        displayAndRemove();
        changeCurrency();
      }
    }
    $("#view-cart").val(`View Cart (${totalQty()})`);
    if (totalQty() == 0) {
      $("#view-cart").val(`View Cart`);
    }
  });
}



let click = 0;

function addCart() {

  let v_cart = document.getElementById("view-cart");
  $(".add-to-cart").click(function () {
    $(`#item`).show();
    $("#empty-cart").show();
    v_cart.value = `View Cart (${totalQty()})`;
    $("#order-cart").modal('show');
    setTimeout(modalHide, 800);
    function modalHide() {
      $("#order-cart").modal('hide');
    }
    changeCurrency();
    let option1 = document.getElementById("select");
    let value1 = select.options[option1.selectedIndex].value;

    if (value1 == "usd") {
      for (let item in cart.product) {

        let total = 0;

        total = ((total + cart.product[item].quantity * cart.product[item].price) * currency.cad.usd).toFixed(2);


        subtotal = parseFloat(total) + parseFloat(subtotal);
        txt += `<div id = "div${cart.product[item].id}"><tr>
          <td>${cart.product[item].title}</td>
          <td>CA$${((cart.product[item].price)).toFixed(2)}</td>
          <td>${cart.product[item].quantity}</td>
          <td>CA$${total} </td>
          <td><button class = "remove" id = "remove-button-${cart.product[item].id}"> <span class="material-symbols-outlined">
          delete
          </span> </button>
          </tr></div>`;
      }
    }
    if (value1 == "bdt") {
      for (let item in cart.product) {

        let total = 0;

        total = ((total + cart.product[item].quantity * cart.product[item].price) * currency.cad.bdt).toFixed(2);
        subtotal = parseFloat(total) + parseFloat(subtotal);
        txt += `<div id = "div${cart.product[item].id}"><tr>
        <td>${cart.product[item].title}</td>
        <td>CA$${((cart.product[item].price)).toFixed(2)}</td>
        <td>${cart.product[item].quantity}</td>
        <td>CA$${total} </td>
        <td><button class = "remove" id = "remove-button-${cart.product[item].id}"> <span class="material-symbols-outlined">
        delete
        </span> </button>
        </tr></div>`;
      }
    }
  });

  $("#empty-cart").click(function () {
    click = 0;
    $(".table").hide();
    $("#begin").show();
    $("#body").html("");
    $("#view-cart").val("View Cart");
    $("#checkout").hide();
    $("#empty-cart").hide();
    $("#item").hide();
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
  let subtotal = 0;

  let shipping_cost = parseInt(totalQty()) * 5;
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
    $("#empty-cart").hide();
  }

  $(".remove").click(function () {
    let buttonID = this.id.slice(14, 16);
    for (let item in cart.product) {
      if (cart.product[item].id == buttonID) {
        cart.removeItem(cart.product[item]);
        displayAndRemove();
        changeCurrency();
      }
    }
    $("#view-cart").val(`View Cart (${totalQty()})`);
    if (totalQty() == 0) {
      $("#view-cart").val(`View Cart`);
    }
  })
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
  subtotal = parseFloat(parseInt(totalQty()) * 5 * currency.cad.bdt);

  let shipping_cost = parseFloat(parseInt(totalQty()) * 5 * currency.cad.bdt);

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
    $("#empty-cart").hide();
  }

  $(".remove").click(function () {
    let buttonID = this.id.slice(14, 16);
    for (let item in cart.product) {
      if (cart.product[item].id == buttonID) {
        //$("#view-cart").val(`View Cart (${totalQty()})`);

        cart.removeItem(cart.product[item]);
        displayAndRemove();
        changeCurrency();
      }
    }
    $("#view-cart").val(`View Cart (${totalQty()})`);
    if (totalQty() == 0) {
      $("#view-cart").val(`View Cart`);
    }
  })
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
  let shipping_cost = parseFloat(parseInt(totalQty()) * 5 * currency.cad.usd);
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
  $("#shipping-cost").html(`<b>Shipping Cost: </b><span class = "subtotal">$${parseFloat(shipping_cost).toFixed(2)}</span>`);
  $("#tax").html(`<b>Tax: </b><span class = "subtotal">$${parseFloat(tax).toFixed(2)}</span>`);
  if (Object.keys(cart.product).length == 0) {
    $(`.table`).hide();
    $(`#begin`).show();
    $(`#checkout`).hide();
    $(`#item`).hide();
    $("#empty-cart").hide();
  }

  $(".remove").click(function () {
    let buttonID = this.id.slice(14, 16);
    for (let item in cart.product) {
      if (cart.product[item].id == buttonID) {
        //$("#view-cart").val(`View Cart (${totalQty()})`);
        cart.removeItem(cart.product[item]);
        displayAndRemove();
        changeCurrency();
      }
    }
    $("#view-cart").val(`View Cart (${totalQty()})`);
    if (totalQty() == 0) {
      $("#view-cart").val(`View Cart`);
    }
  }


  )

}





function cookies() {
  set_cookie("shopping_cart_items", cart.product);
  let data1 = get_cookie("shopping_cart_items");
  jQuery(".add-to-cart").click(function () {
    // get the product id from a data attribute of the button that looks like this:
    // Add To Cart

    var product_id = jQuery(this).attr("id");
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
    displayAndRemove();
  });
}


//checkout

$("#checkout").click(function () {
  $('#myModal').modal('show');
});






/*const searchInput = document.querySelector('.search-input');
const suggestions = document.querySelector('.suggestions');
 
searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);
*/




$("#continue-button-1").click(function (event) {
  //prevent from submitting
  event.preventDefault();
  //keeo track of validity
  let visaRegEx = /^4[0-9]{12}(?:[0-9]{3})?$/;
  var mastercardRegEx = /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/;
  var amexpRegEx = /^3[47][0-9]{13}$/;
  let value = $("#card-num").val();
  let validity = true;

  //card number
  if ($("#card-num").val() == "") {
    $("#card-num").addClass("is-invalid");
    $("#card-num").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip("#card-num", {
      title: "Card-number cannot be blank"
    });
    validity = false;
  } else if (($('input[name="paymentMethod"]:checked').val() == "visa") && ((value).match(visaRegEx))) {
    $("#card-num").addClass("is-valid");
    $("#card-num").removeClass("is-invalid");
    if ($("#card-num").tooltip != undefined) {
      $("#card-num").tooltip("dispose");
    }
  } else if (($('input[name="paymentMethod"]:checked').val() == "mastercard") && ($("#card-num").val()).match(mastercardRegEx)) {
    $("#card-num").addClass("is-valid");
    $("#card-num").removeClass("is-invalid");
    if ($("#card-num").tooltip != undefined) {
      $("#card-num").tooltip("dispose");
    }
  } else if (($('input[name="paymentMethod"]:checked').val() == "AEX") && ($("#card-num").val()).match(amexpRegEx)) {
    $("#card-num").addClass("is-valid");
    $("#card-num").removeClass("is-invalid");
    if ($("#card-num").tooltip != undefined) {
      $("#card-num").tooltip("dispose");
    }
  } else {
    $("#card-num").removeClass("is-valid");
    $("#card-num").addClass("is-invalid");
    let tooltip = new bootstrap.Tooltip("#card-num", {
      title: "Invalid Card Number"
    });
    validity = false;
  }

  //mm

  let mm_regex = /^[0-9]{2}$/;
  if ($("#mm").val() == "") {
    $("#mm").addClass("is-invalid");
    $("#mm").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip("#mm", {
      title: "Month cannot be blank"
    });
    validity = false;
  } else if (($("#mm").val()).match(mm_regex) && ((parseInt($("#mm").val()) < 13) && (parseInt($("#mm").val()) > 0))) {
    $("#mm").addClass("is-valid");
    $("#mm").removeClass("is-invalid");
    if ($("#mm").tooltip != undefined) {
      $("#mm").tooltip("dispose");
    }
  } else {
    $("#mm").addClass("is-invalid");
    $("#mm").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip("#mm", {
      title: "Invalid Month"
    });
    validity = false;

  }

  //yy

  if ($("#yy").val() == "") {
    $("#yy").addClass("is-invalid");
    $("#yy").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip("#yy", {
      title: "Year cannot be blank"
    });
    validity = false;
  } else if (($("#yy").val()).match(mm_regex)) {
    $("#yy").addClass("is-valid");
    $("#yy").removeClass("is-invalid");
    if ($("#yy").tooltip != undefined) {
      $("#yy").tooltip("dispose");
    }
  }
  let year = "20" + $("#yy").val();
  let created_date = new Date(parseInt(year), ($("#mm").val() - 1));
  let current_date = new Date();

  //Date Validation

  if (created_date.getTime() < current_date.getTime()) {
    $("#mm").addClass("is-invalid");
    $("#mm").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip("#mm", {
      title: "Invalid Date"
    });
    validity = false;
    $("#yy").addClass("is-invalid");
    $("#yy").removeClass("is-valid");
    let tooltip1 = new bootstrap.Tooltip("#yy", {
      title: "Invalid Date"
    });
    validity = false;
  }

  //CVV

  let cvv_vi_mc = /^[0-9]{3}$/;
  let cvv_amex = /^[0-9]{4}$/;
  if ($("#cvv").val() == "") {
    $("#cvv").addClass("is-invalid");
    $("#cvv").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip("#cvv", {
      title: "CVV cannot be blank"
    });
    validity = false;
  } else if ((($('input[name="paymentMethod"]:checked').val() == "visa") || ($('input[name="paymentMethod"]:checked').val() == "mastercard")) && ($("#cvv").val()).match(cvv_vi_mc)) {
    $("#cvv").addClass("is-valid");
    $("#cvv").removeClass("is-invalid");
    if ($("#cvv").tooltip != undefined) {
      $("#cvv").tooltip("dispose");
    }
  }
  else if (($('input[name="paymentMethod"]:checked').val() == "AEX") && ($("#cvv").val()).match(cvv_amex)) {
    $("#cvv").addClass("is-valid");
    $("#cvv").removeClass("is-invalid");
    if ($("#cvv").tooltip != undefined) {
      $("#cvv").tooltip("dispose");
    }
  }
  else {
    $("#cvv").removeClass("is-valid");
    $("#cvv").addClass("is-invalid");
    let tooltip = new bootstrap.Tooltip("#cvv", {
      title: "Invalid CVV"
    });
    validity = false;
  }
  if (validity == true) {
    $("#billing-details").trigger('click');
    $("#continue-button-1").hide();
    $("#continue-button-2").show();

  }

}

);


$("#continue-button-2").click(function (event) {
  /**/
  event.preventDefault();
  let validity = true;
  let name = /^[a-z ,.'-]+$/i;

  if ($("#firstName").val() == "") {
    $("#firstName").addClass("is-invalid");
    $("#firstName").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#firstName', {
      title: "First Name cannot be blank"
    });
    validity = false;
  } else if (($("#firstName").val()).match(name)) {
    $("#firstName").removeClass("is-invalid");
    $("#firstName").addClass("is-valid");
    if ($("#firstName").tooltip != undefined) {
      $("firstName").tooltip("dispose");
    }
  } else {
    $("#firstName").addClass("is-invalid");
    $("#firstName").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#firstName', {
      title: "Invalid First Name"
    });
    validity = false;
  }
  //lastname
  if ($("#lastName").val() == "") {
    $("#lastName").addClass("is-invalid");
    $("#lastName").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#lastName', {
      title: "Last Name cannot be blank"
    });
    validity = false;
  } else if (($("#lastName").val()).match(name)) {
    $("#lastName").removeClass("is-invalid");
    $("#lastName").addClass("is-valid");
    if ($("#lastName").tooltip != undefined) {
      $("lastName").tooltip("dispose");
    }
  } else {
    $("#lastName").addClass("is-invalid");
    $("#lastName").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#lastName', {
      title: "Invalid Last Name"
    });
    validity = false;
  }
  //email

  let mail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if ($("#email").val() == "") {
    $("#email").addClass("is-invalid");
    $("#email").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#email', {
      title: "Email cannot be blank"
    });
    validity = false;
  } else if (($("#email").val()).match(mail)) {
    $("#email").removeClass("is-invalid");
    $("#email").addClass("is-valid");
    if ($("#email").tooltip != undefined) {
      $("email").tooltip("dispose");
    }
  } else {
    $("#email").addClass("is-invalid");
    $("#email").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#email', {
      title: "Invalid Email"
    });
    validity = false;
  }

  let phone_regex = /^[2-9]{1}[0-9]{2}[-\s]?[2-9]{1}[0-9]{2}[-\s]?[0-9]{4}[\s]?[\s]?$/;
  let input = $("#phone").val();

  if (input == "") {
    $("#phone").addClass("is-invalid");
    $("#phone").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#phone', {
      title: "Phone Number cannot be blank"
    });
    validity = false;
  } else if (input[0] == 0 || input[0] == 1) {
    $("#phone").addClass("is-invalid");
    $("#phone").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#phone', {
      title: "Invalid Phone Number: Can't start with 0 or 1"
    });
    validity = false;
  } else if (input[1] == input[2]) {
    $("#phone").addClass("is-invalid");
    $("#phone").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#phone', {
      title: "Invalid Phone Number: Area Code doesn't exist"
    });
    validity = false;
  } else if ((input[3] === " " && (input[5] == input[6])) || (input[3] == "-" && (input[5] == input[6])) || (input[4] == input[5])) {
    $("#phone").addClass("is-invalid");
    $("#phone").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#phone', {
      title: "Invalid Phone Number: Prefix Code doesn't exist"
    });
    validity = false;
  } else if ((input[3] === " " && (input[4] == 0 || input[4] == 1)) || (input[3] == "-" && (input[4] == 0 || input[4] == 1)) || (input[3] == 0 || input[3] == 1)) {
    $("#phone").addClass("is-invalid");
    $("#phone").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#phone', {
      title: "Invalid Phone Number: Prefix Code doesn't start with 0 or 1"
    });
    validity = false;
  } else if (input.match(phone_regex)) {
    $("#phone").removeClass("is-invalid");
    $("#phone").addClass("is-valid");
    if ($("#phone").tooltip != undefined) {
      $("phone").tooltip("dispose");
    }
  } else if (!(input.match(phone_regex))) {
    $("#phone").addClass("is-invalid");
    $("#phone").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#phone', {
      title: "Invalid Phone Number: Please use the following format (xxx xxx xxxx / xxxxxxxxxx /xxx-xxx-xxxx)"
    });
    validity = false;
  }
  else {
    $("#phone").addClass("is-invalid");
    $("#phone").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#phone', {
      title: "Invalid Phone Number"
    });
    validity = false;
  }

  //address
  let address_regex = /^[a-zA-Z0-9\s,'-]*$/;
  if ($("#address").val() == "") {
    $("#address").addClass("is-invalid");
    $("#address").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#address', {
      title: "Address cannot be blank"
    });
    validity = false;
  } else if (($("#address").val()).match(address_regex)) {
    $("#address").removeClass("is-invalid");
    $("#address").addClass("is-valid");
    if ($("#address").tooltip != undefined) {
      $("address").tooltip("dispose");
    }
  } else {
    $("#address").addClass("is-invalid");
    $("#address").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#address', {
      title: "Invalid Address"
    });
    validity = false;
  }

  //address 2
  if ($("#address2").val() == "") {
    $("#address2").addClass("is-valid");
    $("#address2").removeClass("is-invalid");
    if ($("#address2").tooltip != undefined) {
      $("address2").tooltip("dispose");
    }
  } else if (($("#address2").val()).match(address_regex)) {
    $("#address2").removeClass("is-invalid");
    $("#address2").addClass("is-valid");
    if ($("#address2").tooltip != undefined) {
      $("address2").tooltip("dispose");
    }
  } else {
    $("#address2").addClass("is-invalid");
    $("#address2").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#address2', {
      title: "Invalid Address"
    });
    validity = false;
  }
  //country
  if ($("#country").val() == "") {
    $("#country").addClass("is-invalid");
    $("#country").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#country', {
      title: "Country Name cannot be blank"
    });
    validity = false;
  } else if (($("#country").val()).match(name)) {
    $("#country").removeClass("is-invalid");
    $("#country").addClass("is-valid");
    if ($("#country").tooltip != undefined) {
      $("country").tooltip("dispose");
    }
  } else {
    $("#country").addClass("is-invalid");
    $("#country").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#country', {
      title: "Invalid Country Name"
    });
    validity = false;
  }
//city
  if ($("#city").val() == "") {
    $("#city").addClass("is-invalid");
    $("#city").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#city', {
      title: "City Name cannot be blank"
    });
    validity = false;
  } else if (($("#city").val()).match(name)) {
    $("#city").removeClass("is-invalid");
    $("#city").addClass("is-valid");
    if ($("#city").tooltip != undefined) {
      $("#city").tooltip("dispose");
    }
  } else {
    $("#city").addClass("is-invalid");
    $("#city").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#city', {
      title: "Invalid City Name"
    });
    validity = false;
  }
  //state
  if ($("#state").val() == "") {
    $("#state").addClass("is-invalid");
    $("#state").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#state', {
      title: "State Name cannot be blank"
    });
    validity = false;
  } else if (($("#state").val()).match(name)) {
    $("#state").removeClass("is-invalid");
    $("#state").addClass("is-valid");
    if ($("#state").tooltip != undefined) {
      $("state").tooltip("dispose");
    }
  } else {
    $("#state").addClass("is-invalid");
    $("#state").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#state', {
      title: "Invalid State Name"
    });
    validity = false;
  }

  //zip
  let zip = $("#zip").val();
  let validation = /^[ABCEGHJ-NPRSTVXY][0-9]{1}[ABCEGHJ-NPRSTV-Z][\s]?[0-9]{1}[ABCEGHJ-NPRSTV-Z][0-9]{1}$/i;
  let invalid = /[DFIOQUWZ]/i;//these letters are not allowed in first letter
  let invalid1 = /[DFIOQU]/i;//these letters are not allowed in second and third letter
  if ($("#zip").val() == "") {
    $("#zip").addClass("is-invalid");
    $("#zip").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#zip', {
      title: "Zip Code cannot be blank"
    });
    validity = false;
  } else if (zip.match(validation)) {
    $("#zip").removeClass("is-invalid");
    $("#zip").addClass("is-valid");
    if ($("#zip").tooltip != undefined) {
      $("#zip").tooltip("dispose");
    }
  } else if (zip[0].match(invalid) || zip[2].match(invalid1) || zip[4].match(invalid1)) {
    $("#zip").addClass("is-invalid");
    $("#zip").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#zip', {
      title: "Invalid Postal Code: Doesn't meet the correct letters"
    });
    validity = false;
  } else {
    $("#zip").addClass("is-invalid");
    $("#zip").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#zip', {
      title: "Invalid Postal Code: Doesn't meet the correct format (ANANAN / ANA NAN)"
    });
    validity = false;
  }
  if (validity == true) {
    $("#myModal").find("#continue-button-2").hide();
    $("#myModal").find("#continue-button-3").show();
  }

})

$('#shipping_billing_same').change(function () {
  if (!$(this).is(':checked')) {
    $("#myModal").find(`#billing-shipping`).show();
  } else {
    $("#myModal").find(`#billing-shipping`).hide();
    let fname = $(`#firstName`).val();
    let lname = $(`#lastName`).val();
    let ad1 = $(`#address`).val();
    let ad2 = $(`#address2`).val();
    let country = $(`#country`).val();
    let city = $(`#city`).val();
    let zipShip = $(`#zip`).val();
    let state = $(`#state`).val();
    document.getElementById("firstName_ship").value = fname;
    document.getElementById("lastName_ship").value = lname;
    document.getElementById("address_ship").value = ad1;
    document.getElementById("address2_ship").value = ad2;
    document.getElementById("country_ship").value = country;
    document.getElementById("city_ship").value = city;
    document.getElementById("state_ship").value = state;
    document.getElementById("zip_ship").value = zipShip;

  }
});

$("#continue-button-3").click(function (event) {
  event.preventDefault();
  let validity = true;
  let name = /^[a-z ,.'-]+$/i;
  if ($("#firstName_ship").val() == "") {
    $("#firstName_ship").addClass("is-invalid");
    $("#firstName_ship").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#firstName_ship', {
      title: "First Name cannot be blank"
    });
    validity = false;
  } else if (($("#firstName_ship").val()).match(name)) {
    $("#firstName_ship").removeClass("is-invalid");
    $("#firstName_ship").addClass("is-valid");
    if ($("#firstName_ship").tooltip != undefined) {
      $("firstName_ship").tooltip("dispose");
    }
  } else {
    $("#firstName_ship").addClass("is-invalid");
    $("#firstName_ship").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#firstName_ship', {
      title: "Invalid First Name"
    });
    validity = false;
  }
  //lastname
  if ($("#lastName_ship").val() == "") {
    $("#lastName_ship").addClass("is-invalid");
    $("#lastName_ship").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#lastName_ship', {
      title: "Last Name cannot be blank"
    });
    validity = false;
  } else if (($("#lastName_ship").val()).match(name)) {
    $("#lastName_ship").removeClass("is-invalid");
    $("#lastName_ship").addClass("is-valid");
    if ($("#lastName_ship").tooltip != undefined) {
      $("lastName_ship").tooltip("dispose");
    }
  } else {
    $("#lastName_ship").addClass("is-invalid");
    $("#lastName_ship").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#lastName_ship', {
      title: "Invalid Last Name"
    });
    validity = false;
  } let address_regex = /^[a-zA-Z0-9\s,'-]*$/;

  if ($("#address_ship").val() == "") {
    $("#address_ship").addClass("is-invalid");
    $("#address_ship").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#address_ship', {
      title: "Address cannot be blank"
    });
    validity = false;
  } else if (($("#address_ship").val()).match(address_regex)) {
    $("#address_ship").removeClass("is-invalid");
    $("#address_ship").addClass("is-valid");
    if ($("#address_ship").tooltip != undefined) {
      $("address_ship").tooltip("dispose");
    }
  } else {
    $("#address_ship").addClass("is-invalid");
    $("#address_ship").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#address_ship', {
      title: "Invalid Address"
    });
    validity = false;
  }

  //address 2
  if ($("#address2_ship").val() == "") {
    $("#address2_ship").addClass("is-valid");
    $("#address2_ship").removeClass("is-invalid");
    if ($("#address2_ship").tooltip != undefined) {
      $("address2_ship").tooltip("dispose");
    }
  } else if (($("#address2_ship").val()).match(address_regex)) {
    $("#address2_ship").removeClass("is-invalid");
    $("#address2_ship").addClass("is-valid");
    if ($("#address2_ship").tooltip != undefined) {
      $("address2_ship").tooltip("dispose");
    }
  } else {
    $("#address2_ship").addClass("is-invalid");
    $("#address2_ship").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#address2_ship', {
      title: "Invalid Address"
    });
    validity = false;
  }
  //country
  if ($("#country_ship").val() == "") {
    $("#country_ship").addClass("is-invalid");
    $("#country_ship").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#country_ship', {
      title: "Country Name cannot be blank"
    });
    validity = false;
  } else if (($("#country_ship").val()).match(name)) {
    $("#country_ship").removeClass("is-invalid");
    $("#country_ship").addClass("is-valid");
    if ($("#country_ship").tooltip != undefined) {
      $("#country_ship").tooltip("dispose");
    }
  } else {
    $("#country_ship").addClass("is-invalid");
    $("#country_ship").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#country_ship', {
      title: "Invalid Country Name"
    });
    validity = false;
  }

  if ($("#city_ship").val() == "") {
    $("#city_ship").addClass("is-invalid");
    $("#city_ship").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#city_ship', {
      title: "City Name cannot be blank"
    });
    validity = false;
  } else if (($("#city_ship").val()).match(name)) {
    $("#city_ship").removeClass("is-invalid");
    $("#city_ship").addClass("is-valid");
    if ($("#city_ship").tooltip != undefined) {
      $("#city_ship").tooltip("dispose");
    }
  } else {
    $("#city_ship").addClass("is-invalid");
    $("#city_ship").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#city_ship', {
      title: "Invalid City Name"
    });
    validity = false;
  }

  //state
  if ($("#state_ship").val() == "") {
    $("#state_ship").addClass("is-invalid");
    $("#state_ship").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#state_ship', {
      title: "State Name cannot be blank"
    });
    validity = false;
  } else if (($("#state_ship").val()).match(name)) {
    $("#state_ship").removeClass("is-invalid");
    $("#state_ship").addClass("is-valid");
    if ($("#state_ship").tooltip != undefined) {
      $("state_ship").tooltip("dispose");
    }
  } else {
    $("#state_ship").addClass("is-invalid");
    $("#state_ship").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#state_ship', {
      title: "Invalid State Name"
    });
    validity = false;
  }

  //zip
  let zip = $("#zip_ship").val();
  let validation = /^[ABCEGHJ-NPRSTVXY][0-9]{1}[ABCEGHJ-NPRSTV-Z][\s]?[0-9]{1}[ABCEGHJ-NPRSTV-Z][0-9]{1}$/i;
  let invalid = /[DFIOQUWZ]/i;//these letters are not allowed in first letter
  let invalid1 = /[DFIOQU]/i;//these letters are not allowed in second and third letter
  if ($("#zip_ship").val() == "") {
    $("#zip_ship").addClass("is-invalid");
    $("#zip_ship").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#zip_ship', {
      title: "Zip Code cannot be blank"
    });
    validity = false;
  } else if (zip.match(validation)) {
    $("#zip_ship").removeClass("is-invalid");
    $("#zip_ship").addClass("is-valid");
    if ($("#zip_ship").tooltip != undefined) {
      $("zip_ship").tooltip("dispose");
    }
  } else if (zip[0].match(invalid) || zip[2].match(invalid1) || zip[4].match(invalid1)) {
    $("#zip_ship").addClass("is-invalid");
    $("#zip_ship").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#zip_ship', {
      title: "Invalid Postal Code: Doesn't meet the correct letters"
    });
    validity = false;
  } else {
    $("#zip_ship").addClass("is-invalid");
    $("#zip_ship").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#zip_ship', {
      title: "Invalid Postal Code: Doesn't meet the correct format (ANANAN / ANA NAN)"
    });
    validity = false;
  }

  if (validity == true) {
    $("#myModal").find("#continue-button-3").hide();
    $("#myModal").find("#confirm-button").show();
  }

})


/*$("#myModal").find("#continue-button-1").hide();
$("#myModal").find("#continue-button-2").show();*/

function autocomplete_form() {
  let num;
  let text;
  let data = {};
  let html1 = "";
  let address_array = [];
  let splited = $("#address").val().split(" ");
  num = splited[0];
  text = splited[1];
  fetch(`https://geocoder.ca/?autocomplete=1&geoit=xml&auth=test&json=1&locate=${num}%20${text}`).
    then(response => response.json()).
    then((json) => {
      data = json;
      //console.log(data.streets.street);
      //console.log(typeof (data.streets.street))
      if (typeof (data.streets.street) == "object") {
        for (let i = 0; i < Object.keys(data.streets.street).length; i++) {
          address_array.push(data.streets.street[i]);
        }
        for (let i = 0; i < 3; i++) {
          //console.log(address_array[i]);
          html1 += `<option id = "option${i}">${address_array[i]}</option>`
        }

        //console.log(address_array);
      } if (typeof (data.streets.street) == "string") {
        //console.log(data.streets.street);
        html1 = `<option id = "option1">${data.streets.street}</option>`
      }



      $(`#street_suggest`).append(html1);

      let selectedText = $("#address").val();

      let division = selectedText.split(", ");
      console.log(division);

      if (division[3] != undefined) {
        document.getElementById("address").value = division[0];
        document.getElementById("city").value = division[1];
        document.getElementById("state").value = division[2];
        document.getElementById("zip").value = division[3];
        document.getElementById("country").value = "Canada";
      }





    })
  html1 = "";
  $(`#street_suggest`).empty();
  address_array = [];

}

function autocomplete_form_ship() {
  let num;
  let text;
  let data = {};
  let html1 = "";
  let address_array = [];
  let splited = $("#address_ship").val().split(" ");
  num = splited[0];
  text = splited[1];
  fetch(`https://geocoder.ca/?autocomplete=1&geoit=xml&auth=test&json=1&locate=${num}%20${text}`).
    then(response => response.json()).
    then((json) => {
      data = json;
      //console.log(data.streets.street);
      //console.log(typeof (data.streets.street))
      if (typeof (data.streets.street) == "object") {
        for (let i = 0; i < Object.keys(data.streets.street).length; i++) {
          address_array.push(data.streets.street[i]);
        }
        for (let i = 0; i < 3; i++) {
          //console.log(address_array[i]);
          html1 += `<option id = "option${i}">${address_array[i]}</option>`
        }

        //console.log(address_array);
      } if (typeof (data.streets.street) == "string") {
        //console.log(data.streets.street);
        html1 = `<option id = "option1">${data.streets.street}</option>`
      }



      $(`#street_suggest_ship`).append(html1);

      let selectedText = $("#address_ship").val();

      let division = selectedText.split(", ");
      console.log(division);

      if (division[3] != undefined) {
        document.getElementById("address_ship").value = division[0];
        document.getElementById("city_ship").value = division[1];
        document.getElementById("state_ship").value = division[2];
        document.getElementById("zip_ship").value = division[3];
        document.getElementById("country_ship").value = "Canada";
      }





    })
  html1 = "";
  $(`#street_suggest_ship`).empty();
  address_array = [];

}






$("#confirm-button").click(function () {
  final_json();
});

function final_json() {
  let data = {};
  let items = cart.product;
  let final_json_send = {
    "card_number": $(`#card-num`).val(),
    "expiry_month": $(`#mm`).val(),
    "expiry_year": "20" + $(`#yy`).val(),
    "security_code": $(`#cvv`).val(),
    "amount": $(`#mm`).val(),
    "taxes": $("#tax").val(),
    "shipping_amount": $("#shipping_cost").val(),
    "currency": $(`#select`).val(),
    "items": items,
    "billing": {
      "first_name": $(`#firstName`).val(),
      "last_name": $(`#lastName`).val(),
      "address_1": $(`#address`).val(),
      "address_2": $(`#address2`).val(),
      "city": $(`#city`).val(),
      "province": $(`#state`).val(),
      "country": $(`#country`).val(),
      "postal": $(`#zip`).val(),
      "phone": $(`#phone`).val(),
      "email": $(`#email`).val()
    },
    "shipping": {
      "first_name": $(`#firstName_ship`).val(),
      "last_name": $(`#lastName_ship`).val(),
      "address_1": $(`#address_ship`).val(),
      "address_2": $(`#address2_ship`).val(),
      "city": $(`#city_ship`).val(),
      "province": $(`#state_ship`).val(),
      "country": $(`#country_ship`).val(),
      "postal": $(`#zip_ship`).val()
    }


  }
  console.log(JSON.stringify(final_json_send.items));
  let formdata = new FormData();
  formdata.append('submission', JSON.stringify(final_json_send));
  let response = fetch('https://deepblue.camosun.bc.ca/~c0180354/ics128/final/', {
    method: 'POST',
    body: formdata
  }).then(response => response.json()).
    then((json) => {
      data = json;
      console.log(data);
      console.log(data.status);
      if (data.status == "NOT SUBMITTED") {
        post_validation(data);
      } else {
        $('#confirmation').modal('show');
        $('#myModal').modal('hide');
        cart.emptyCart();
        $("#empty-cart").hide();
        $(".table").hide();
        $("#begin").show();
        $("#body").html("");
        $("#view-cart").val("View Cart");
        $("#checkout").hide();
        $("#item").hide();
      }
    })
}

function post_validation(data) {
  if (data.error.card_number != undefined) {
    $("#card-num").addClass("is-invalid");
    $("#card-num").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip("#card-num", {
      title: `${data.error.card_number}`
    });
  }
  if(data.error.expiry_year != undefined){
    $("#yy").addClass("is-invalid");
    $("#yy").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip("#yy", {
      title: `${data.error.expiry_year}`
    });
  }
  if(data.error.expiry_month != undefined){
    $("#mm").addClass("is-invalid");
    $("#mm").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip("#mm", {
      title: `${data.error.expiry_month}`
    });
  }
  if(data.error.security_code != undefined){
    $("#cvv").addClass("is-invalid");
    $("#cvv").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip("#cvv", {
      title: `${data.error.security_code}`
    });
  }
  if(data.error.billing.first_name != undefined){
    $("#firstName").addClass("is-invalid");
    $("#firstName").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip("#firstName", {
      title: `${data.error.billing.first_name}`
    });
  }
  if(data.error.billing.last_name != undefined){
    $("#lastName").addClass("is-invalid");
    $("#lastName").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip("#lastName", {
      title: `${data.error.billing.last_name}`
    });
  }
  if(data.error.billing.address_1 != undefined){
    $("#address").addClass("is-invalid");
    $("#address").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip("#address", {
      title: `${data.error.billing.address_1}`
    });
  }
  if(data.error.billing.city != undefined){
    $("#city").addClass("is-invalid");
    $("#city").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip("#city", {
      title: `${data.error.billing.city}`
    });
  }
  if(data.error.billing.email != undefined){
    $("#email").addClass("is-invalid");
    $("#email").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip("#email", {
      title: `${data.error.billing.email}`
    });
  }
  if(data.error.billing.phone != undefined){
    $("#phone").addClass("is-invalid");
    $("#phone").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip("#phone", {
      title: `${data.error.billing.phone}`
    });
  }
  if(data.error.billing.province != undefined){
    $("#state").addClass("is-invalid");
    $("#state").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip("#state", {
      title: `${data.error.billing.province}`
    });
  }
  if(data.error.shipping.first_name != undefined){
    $("#firstName_ship").addClass("is-invalid");
    $("#firstName_ship").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip("#firstName_ship", {
      title: `${data.error.shipping.first_name}`
    });
  }
  if(data.error.shipping.last_name != undefined){
    $("#lastName_ship").addClass("is-invalid");
    $("#lastName_ship").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip("#lastName_ship", {
      title: `${data.error.shipping.last_name}`
    });
  }
  if(data.error.shipping.address_1 != undefined){
    $("#address_ship").addClass("is-invalid");
    $("#address_ship").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip("#address_ship", {
      title: `${data.error.shipping.address_1}`
    });
  }
  if(data.error.shipping.city != undefined){
    $("#city_ship").addClass("is-invalid");
    $("#city_ship").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip("#city_ship", {
      title: `${data.error.shipping.city}`
    });
  }
  if(data.error.shipping.province != undefined){
    $("#state_ship").addClass("is-invalid");
    $("#state_ship").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip("#state_ship", {
      title: `${data.error.shipping.province}`
    });
  }
  $(`#errorShow`).modal('show');


}

