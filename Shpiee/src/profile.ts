import { products } from "./addata";

// check user
if (!sessionStorage.getItem('User')) {
    window.location.href = 'login.html';
}

var user: any = sessionStorage.getItem('User');
var user = JSON.parse(user);
let userid = user.id;
var userdata:any = await fetch(`http://larevel.localhost/public/api/user/GettingUserById-${userid}`);
userdata = await userdata.json();
if(userdata.profile != null){
    $("#prevprofile").attr("src",`${userdata.profile}`);
}
if(userdata.address != null){
    $("#address").html(`${userdata.address}`);
}
$('#contactNo').html(`${userdata.contactNo}`);


const response = await fetch(`http://larevel.localhost/public/api/orders/user/GettingUserById-${userid}`);
var orders: object[] = await response.json();


$('#name').html(`${user.name}`);
$('#email').html(`${user.email}`);

$('#orders').html(`${orders.length}`);

function showorders(count: number) {
    $("#showOrders").html(``);
    if (orders.length == 0) {
        $("#showOrders").append(`<div><p class='text-center'>-: No order's :- </p></div>`)
    } else {

        orders.forEach(async (element: any, i: number) => {
            
            if (i <= count) {
                const response = await fetch(`http://larevel.localhost/public/api/products/GettingProductById-${element.productId}`);
                var products: products[] = await response.json();
                // var product =;
                $("#showOrders").append(`
                <div class="col-4 mb-2">
                    <div class="card" style="width: 20rem;"  >
                    <img class='p-2' src="${products.thumbnail}" height='200px' class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title text-truncate">${products.title}</h5>
                            <p>${products.category}</p>
                            <p>${products.price}</p>
                            <p height='50px overflow-ellipse ' style=" overflow: hidden; text-overflow: ellipsis;  height: 43px;">${products.description}</p>
                            <div class='row gx-0' style = " min-height:'250px';">
                            <div class='col-12 gx-0 d-flex '>
                            <div class='col-5'>
                            <strong>Current Status  </strong>
                            </div>
                            <div class='col-7 d-flex justify-content-end'>
                            <span  class=''>: ${element.status}</span>
                            <span class=''><i class="ps-1 fa-solid fa-road" style="color: #242121;"></i></span>
                            </div>
                            </div>
                                <div class='col-12 mt-3 d-flex align-items-center justify-content-center'>
                                    <button class="btn btn-primary    status"  data-bs-toggle="modal" data-bs-target="#viewStatus" id='status_${element.id}'>View Status</button>
                                </div>
                        </div>
                    </div>
                </div>
                `);
            }
        });
    }
}
showorders(3);
$(document).on("click", "#showMoreOrders", function () {
    ($("#showMoreOrders").text() == 'Show all')
        ? ($("#showMoreOrders").html('Hide'), showorders(orders.length - 1), $("#showOrders").attr('style', "height: 500px;overflow: auto;"))
        : ($("#showMoreOrders").html('Show all'), showorders(3), $("#showOrders").attr('style', "height: 500px;overflow: hidden;"))
});

$(document).on("click",".status",async function () {  
    let orderid = this.id.split("_")[1];
    const response = await fetch(`http://larevel.localhost/public/api/orders/GettingOrdersById-${orderid}`);
    var orderdetails: object[] = await response.json(); 
    var date = new Date(orderdetails.created_at);
    date.setDate(date.getDate()+5);
    let orderId = orderdetails.orderId;
    $("#orderId").html(orderId);
    let delevertydate = date.getDay()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
    console.log(delevertydate);
    
    $("#deleveryState").html(delevertydate);
    $("#orderstatus").html('')
    
    var status:any = 0;
    switch (orderdetails.status) {
        case 'In process':
                status = 0;  
            break;
    
        case 'Pending':
                status = 0;  
            break;
    
        case 'Ready for dispatch':
                status = 1;  
            break;
    
        case 'Dispatched':
                status = 1;  
            break;
    
        case 'Out for Delivery':
                status = 2;  
            break;
    
        case 'Delivered':
                status = 3;  
            break;
    
        default:
            break;
    }

    let i=0;
    $('#step0').removeClass("active");
    $('#step1').removeClass("active");
    $('#step2').removeClass("active");
    $('#step3').removeClass("active");

    while(i<=status){
        $(`#step${i}`).addClass("active");
        i++;
    }
});
