window.onload = function(){
  let data = {};
      fetch("https://fakestoreapi.com/products").
          then(response => response.json()).
          then((json) => {
              data = json;
              data.forEach(productShow);
              let catalog_container = document.getElementById("products"); // assuming your target is <div class='row' id='catalog'>
jQuery(catalog_container).imagesLoaded( function() {
let msnry = new Masonry(catalog_container); // this initializes the masonry container AFTER the product images are loaded
});
          }).then(addCart);
}

function productShow(element){



  
  


  let html = 
  `<div class="col-sm-6 col-lg-4 mb-4">
    <div class="card">
    <image src = "${element.image}">

    <div class="card-body">
      <h5 class="card-title">${element.title}</h5>
      
      <p class = "price">Price: $${element.price}</p>
      <p class="card-text">${element.description}</p>
      <button class = "add-to-cart">Add to Cart</button>
    </div>
  </div>
</div>`
  
  $(`#products`).append(html);
      


  


}



function addCart(){
    let click = 0;
    let v_cart = document.getElementById("view-cart")
    $(".add-to-cart").click(function(){
        click = click+1;
        v_cart.value = `View Cart(${click})`;
    })
}







  





