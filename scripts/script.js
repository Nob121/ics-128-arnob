/*Created a class called cart, product object has all the products that will be added to the cart. It has 3 functions. One is to empty the whole cart. one is to remove one item and one is to add a product and update the quantity*/

class Cart {
  constructor() {
    this.product = {};
    this.price = [];
  }

  emptyCart() {
    this.product = {};
  }

  cartAddandQuantity(item) {
    //if the product doesn't exist in product object, we are gonna add the product and set the quantity to 1. If it already exists, we are gonna increment quantity by 1
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
    //if there is an error backup fetch works
    .catch((error) => {
      fetch("https://deepblue.camosun.bc.ca/~c0180354/ics128/final/fakestoreapi.json").
        then((response) => {
          if (response.status === 200) {
            return response.json();
          }
        }).then((json) => {
          data = json;

          data.forEach(productShow);
          let catalog_container = document.getElementById("products"); // assuming your target is <div class='row' id='catalog'>
          jQuery(catalog_container).imagesLoaded(function () {
            let msnry = new Masonry(catalog_container); // this initializes the masonry container AFTER the product images are loaded
          });
        })
    }).then(addCart).
    then(cookies)
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
      
      <p class = "price" id = "price${button + 1}">Price: ${(element.price).toFixed(2)} CAD</p>
      <p class="card-text">${element.description}</p>
      <button class = "add-to-cart" id = "button-${button + 1}" onclick= addToCart(${element.id})>Add to Cart</button>
      </div>
  </div>
</div>`
  $(`#products`).append(html);


}
//counting the total quantity
function totalQty() {
  quantity = 0;
  for (let i = 0; i < data.length; i++) {
    //if that product doesn't exist in cart, we are gonna skip that loop and go to the next one
    if (cart.product[i + 1] === undefined) {
      continue;
    }
    quantity += cart.product[i + 1].quantity;
  }
  return quantity;
}



//add-to-cart functionality
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
let st_for_tax = 0;
function displayAndRemove() {
  let txt = "";
  let txt2 = "";
  let subtotal = 0;
  let shipping_cost = parseInt(totalQty()) * 5;

  for (let item in cart.product) {

    let total = 0;




    total = (total + cart.product[item].quantity * cart.product[item].price).toFixed(2);
    subtotal = parseFloat(total) + parseFloat(subtotal);
    st_for_tax = subtotal;

    //for the offcanvus and check out modal
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

  let order_total = parseFloat(tax) + parseFloat(shipping_cost) + parseFloat(subtotal);

  $("#order-total").html(`<b>Order Total: </b><span class = "subtotal"><b>CA$${parseFloat(order_total).toFixed(2)}</b></span>`);

  $("#body").html(txt);//offcanvus
  $("#body2").html(txt2);//modal

  //other items from checkout
  $("#item").html(`<b>Subtotal: </b><span id = "subtotal" value = "${parseFloat(subtotal).toFixed(2)}">CA$${parseFloat(subtotal).toFixed(2)}</span>`);
  $("#subtotal-final").html(`<b>Subtotal: </b><span class = "subtotal" value = "${parseFloat(subtotal).toFixed(2)}">CA$${parseFloat(subtotal).toFixed(2)}</span>`);
  $("#shipping-cost").html(`<b>Shipping Cost: </b><span class = "subtotal" id = "shipping_cost" value = "${parseFloat(shipping_cost).toFixed(2)}">CA$${parseFloat(shipping_cost).toFixed(2)}</span>`);
  $("#tax").html(`<b>Tax: </b><span class = "subtotal" id = "st_tax" value = "${parseFloat(tax).toFixed(2)}">CA$${parseFloat(tax).toFixed(2)}</span>`);

  //if cart.product is empty
  if (Object.keys(cart.product).length == 0) {
    $("#empty-cart").hide();
    $(`.table`).hide();
    $(`#begin`).show();
    $(`#checkout`).hide();
    $(`#item`).hide();
    $("view-cart").val("View Cart");
    click = 0;
  }
  //if you click the delete button in offcanvus
  $(".remove").click(function () {
    let buttonID = this.id.slice(14, 16);//button ids are set like remove-button-1,remove-button-2,remove-button-3 where 1,2,3 are product id, so slicing just returns 1,2,3....
    for (let item in cart.product) {
      //if product id matches with button's sliced part
      if (cart.product[item].id == buttonID) {

        cart.removeItem(cart.product[item]);
        displayAndRemove();
        changeCurrency();
      }
    }
    //to show the total product quantity in view-cart button
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
    //view cart value according to product quantity
    v_cart.value = `View Cart (${totalQty()})`;
    //when you add a item in the cart a modal is gonna be for 800ms to give a notification that the product has been added
    $("#order-cart").modal('show');
    setTimeout(modalHide, 800);
    function modalHide() {
      $("#order-cart").modal('hide');
    }
    changeCurrency();
    //to change the currency according to your select option every time you click on add-to-cart
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
  //empty-cart-button click
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
    then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error("Something went wrong");
    }).
    then((json) => {
      currency = json;
      changeCurrency(currency);
    })
    //backup for an error
    .catch((error) => {
      fetch("https://deepblue.camosun.bc.ca/~c0180354/ics128/final/currencies-cad.json").
        then((response) => {
          if (response.status === 200) {
            return response.json();
          }
        }).
        then((json) => {
          currency = json;
          changeCurrency(currency);
        })
    })
}


//takes the value from select option and calls function accordingly
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

//changes all the prices to cad and pushes in cad_array and set them in the html accordingly
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
    st_for_tax = subtotal;
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

  let order_total = parseFloat(tax) + parseFloat(shipping_cost) + parseFloat(subtotal);
  $("#order-total").html(`<b>Order Total: </b><span class = "subtotal"><b>CA$${parseFloat(order_total).toFixed(2)}</b></span>`);

  $("#body").html(txt);//offcanvus convert
  $("#body2").html(txt2);//modal convert
  $("#item").html(`<b>Subtotal: </b><span id = "subtotal" value = "${parseFloat(subtotal).toFixed(2)}">CA$${parseFloat(subtotal).toFixed(2)}</span>`);
  $("#subtotal-final").html(`<b>Subtotal: </b><span class = "subtotal" ${parseFloat(subtotal).toFixed(2)}>CA$${parseFloat(subtotal).toFixed(2)}</span>`);
  $("#shipping-cost").html(`<b>Shipping Cost: </b><span class = "subtotal" id = "shipping_cost" value = "${parseFloat(shipping_cost).toFixed(2)}">CA$${parseFloat(shipping_cost).toFixed(2)}</span>`);
  $("#tax").html(`<b>Tax: </b><span class = "subtotal" id = "st_tax" value = "${parseFloat(tax).toFixed(2)}">CA$${parseFloat(tax).toFixed(2)}</span>`);
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




////changes all the prices to bdt and pushes in bdt_array and set them in the html accordingly
function bdt_convert(element) {
  let changed_price = currency.cad.bdt * element.price;
  bdt_array.push(changed_price);
  for (let i = 0; i < bdt_array.length; i++) {
    $(`#price${i + 1}`).html(`Price: ${bdt_array[i].toFixed(2)} BDT`);
  }
  displayAndRemove();
  let txt = "";
  let txt2 = "";
  subtotal = 0;

  let shipping_cost = parseFloat(parseInt(totalQty()) * 5 * currency.cad.bdt);

  for (let item in cart.product) {

    let total = 0;


    total = ((total + cart.product[item].quantity * cart.product[item].price) * currency.cad.bdt).toFixed(2);

    subtotal = parseFloat(total) + parseFloat(subtotal);
    st_for_tax = subtotal;
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


  let tax_bdt = tax * currency.cad.bdt;
  let order_total = parseFloat(tax_bdt) + parseFloat(shipping_cost) + parseFloat(subtotal);
  $("#order-total").html(`<b>Order Total: </b><span class = "subtotal"><b>&#2547;${parseFloat(order_total).toFixed(2)}</b></span>`);

  $("#body").html(txt);//offcanvus
  $("#body2").html(txt2);//modal
  $("#item").html(`<b>Subtotal: </b><span id = "subtotal" value = "${parseFloat(subtotal).toFixed(2)}">&#2547;${parseFloat(subtotal).toFixed(2)}</span>`);
  $("#subtotal-final").html(`<b>Subtotal: </b><span class = "subtotal">&#2547;${parseFloat(subtotal).toFixed(2)}</span>`);
  $("#shipping-cost").html(`<b>Shipping Cost: </b><span class = "subtotal" id = "shipping_cost" value = "${parseFloat(shipping_cost).toFixed(2)}">&#2547;${parseFloat(shipping_cost).toFixed(2)}</span>`);
  $("#tax").html(`<b>Tax: </b><span class = "subtotal" id = "st_tax" value = "${parseFloat(tax).toFixed(2)}">&#2547;${parseFloat(tax_bdt).toFixed(2)}</span>`);
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

//changes all the prices to usd and pushes in usd_array and set them in the html accordingly
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
    st_for_tax = subtotal;

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


  let tax_usd = tax * currency.cad.usd;
  let order_total = parseFloat(tax_usd) + parseFloat(shipping_cost) + parseFloat(subtotal);
  $("#order-total").html(`<b>Order Total: </b><span class = "subtotal">$${parseFloat(order_total).toFixed(2)}</span>`);

  $("#body").html(txt);//offcanvus
  $("#body2").html(txt2);//modal
  $("#item").html(`<b>Subtotal: </b><span id = "subtotal" value = "${parseFloat(subtotal).toFixed(2)}">$${parseFloat(subtotal).toFixed(2)}</span>`);
  $("#subtotal-final").html(`<b>Subtotal: </b><span class = "subtotal">$${parseFloat(subtotal).toFixed(2)}</span>`);
  $("#shipping-cost").html(`<b>Shipping Cost: </b><span class = "subtotal" id = "shipping_cost" value = "${parseFloat(shipping_cost).toFixed(2)}">$${parseFloat(shipping_cost).toFixed(2)}</span>`);
  $("#tax").html(`<b>Tax: </b><span class = "subtotal" id = "st_tax" value = "${parseFloat(tax).toFixed(2)}">$${parseFloat(tax_usd).toFixed(2)}</span>`);
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
let tax = 0;
//calculating the tax according to the shipping state
//st_for_tax is a global variable which has the subtotal value
function tax_calculator() {
  let option1 = document.getElementById("select");
  let value1 = select.options[option1.selectedIndex].value;
  let state = $(`#state_ship`).val();
  if ((state == "BC") || (state == "AB") || (state == "MB") || (state == "QC") || (state == "SK") || (state == "NT") || (state == "NU") || (state == "YT")) {
    tax = ((st_for_tax * 5) / 100).toFixed(2);
    if (value1 == "cad") {
      $(`#st_tax`).html(`CA$${tax}`);
    } else if (value1 == "usd") {
      $(`#st_tax`).html(`$${(tax * currency.cad.usd).toFixed(2)}`);
    } else {
      $(`#st_tax`).html(`৳${(tax * currency.cad.bdt).toFixed(2)}`);
    }
  } else if (state == "ON") {
    tax = ((st_for_tax * 13) / 100).toFixed(2);
    if (value1 == "cad") {
      $(`#st_tax`).html(`CA$${tax}`);
    } else if (value1 == "usd") {
      $(`#st_tax`).html(`$${(tax * currency.cad.usd).toFixed(2)}`);
    } else {
      $(`#st_tax`).html(`৳${(tax * currency.cad.bdt).toFixed(2)}`);
    }
  } else if ((state == "PE") || (state == "NL") || (state == "NS") || (state == "NB")) {
    tax = ((st_for_tax * 15) / 100).toFixed(2);
    if (value1 == "cad") {
      $(`#st_tax`).html(`CA$${tax}`);
    } else if (value1 == "usd") {
      $(`#st_tax`).html(`$${(tax * currency.cad.usd).toFixed(2)}`);
    } else {
      $(`#st_tax`).html(`৳${(tax * currency.cad.bdt).toFixed(2)}`);
    }
  } else {
    tax = 0;
    if (value1 == "cad") {
      $(`#st_tax`).html(`CA$${tax}`);
    } else if (value1 == "usd") {
      $(`#st_tax`).html(`$${(tax * currency.cad.usd).toFixed(2)}`);
    } else {
      $(`#st_tax`).html(`৳${(tax * currency.cad.bdt).toFixed(2)}`);
    }
  }
  displayAndRemove();

}
//every time shipping state's value changes, tax_calculator function gets called
document.getElementById("state_ship").addEventListener("change", tax_calculator);



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


//checkout modal show

$("#checkout").click(function () {
  $('#myModal').modal('show');
});


$("#continue-button-1").click(function (event) {
  //prevent from submitting
  event.preventDefault();
  //keep track of validity
  let visaRegEx = /^4[0-9]{12}(?:[0-9]{3})?$/;
  var mastercardRegEx = /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/;
  var amexpRegEx = /^3[47][0-9]{13}$/;
  let value = $("#card-num").val();
  let validity = true;

  //card number: checks the card type and number both
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
  } else if (($('input[name="paymentMethod"]:checked').val() == "visa") && (!($("#card-num").val()).match(visaRegEx))) {
    $("#card-num").removeClass("is-valid");
    $("#card-num").addClass("is-invalid");
    let tooltip = new bootstrap.Tooltip("#card-num", {
      title: "Invalid VISA Card Number"
    });
    validity = false;
  } else if (($('input[name="paymentMethod"]:checked').val() == "mastercard") && ($("#card-num").val()).match(mastercardRegEx)) {
    $("#card-num").addClass("is-valid");
    $("#card-num").removeClass("is-invalid");
    if ($("#card-num").tooltip != undefined) {
      $("#card-num").tooltip("dispose");
    }
  } else if (($('input[name="paymentMethod"]:checked').val() == "mastercard") && (!($("#card-num").val()).match(mastercardRegEx))) {
    $("#card-num").removeClass("is-valid");
    $("#card-num").addClass("is-invalid");
    let tooltip = new bootstrap.Tooltip("#card-num", {
      title: "Invalid MasterCard Card Number"
    });
    validity = false;
  } else if (($('input[name="paymentMethod"]:checked').val() == "AEX") && ($("#card-num").val()).match(amexpRegEx)) {
    $("#card-num").addClass("is-valid");
    $("#card-num").removeClass("is-invalid");
    if ($("#card-num").tooltip != undefined) {
      $("#card-num").tooltip("dispose");
    }
  }
  else if (($('input[name="paymentMethod"]:checked').val() == "AEX") && (!($("#card-num").val()).match(amexpRegEx))) {
    $("#card-num").removeClass("is-valid");
    $("#card-num").addClass("is-invalid");
    let tooltip = new bootstrap.Tooltip("#card-num", {
      title: "Invalid AMEX Card Number"
    });
    validity = false;
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
  } else if (($("#yy").val()).match(mm_regex) && ((parseInt($("#yy").val()) < 100))) {
    $("#yy").addClass("is-valid");
    $("#yy").removeClass("is-invalid");
    if ($("#yy").tooltip != undefined) {
      $("#yy").tooltip("dispose");
    }
  } else {
    $("#yy").addClass("is-invalid");
    $("#yy").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip("#yy", {
      title: "Invalid year"
    });
    validity = false;
  }
  let year = "20" + $("#yy").val();//to make the year 2045,2065....
  let created_date = new Date(parseInt(year), ($("#mm").val() - 1));//date from user input
  let current_date = new Date();//current date

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
  //amex has 4 digits in cvv but visa and mastercard has 3 digits
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
    document.getElementById("payment-details").disabled = false;
    document.getElementById("billing-details").disabled = false;//enabling billing details button
    document.getElementById("shipping-details").disabled = true;
    document.getElementById("confirm-order").disabled = true;
    $("#billing-details").click();//next tab
    $("#continue-button-1").hide();
    $("#continue-button-2").show();
  }
});


$("#continue-button-2").click(function (event) {

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
  let us_phone_regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
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
  else if (($(`#province`).val == "US") && input.match(us_phone_regex)) {
    $("#phone").removeClass("is-invalid");
    $("#phone").addClass("is-valid");
    if ($("#phone").tooltip != undefined) {
      $("phone").tooltip("dispose");
    }
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
  if ($("#province").val() == "") {
    $("#province").addClass("is-invalid");
    $("#province").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#province', {
      title: "Country Name cannot be blank"
    });
    validity = false;
  } else if (($("#province").val()).match(name)) {
    $("#province").removeClass("is-invalid");
    $("#province").addClass("is-valid");
    if ($("#province").tooltip != undefined) {
      $("#province").tooltip("dispose");
    }
  } else {
    $("#province").addClass("is-invalid");
    $("#province").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#province', {
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
  let us_zip = /^\d{5}(?:[-\s]\d{4})?$/;
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
  } else if (($(`#province`).val == "US") && zip.match(us_zip)) {
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
      title: "Invalid Postal Code: Doesn't meet the correct format"
    });
    validity = false;
  }
  if (validity == true) {
    document.getElementById("shipping-details").disabled = false;//enabling shipping details button
    $("#shipping-details").click();//next tab
    $("#myModal").find("#continue-button-2").hide();
    $("#myModal").find("#continue-button-3").show();
  }

})

$('#shipping_billing_same').change(function () {
  if (!$(this).is(':checked')) {
    //if the checkbox is not checked 
    $("#myModal").find(`#billing-shipping`).show();//showing the form
    document.getElementById("firstName_ship").value = "";
    document.getElementById("lastName_ship").value = "";
    document.getElementById("address_ship").value = "";
    document.getElementById("address2_ship").value = "";
    document.getElementById("province_ship").value = "";
    document.getElementById("city_ship").value = "";
    document.getElementById("state_ship").value = "";
    document.getElementById("zip_ship").value = "";
  } else {
    //if the checkbox is checked
    $("#myModal").find(`#billing-shipping`).hide();//hiding the form
    //setting all the values from billing form to shipping
    let fname = $(`#firstName`).val();
    let lname = $(`#lastName`).val();
    let ad1 = $(`#address`).val();
    let ad2 = $(`#address2`).val();
    let country = $(`#province`).val();
    let city = $(`#city`).val();
    let zipShip = $(`#zip`).val();
    let state = $(`#state`).val();
    document.getElementById("firstName_ship").value = fname;
    document.getElementById("lastName_ship").value = lname;
    document.getElementById("address_ship").value = ad1;
    document.getElementById("address2_ship").value = ad2;
    document.getElementById("province_ship").value = country;
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
  if ($("#province_ship").val() == "") {
    $("#province_ship").addClass("is-invalid");
    $("#province_ship").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#province_ship', {
      title: "Country Name cannot be blank"
    });
    validity = false;
  } else if (($("#province_ship").val()).match(name)) {
    $("#province_ship").removeClass("is-invalid");
    $("#province_ship").addClass("is-valid");
    if ($("#province_ship").tooltip != undefined) {
      $("#province_ship").tooltip("dispose");
    }
  } else {
    $("#province_ship").addClass("is-invalid");
    $("#province_ship").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip('#province_ship', {
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
  let us_zip = /^\d{5}(?:[-\s]\d{4})?$/;
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
  }
  else if (($(`#province_ship`).val == "US") && zip.match(us_zip)) {
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
      title: "Invalid Postal Code: Doesn't meet the correct format"
    });
    validity = false;
  }


  if (validity == true) {
    tax_calculator();
    document.getElementById("confirm-order").disabled = false;//enabling confirm order tab button
    $("#confirm-order").click();//next tab
    $("#myModal").find("#continue-button-3").hide();
    $("#myModal").find("#confirm-button").show();
  }

})

//geolocation
function autocomplete_form() {
  let num;
  let text;
  let data = {};
  let html1 = "";
  let address_array = [];
  let splited = $("#address").val().split(" ");//spliting the number from the texts
  num = splited[0];
  text = splited[1];
  fetch(`https://geocoder.ca/?autocomplete=1&geoit=xml&auth=test&json=1&locate=${num}%20${text}`).
    then(response => response.json()).
    then((json) => {
      data = json;
      if (typeof (data.streets.street) == "object") {
        //if the return type is object(more than one address), make an array and push the addresses
        for (let i = 0; i < Object.keys(data.streets.street).length; i++) {
          address_array.push(data.streets.street[i]);
        }
        for (let i = 0; i < 3; i++) {//only showing the 1st 4 options
          html1 += `<option id = "option${i}">${address_array[i]}</option>`
        }
      }
      //if the return type is string(one address)
      if (typeof (data.streets.street) == "string") {
        html1 = `<option id = "option1">${data.streets.street}</option>`
      }



      $(`#street_suggest`).append(html1);//adding the options in datalist

      let selectedText = $("#address").val();

      let division = selectedText.split(", ");//spliting the address

      //when there is a full address in the form value(nothing is missing)
      if (division[3] != undefined) {
        document.getElementById("address").value = division[0];
        document.getElementById("city").value = division[1];
        document.getElementById("state").value = division[2];
        document.getElementById("zip").value = division[3];
        document.getElementById("province").value = "CA";
        $(`#street_suggest`).empty();
      }
    })
  html1 = "";
  $(`#street_suggest`).empty();
  address_array = [];

}
//same like billing's geocoder
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

      if (typeof (data.streets.street) == "object") {
        for (let i = 0; i < Object.keys(data.streets.street).length; i++) {
          address_array.push(data.streets.street[i]);
        }
        for (let i = 0; i < 3; i++) {

          html1 += `<option id = "option${i}">${address_array[i]}</option>`
        }


      } if (typeof (data.streets.street) == "string") {

        html1 = `<option id = "option1">${data.streets.street}</option>`
      }



      $(`#street_suggest_ship`).append(html1);

      let selectedText = $("#address_ship").val();

      let division = selectedText.split(", ");


      if (division[3] != undefined) {
        document.getElementById("address_ship").value = division[0];
        document.getElementById("city_ship").value = division[1];
        document.getElementById("state_ship").value = division[2];
        document.getElementById("zip_ship").value = division[3];
        document.getElementById("province_ship").value = "CA";
        $(`#street_suggest_ship`).empty();
      }





    })
  html1 = "";
  $(`#street_suggest_ship`).empty();
  address_array = [];

}





//post validation starts
$("#confirm-button").click(function () {
  final_json();
});

function final_json() {
  let data = {};
  let items = cart.product;
  let amount = document.getElementById("subtotal").getAttribute("value");
  let taxes = document.getElementById("st_tax").getAttribute("value");
  let shipping = document.getElementById("shipping_cost").getAttribute("value");
  //the JSON object to send
  let final_json_send = {
    "card_number": $(`#card-num`).val(),
    "expiry_month": $(`#mm`).val(),
    "expiry_year": "20" + $(`#yy`).val(),
    "security_code": $(`#cvv`).val(),
    "amount": amount,
    "taxes": taxes,
    "shipping_amount": shipping,
    "currency": $(`#select`).val(),
    "items": items,
    "billing": {
      "first_name": $(`#firstName`).val(),
      "last_name": $(`#lastName`).val(),
      "address_1": $(`#address`).val(),
      "address_2": $(`#address2`).val(),
      "city": $(`#city`).val(),
      "province": $(`#state`).val(),
      "country": $(`#province`).val(),
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
      "country": $(`#province_ship`).val(),
      "postal": $(`#zip_ship`).val()
    }


  }
  //creating a formdata and posting the values in the server and working with the return
  let formdata = new FormData();
  formdata.append('submission', JSON.stringify(final_json_send));
  fetch('https://deepblue.camosun.bc.ca/~c0180354/ics128/final/', {
    method: 'POST',
    body: formdata
  }).then(response => response.json()).
    then((json) => {
      data = json;
      //if it is not submitted
      if (data.status == "NOT SUBMITTED") {

        post_validation(data);
      }
      //if everything is alright
      else {
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
    });
}

//working with errors from post submitting
//if the error object is there, it is gonna target the related form input id and make tooltips
function post_validation(data) {
  if (data.error.card_number != undefined) {
    $("#card-num").addClass("is-invalid");
    $("#card-num").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip("#card-num", {
      title: `${data.error.card_number}`
    });
  }
  if (data.error.expiry_year != undefined) {
    $("#yy").addClass("is-invalid");
    $("#yy").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip("#yy", {
      title: `${data.error.expiry_year}`
    });
  }
  if (data.error.expiry_month != undefined) {
    $("#mm").addClass("is-invalid");
    $("#mm").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip("#mm", {
      title: `${data.error.expiry_month}`
    });
  }
  if (data.error.security_code != undefined) {
    $("#cvv").addClass("is-invalid");
    $("#cvv").removeClass("is-valid");
    let tooltip = new bootstrap.Tooltip("#cvv", {
      title: `${data.error.security_code}`
    });
  }

  if (data.error.billing != undefined) {
    if (data.error.billing.first_name != undefined) {
      $("#firstName").addClass("is-invalid");
      $("#firstName").removeClass("is-valid");
      let tooltip = new bootstrap.Tooltip("#firstName", {
        title: `${data.error.billing.first_name}`
      });
    }
    if (data.error.billing.last_name != undefined) {
      $("#lastName").addClass("is-invalid");
      $("#lastName").removeClass("is-valid");
      let tooltip = new bootstrap.Tooltip("#lastName", {
        title: `${data.error.billing.last_name}`
      });
    }
    if (data.error.billing.address_1 != undefined) {
      $("#address").addClass("is-invalid");
      $("#address").removeClass("is-valid");
      let tooltip = new bootstrap.Tooltip("#address", {
        title: `${data.error.billing.address_1}`
      });
    }
    if (data.error.billing.city != undefined) {
      $("#city").addClass("is-invalid");
      $("#city").removeClass("is-valid");
      let tooltip = new bootstrap.Tooltip("#city", {
        title: `${data.error.billing.city}`
      });
    }
    if (data.error.billing.email != undefined) {
      $("#email").addClass("is-invalid");
      $("#email").removeClass("is-valid");
      let tooltip = new bootstrap.Tooltip("#email", {
        title: `${data.error.billing.email}`
      });
    }
    if (data.error.billing.phone != undefined) {
      $("#phone").addClass("is-invalid");
      $("#phone").removeClass("is-valid");
      let tooltip = new bootstrap.Tooltip("#phone", {
        title: `${data.error.billing.phone}`
      });
    }
    if (data.error.billing.province != undefined) {
      $("#state").addClass("is-invalid");
      $("#state").removeClass("is-valid");
      let tooltip = new bootstrap.Tooltip("#state", {
        title: `${data.error.billing.province}`
      });
    }
  }
  if (data.error.shipping != undefined) {
    if (data.error.shipping.first_name != undefined) {
      $("#firstName_ship").addClass("is-invalid");
      $("#firstName_ship").removeClass("is-valid");
      let tooltip = new bootstrap.Tooltip("#firstName_ship", {
        title: `${data.error.shipping.first_name}`
      });
    }
    if (data.error.shipping.last_name != undefined) {
      $("#lastName_ship").addClass("is-invalid");
      $("#lastName_ship").removeClass("is-valid");
      let tooltip = new bootstrap.Tooltip("#lastName_ship", {
        title: `${data.error.shipping.last_name}`
      });
    }
    if (data.error.shipping.address_1 != undefined) {
      $("#address_ship").addClass("is-invalid");
      $("#address_ship").removeClass("is-valid");
      let tooltip = new bootstrap.Tooltip("#address_ship", {
        title: `${data.error.shipping.address_1}`
      });
    }
    if (data.error.shipping.city != undefined) {
      $("#city_ship").addClass("is-invalid");
      $("#city_ship").removeClass("is-valid");
      let tooltip = new bootstrap.Tooltip("#city_ship", {
        title: `${data.error.shipping.city}`
      });
    }
    if (data.error.shipping.province != undefined) {
      $("#state_ship").addClass("is-invalid");
      $("#state_ship").removeClass("is-valid");
      let tooltip = new bootstrap.Tooltip("#state_ship", {
        title: `${data.error.shipping.province}`
      });
    }
  }
  $(`#errorShow`).modal('show');
  $("#payment-details").click();
  $("#myModal").find("#continue-button-1").show();
  $("#myModal").find("#confirm-button").hide();

}
//shows the related button according to tab
$("#payment-details").click(function () {
  $("#myModal").find("#continue-button-1").show();
  $("#myModal").find("#continue-button-2").hide();
  $("#myModal").find("#continue-button-3").hide();
  $("#myModal").find("#confirm-button").hide();
});

$("#billing-details").click(function () {
  $("#myModal").find("#continue-button-1").hide();
  $("#myModal").find("#continue-button-2").show();
  $("#myModal").find("#continue-button-3").hide();
  $("#myModal").find("#confirm-button").hide();
});

$("#shipping-details").click(function () {
  $("#myModal").find("#continue-button-1").hide();
  $("#myModal").find("#continue-button-2").hide();
  $("#myModal").find("#continue-button-3").show();
  $("#myModal").find("#confirm-button").hide();
});

$("#confirm-order").click(function () {
  $("#myModal").find("#continue-button-1").hide();
  $("#myModal").find("#continue-button-2").hide();
  $("#myModal").find("#continue-button-3").hide();
  $("#myModal").find("#confirm-button").show();
});

//change the states according to counrty
document.getElementById("province").addEventListener("input", billing_states_change);
document.getElementById("province_ship").addEventListener("input", shipping_states_change);

function billing_states_change() {
  let value = $(`#province`).val();
  let state = document.getElementById("state");
  if (value == "US") {
    //checks the value of the country and connects the states accordingly
    state.setAttribute('list', "state_list_USA")
  }
  if (value == "CA") {
    state.setAttribute('list', "state_list_CA")
  }
}

function shipping_states_change() {
  let value = $(`#province_ship`).val();
  let state = document.getElementById("state_ship");
  if (value == "US") {
    //checks the value of the country and connects the states accordingly
    state.setAttribute('list', "state_list_ship_USA");
  }
  if (value == "CA") {
    state.setAttribute('list', "state_list_ship_CA");
  }
}