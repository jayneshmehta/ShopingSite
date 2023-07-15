import typescriptLogo from './typescript.svg'
import { setupCounter } from './counter'
import { products } from './addata'
import { json } from 'stream/consumers';


// check user && set nav bar
let navdata = (sessionStorage.getItem('User')) ? ` <li><a class="dropdown-item" href="profile.html">Profile</a></li><li><a class="dropdown-item" href="" id='logout'>Logout</a></li>`:`<li><a class="dropdown-item" href="login.html" >Login/Register</a></li>`;
$("#menu").html(navdata) ;

const allresponse:object = await fetch(`http://larevel.localhost/public/api/products`);
var product:products[] = await allresponse.json();

// setting the values in html page
const url = new URL(window.location.href);
const searchParams = url.searchParams;
var cart: products[] = [];
let urlid: any = searchParams.get('product');
var productId: number = parseInt(atob(urlid));
const response:object = await fetch(`http://larevel.localhost/public/api/products/GettingProductById-${productId}`);
var showproduct:products = await response.json();
let discountedprice = showproduct.price - showproduct.price * showproduct.discountPercentage / 100;
var images: string = '';
showproduct['quantity'] = 0;
var allimages = showproduct.images.split(",")
allimages.forEach((element: string) => {
    images = images + `
    <img class='border border-dark border-2 p-2 rounded moreimages' src="${element}" alt="" width='100px' height='100px'   srcset="">`
});
let cartdata: any = sessionStorage.getItem("cart")
var Cart = JSON.parse(cartdata);
let cartquantity;
(JSON.parse(cartdata)) ?
    (showproduct.quantity = (Cart.find((element: { id: number; }) => element.id == productId)) ? Cart.find((element: { id: number; }) => element.id == productId).quantity : showproduct?.quantity)
    : "";

$("#thumbnail").attr('src', `${showproduct?.thumbnail}`);

$("#images").html(images);

$("#name").html(`${showproduct?.title}`);

$("#brandname").html(`${showproduct?.brand}`);

$("#discription").html(`${showproduct?.description}`);

$("#discount").html(`<strong>Discount : <span class='text-danger'>${showproduct?.discountPercentage} %</span></strong>`);

$("#price").html(`<strong>Price : <p class='mb-0'><span class='text-danger'>MRP : <s>${showproduct?.price}</s></span><br><span class='text-dark fs-3'>&#8377; ${discountedprice} </span>Only</p></strong>`);

$("#quantity").html(`<p class='mb-0 fs-5' id="id${showproduct?.id}"><strong>Quantity : </strong><button class="ms-3 btn btn-primary p-2 py-1 px-2  btnminus" id="minus_${showproduct?.id}" > - </button> <span class='px-2'> ${showproduct.quantity}  </span> <button class= "btn btn-success p-2 py-1 btnplus" id="plus_${showproduct.id}" > + </button></p>`);

$("#addtocart").html(`<a href="#" class="btn btn mt-2 addtocart w-50 mt-4" id='AddToCart_${showproduct.id}' style='background-color:#ff5252; border-color:#ff5252;color:#fce4ec'>Add to Cart</a>`);

$("#rating").html(`<span class='text-'>${showproduct?.rating}</span>`);
let rate: number = Math.floor(showproduct?.rating);

$('#buynow').html(`<a href="#" class="btn btn mt-2 buynow w-50 mt-4 font-weight-bold" id='Buynow_${showproduct?.id}' style='background-color:#f3df2e; border-color:#f3df2e;color:#ffffff'>Buy Now</a>`);

$(`#star${rate}`).attr('checked', "checked");
let emi: any = parseFloat(showproduct.price / 6).toFixed(2);
$('#emi').html(` starts from ${emi} per month . No Cost EMI available <a href='#'>EMI options</a>`)

let date = new Date();
let day = (date).toDateString();

$('#delivery').html(` ${day} `);
(showproduct?.stock > 0) ? $('#stock').html(`<span class='text-success'>In Stock</span>`) : '';

// rating function
$(document).on("click", '[name=rate]', function (): void {
    toastr.success("Thank's for rating");
})

// Substract the quantity
$(document).on('click', ".btnminus", function (): void {
    if (showproduct.quantity >= 1) {
        $('#stock').html(`<span class='text-success'>In Stock</span>`);
        showproduct.quantity = showproduct.quantity - 1;
        let selId = this.id.split('_')[1];
        $("#id" + selId).html(`<p class='mb-0' id="id${selId}"><strong>Quantity : </strong><button class="ms-3 m-0 btn btn-primary p-2 py-1  btnminus" id="minus_${selId}" > - </button> <span class='px-2'> ${showproduct.quantity}  </span> <button class= "btn btn-success m-0 p-2 py-1 btnplus" id="plus_${selId}" > + </button></p>`);
    }
});

// Addition the quantity
$(document).on('click', ".btnplus ", function (): void {
    if (showproduct.quantity < showproduct?.stock) {
        showproduct.quantity = showproduct.quantity + 1;
        let selId = this.id.split('_')[1];
        $("#id" + selId).html(`<p class='mb-0' id="id${selId}"><strong>Quantity : </strong><button class="ms-3 m-0 btn btn-primary p-2 py-1  btnminus" id="minus_${selId}" > - </button> <span class='px-2'> ${showproduct.quantity}  </span> <button class= "btn btn-success m-0 p-2 py-1 btnplus" id="plus_${selId}" > + </button></p>`);
        $("#quentityerr").html(``);
    } else {
        $('#stock').html(`<span class='text-danger'>Out Of Stock</span>`);
    }
});

// Add to cart
$(document).on('click', ".addtocart , #buynow", function (): void {
    let id = parseInt(this.id.split("_")[1]);

    if (showproduct.quantity != 0) {
        cart.push(showproduct);
        $("#AtC_" + id).addClass("disabled");
        toastr.success(`${showproduct?.title} is add to your cart with quantity : ${showproduct?.quantity}`);
        let cartdata: any = sessionStorage.getItem("cart");
        let sessioncart = JSON.parse(cartdata);
        if (sessioncart == null) {
            sessionStorage.setItem("cart", JSON.stringify(cart));
            (this.id == 'buynow') ? window.location.href = "/cart.html" : '';
        } else {
            cart.forEach(element => {
                let present_in_cart = false;
                sessioncart.forEach((sessionElement: { id: any; quantity: any; }) => {
                    (sessionElement.id == element.id) 
                    ? ( sessionElement.quantity = element.quantity,present_in_cart = true)
                    : "";
                });
                (!present_in_cart) ? sessioncart.push(element) : "";
                sessionStorage.setItem("cart", JSON.stringify(sessioncart));
                (this.id == 'buynow') ? window.location.href = "/cart.html" : '';
            });
        }
        cartdata = sessionStorage.getItem("cart");
        $("#badge").html(JSON.parse(cartdata).length);
    } else {
        $("#quentityerr").html(`Add at list 1 quantity ..`);
    }
});

// adding bage
if (sessionStorage.getItem("cart")) {
    let cart: any = sessionStorage.getItem("cart");
    $("#badge").html(JSON.parse(cart).length);
}

// change image on hover/change
$(document).on("click , mouseover", '.moreimages', function (): void {
    $("#thumbnail").attr('src', this.src);
})

// logout function
$(document).on('click', "#logout", function (): void {
    (confirm("Are you sure you want to logout")) ?
        (sessionStorage.removeItem('User'), sessionStorage.removeItem('cart')) : ''
});

// let similarProduct = product.find(product => product.category == showproduct?.category);
let similarProduct = product.filter((element: products) => {
    return (element.category === showproduct.category) ? element : ""
});

// view similar product
similarProduct.forEach((element: products, i: number) => {

    (element.id != productId && i <= 3) ?
        $("#similarproduct").append(`
    <div class="col-3 border-0 mb-3 viewProduct " id='viewproduct_${element.id}'>
    <div class="row gx-0">
    <div class="col-5">
    <img class=" border-start border-bottom border-dark border-2 p-3 rounded " src="${element.thumbnail}" alt="" width="200px" height="150px" srcset="">
    </div>
    <div class="col-7 ps-2 border-top border-end border-dark border-2 p-3 rounded">
    <div class="card-body">
    <h5 class="card-title text-truncate">${element.title}</h5>
    <p class="card-text m-0">${element.brand}</p>
    <p class="card-text m-0">Discount : <span class='text-danger'>${element.discountPercentage}%</span></p>
    <p><strong>Price : ${element.price}</strong></p>
    </div>
    </div>
    </div>
    </div>
    `) : ""
});

// redirect to show product
$(document).on('click', ".viewProduct", function (): void {
    var productid = this.id.split('_')[1];
    productid = btoa(productid);
    location.href = `viewProduct.html?product=${productid}`;
});