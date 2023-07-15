import { products } from "./addata";

//DOM on change of payment method
$(document).on('change', "[name=payment]", function (): void {
    if ($('input[name=payment]:checked').val() == 'upi') {
        $("#upidiv").removeClass('d-none');
        $("#carddiv").addClass('d-none');
    } else {
        $("#carddiv").removeClass('d-none');
        $("#upidiv").addClass('d-none');
    }
});

// check user
if (!sessionStorage.getItem('User')) {
    window.location.href = 'login.html';
}

// get buyproduct's
let sessiondata: any = sessionStorage.getItem('cart');
var buydata: products[] = JSON.parse(sessiondata);

// Make total bill amount
var TPrice: number = 0;
buydata.forEach(element => {
    TPrice = TPrice + (element.price * element.quantity);
    $("#tablediv").append(`
    <tr>
    <td class='p-3 px-5'>${element.title}</td>
    <td class='p-3 px-4 text-center'>${element.quantity}</td>
    <td class='p-3 px-4 text-center'>${element.price}</td>
    <td class='p-3 px-4 text-center'>${element.price * element.quantity}</td>
    </tr>
    `);
});

// make invoice
$("#tablediv").append(`
    <tr>
    <td class='text-end pe-4' colspan='3' ><strong>Total : </strong></td> 
    <td class='text-end pe-4' ><strong>${TPrice}</strong></td> 
    </tr>
`);

// make nav bar
if (sessionStorage.getItem('User')) {
    $("#menu").html(`
    <li><a class="dropdown-item" href="profile.html">Profile</a></li>
    <li><a class="dropdown-item" href="" id='logout'>Logout</a></li>
    `);
} else {
    window.location.href = '/login.html';
}

// logout button function
$(document).on('click', "#logout", function (): void {
    if (confirm("Are you sure you want to logout")) {
        sessionStorage.removeItem('User');
        sessionStorage.removeItem('cart');
    }
});

$("#checkout").addClass('disabled');
let address: any
let contactNo: any

let user: any = sessionStorage.getItem('User');
user = JSON.parse(user);
var userid: number = user.id;
const userdatas: any = await fetch(`http://larevel.localhost/public/api/user/GettingUserById-${userid}`);
let userdata = await userdatas.json();
$("#contactNo").val(userdata.contactNo);
$("#ShippingAddress").val(userdata.address);
// add address
$(document).on('click', "#add_Address", function (e) {
    var error = false;

    address = $("#ShippingAddress").val();
    (address.trim() == "")
        ? (e.preventDefault(), error = true, $("#errShippingAddress").html(`<span class='text-danger'>Field is required..*</span>`))
        : $("#errShippingAddress").html(`<span class='text-danger'></span>`);

    contactNo = $("#contactNo").val();
    (contactNo.trim() == "")
        ? (e.preventDefault(), error = true, $("#errcontactNo").html(`<span class='text-danger'>Field is required..*</span>`))
        : $("#errcontactNo").html(`<span class='text-danger'></span>`);

    if (error) {
        return false;
    } else {
        $('#addressModal').modal("hide");
        toastr.success('Address has been added successfully');
        $("#checkout").removeClass('disabled');
    }
});

// checkout button function
$(document).on('click', "#checkout", function (e) {
    var error = false;
    if ($('input[name=payment]:checked').val() == 'upi') {
        let upi: any = $("#upiinput").val();
        if (upi.trim() == '') {
            e.preventDefault();
            error = true;
            $("#errUpi").html(`<span class='text-danger'>Field is required..*</span>`);
        } else {
            $("#errUpi").html(`<span class='text-danger'></span>`);
        }
    } else {
        let name: any = $("#name").val();
        if (name.trim() == '') {
            e.preventDefault();
            error = true;
            $("#errName").html(`<span class='text-danger'>Field is required..*</span>`);
        } else {
            $("#errName").html(`<span class='text-danger'></span>`);
        }
        let number: any = $("#number").val();
        if (number.trim() == '') {
            e.preventDefault();
            error = true;
            $("#errNumber").html(`<span class='text-danger'>Field is required..*</span>`);
        } else {
            $("#errNumber").html(`<span class='text-danger'></span>`);
        }
        var q = new Date();
        var m = q.getMonth() + 1;
        var d = q.getDay();
        var y = q.getFullYear();
        var todaysdate = new Date(y, m, d);
        let expiredate: any = $("#expdate").val();
        var date = new Date(expiredate.trim());
        if (expiredate.trim() == '') {
            e.preventDefault();
            error = true;
            $("#errExpiration").html(`<span class='text-danger'>Field is required..*</span>`);
        } else if (date < todaysdate) {
            $("#errExpiration").html(`<span class='text-danger'>Date should be greater than current date ..*</span>`);
        } else {
            $("#errExpiration").html(`<span class='text-danger'></span>`);
        }
        let cvv: any = $("#cvv").val();
        if (cvv.trim() == '' || cvv.trim().length != 3) {
            e.preventDefault();
            error = true;
            $("#errCvv").html(`<span class='text-danger'>Field is required..*</span>`);
        } else {
            $("#errCvv").html(`<span class='text-danger'></span>`);
        }
    }
    if (error) {

        return false;
    } else {

        var orderdata: any = [];
        var user: any = sessionStorage.getItem('User');
        let data = {
            allproducts: buydata,
            user: JSON.parse(user),
            address: address,
            contactNo: contactNo,
        }

        $.ajax({
            type: "POST",
            url: "http://larevel.localhost/public/api/orders",
            data: data,
            cache: false,
            success: function (response) {
                if (response.status) {
                    $("#message").html(`Congrats !.. your Product is placed..`);
                    sessionStorage.setItem("ProductPlaced", JSON.stringify(response.message));
                    window.location.href = "index.html";
                }
            }
        });
    }
});
