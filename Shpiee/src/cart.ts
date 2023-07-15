import typescriptLogo from './typescript.svg'
import { setupCounter } from './counter'
import { products } from './addata';

// check user
if(sessionStorage.getItem("cart")){
    var cartdata: object[] = JSON.parse(sessionStorage.getItem("cart"));
    showcartitem(cartdata);
   $('#buynow').addClass('d-flex');
}else{
    $("#priceTotal").html(`
    <div class='col-12 text-center text-danger'>
    <span class="fw-bold fs-3">No product in the cart</span>
    </div>
   `);
   $('#buynow').addClass('d-none');
}

// showing Cart item
function showcartitem(cartdata: object[]): void {
    $("#mainbody").html('');
    cartdata.forEach((element:products):void => {
        let price = element.price - element.price * element.discountPercentage / 100;
        $("#mainbody").append(`
            <div class='row border-top border-bottom border-2 p-3 mt-3'>
                <div class='col-2 border-end border-2 '>
                    <img src='${element.thumbnail}' height='200px' width='250px'> 
                </div>
                <div class='col-3 border-end border-2 '>
                    <p class='fs-5 ' >Model : <strong>${element.title}</strong></p>
                    <p class='fs-5 ' >Brand : <strong>${element.brand}</strong></p>
                    <p class='fs-5 ' style = 'height: 75px; overflow: overlay; text-overflow: ellipsis; '>Description : <strong>${element.description}</strong></p>
                    <p class='fs-5 ' >Discount : <span class='text-success'><strong>${parseFloat(element.discountPercentage)} %</span></strong></p>
                </div>
                <div class='col-3 border-end border-2 '>
                <div class='text-center'>
                <h1>Price</h1>
                <p class='fs-5' >Real Price : <strong class='ms-5'>${parseFloat(element.price).toFixed(2)}</strong></p>
                <p class='fs-5' >Discoint Price : <strong class='ms-5 text-success'>${parseFloat(element.price * element.discountPercentage / 100).toFixed(2)}</strong></p>
                <p class='fs-5' > Price : <strong class='ms-5 text-success'>${parseFloat(price).toFixed(2)}</strong></p>
                </div>    
                </div>
                <div class='col-3 border-end border-2 '>
                <div class='text-center'>
                <div>
                <h1>Quantity</h1>
                <p class='fs-5 mt-5' >Quantity : <button class="btn btn-danger btnminus" id='minus_${element.id}'><strong>-</strong></button><strong class='ms-3 me-3 text-center' id='quantity_${element.id}'>${element.quantity}</strong><button class="btn btn-success btnplus" id='add_${element.id}'><strong>+</strong></button></p>
                </div>
                </div>
            </div>
        `);
    });
    totalPrice(cartdata);
}

// decrease quantity
$(document).on('click', ".btnminus", function (): void {
    var currentcartdata = JSON.parse(sessionStorage.getItem("cart"));
    let productid = parseInt(this.id.split('_')[1]);
    currentcartdata.forEach((element, i) => {
        if (element.id == productid && element.quantity > 0) {
            if (element.quantity == 1) {
                if (confirm("Do you want to remove this item from cart")) {
                    currentcartdata.splice(i, 1);
                    sessionStorage.setItem('cart', JSON.stringify(currentcartdata));
                    showcartitem(currentcartdata);
                    totalPrice(currentcartdata);
                }
            } else {
                currentcartdata[i]['quantity'] = element.quantity - 1;
                $("#quantity_" + productid).text(element.quantity);
                sessionStorage.setItem('cart', JSON.stringify(currentcartdata));
            }
        }
    });
    totalPrice(currentcartdata);
});

// increase quantity
$(document).on('click', ".btnplus", function (): void {
    var currentcartdata = JSON.parse(sessionStorage.getItem("cart"));
    let productid = parseInt(this.id.split('_')[1]);
    currentcartdata.forEach((element, i) => {
        if (element.id == productid) {
            currentcartdata[i]['quantity'] = element.quantity + 1;
            $("#quantity_" + productid).text(element.quantity);
            sessionStorage.setItem('cart', JSON.stringify(currentcartdata));
        }
    });
    totalPrice(currentcartdata);
});

// Show Total price
function totalPrice(cartdata: []): void {
    var Tprice = 0;
    cartdata.forEach(element => {
        Tprice = Tprice + (element.price - element.price * element.discountPercentage / 100) * element.quantity;
    });
    if (Tprice != 0) {
        $("#priceTotal").html(`
         <div class='col-1 '>
         <span class="fw-bold fs-3">Total Price</span>
         </div>
         <div class='col-2 ps-3 fs-3 text-success'>
         : ${parseFloat(Tprice).toFixed(2)}
         </div>
         `);
    } else {
        $("#priceTotal").html(`
        <div class='col-12 text-center text-danger'>
        <span class="fw-bold fs-3">No product in the cart</span>
        </div>
       `);
       $('#buynow').addClass('d-none');
    }
}