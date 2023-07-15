
import typescriptLogo from './typescript.svg'
import { setupCounter } from './counter'
import { products } from './addata';

// import { product } from "./addata";
import { PO } from "./ProductOperations";
import swal from 'sweetalert';

const response = await fetch("http://larevel.localhost/public/api/products");
var product = await response.json();
console.log(response);



// redirect to show product
$(document).on('click', ".viewProduct", function (): void {
  var productid = this.id.split('_')[1];
  productid = btoa(productid);
  location.href = `viewProduct.html?product=${productid}`;
});

// check user
if (sessionStorage.getItem('User')) {
  $("#menu").html(`
  <li><a class="dropdown-item" href="profile.html">Profile</a></li>
  <li><a class="dropdown-item" href="viewAllproduct.html">All Products</a></li>
  <li><a class="dropdown-item" href="viewAllOrders.html">All Orders</a></li>
  <li><a class="dropdown-item" href="" id='logout'>Logout</a></li>
  `);
} else {
  $("#menu").html(`
  <li><a class="dropdown-item" href="login.html" >Login/Register</a></li>
  `);
}

// show confremation on complete payment
if (sessionStorage.getItem("ProductPlaced")) {
  swal("Congratulations!", "Order has been placed..", "success");
  sessionStorage.removeItem("ProductPlaced");
  sessionStorage.removeItem("cart");
}

// show confremation on complete payment
if (sessionStorage.getItem("newProduct")) {
  swal("Congratulations!", "New Product is added", "success");
  sessionStorage.removeItem("newProduct");
}

//logout function
$(document).on('click', "#logout", function (): void {
  if (confirm("Are you sure you want to logout")) {
    sessionStorage.removeItem('User');
    sessionStorage.removeItem('cart');
  }
});


var cart: products[] = [];
//initializing the product operation class
var categories: string[] = [];
let obj = new PO;

product.forEach((element: { category: string; }) => {
  categories.push(element.category);
});
//categories from json data..
categories = [...new Set(categories)];
$("#categorieList").html('<option class="dropdown-item text-center" value="">-Select category-</option>')
categories.forEach(element => {
  $("#categorieList").append(`
<option class="dropdown-item" value='${element}'>${element}</option>
  `)
});

// calling the listing function
var pageNo: number = 1;
obj.productlisting(product, pageNo);


//pagination function to show data on change of accordingly 
$(document).on('click', ".paginate", function (): void {
  pageNo = parseInt(this.id.split("_")[1]);
  obj.productlisting(product, pageNo);
});


// Substract the quantity
$(document).on('click', ".btnminus", function (): void {
  if (product[this.id].quantity >= 2) {
    product[this.id].quantity = product[this.id].quantity - 1;
    let newid = parseInt(this.id) + 1;
    $("#id" + newid).html(` <p id="id${this.id}"><strong>Quantity : </strong><button class="btn btn-primary p-2 py-1  btnminus" id="${this.id}" > - </button> <span class='px-2'> ${product[this.id].quantity}  </span> <button class= "btn btn-success p-2 py-1 btnplus" id="${this.id}" > + </button></p>`);
  }

});


// Addition the quantity
$(document).on('click', ".btnplus", function (): void {
  console.log(product[this.id]);
  product[this.id].quantity = product[this.id].quantity + 1;
  let newid = parseInt(this.id) + 1;
  $("#id" + newid).html(` <p id="id${this.id}"><strong>Quantity : </strong><button class="btn btn-primary p-2 py-1  btnminus" id="${this.id}" > - </button> <span class='px-2'> ${product[this.id].quantity}  </span> <button class= "btn btn-success p-2 py-1 btnplus" id="${this.id}" > + </button></p>`);
  $("#quentityerr_" + this.id).html(``);
});


// Add to cart
$(document).on('click', ".addtocart", function (): void {
  let id = parseInt(this.id.split("_")[1]);
  if (product[id].quantity != 0) {
    cart.push(product[id]);
    $("#AtC_" + id).addClass("disabled");
    alert(`${product[id].title} is add to your cart with quantity : ${product[id].quantity}..`);
    let sessioncart: any = sessionStorage.getItem("cart");
    sessioncart = JSON.parse(sessioncart);
    if (sessioncart == null) {
      sessionStorage.setItem("cart", JSON.stringify(cart));
    } else {
      cart.forEach((element: products) => {
        let present_in_cart = false;
        sessioncart.forEach((sessionElement: { id: number; quantity: number; }) => {
          (sessionElement.id == element?.id) ? (sessionElement.quantity = element.quantity, present_in_cart = true) : "";
        });
        (!present_in_cart) ? sessioncart.push(element) : "";
        sessionStorage.setItem("cart", JSON.stringify(sessioncart));
      });
    }
    $("#badge").html(JSON.parse(sessioncart).length);
  } else {
    $("#quentityerr_" + id).html(`Add at list 1 quantity ..`);
  }
});


//searching on search input
$(document).on('keyup', "#search", function (): void {
  var searchval: any = $('#search').val();
  var categorysearch: any = $('#categorieList').val();
  obj.searching<object, string, string>(product, searchval.toLowerCase(), categorysearch.toLowerCase());
});


//searching on categories
$(document).on('change', "#categorieList", function (): void {
  var searchval: any = $('#search').val();
  var categorysearch: any = $('#categorieList').val();

  obj.searching<object, string, string>(product, searchval.toLowerCase(), categorysearch.toLowerCase());

});

//searching on categories
$(document).on('change', "#sort", function (): void {
  var searchval: any = $('#search').val();
  var categorysearch: any = $('#categorieList').val();

  obj.searching<object, string, string>(product, searchval.toLowerCase(), categorysearch.toLowerCase());

});

//show badge's 
if (sessionStorage.getItem("cart")) {
  let cart: any = sessionStorage.getItem("cart");
  $("#badge").html(JSON.parse(cart).length);
}

export { categories };