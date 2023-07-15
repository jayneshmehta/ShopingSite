
import swal from 'sweetalert';
import DataTable from 'datatables.net-dt';

// Getting all Orders
const response = await fetch("http://larevel.localhost/public/api/orders");
var orders: object[] = await response.json();

// show confremation on update/Add payment
(sessionStorage.getItem("updatedStatus")) ? (swal("Congratulations!", "Status is been updated ..", "success"), sessionStorage.removeItem("updatedStatus")) : "";

// show confremation on update/Add payment
(sessionStorage.getItem("updatedOrder")) ? (swal("Congratulations!", "Order is been updated ..", "success"), sessionStorage.removeItem("updatedOrder")) : "";

// show confremation on update/Add payment
(sessionStorage.getItem("deleteorder")) ? (swal("Congratulations!", "Order is been deleted ..", "success"), sessionStorage.removeItem("deleteorder")) : "";

orders.forEach((element: any, i: number) => {

  $("#listing").append(`
        <tr class='text-center'>
        <td>${i + 1}</td>
        <td  >${element.orderId}</td>
        <td >${element.productId}</td>
        <td>${element.userId}</td>
        <td>${element.quantity}</td>
        <td width='270px'>${element.ShippingAddress}</td>
        <td>${element.contactNo}</td>
        <td>${element.TotalAmount}</td>
        <td id='statustd_${element.id}'>
        <select class='border border-2 py-1 border-primary rounded orderstatus' name="status" id="status_${element.id}">
        <option value="In process">In process</option>
        <option value="Pending">Pending</option>
        <option value="Ready for dispatch">Ready for dispatch</option>
        <option value="Dispatched">Dispatched</option>
        <option value="Out for Delivery">Out for Delivery</option>
        <option value="Delivered">Delivered</option>
        </select>
        </td>
        <td><a class='btn btn-danger delete' id='del_${element.id}' >Delete</a>
        <a class='btn btn-warning ms-3 update' id='upd_${element.id}'  data-bs-toggle="modal" data-bs-target="#staticBackdrop" >Update</a></td>
        </tr>
    `);

  $(`#status_${element.id}`).find(`option[value="${element.status}"]`).attr("selected", true);
});

// Ajax call to change the Status.
$(document).on("change", '.orderstatus', function () {
  let id = this.id.split("_")[1];
  let status: object = {
    'status': $(`#${this.id}`).val()
  }
  $(`#statustd_${this.id}`).html(`
  <div class="d-flex justify-content-center">
    <div class="spinner-border" role="status">
      <span class="sr-only"></span>
    </div>
  </div>
  `);
  $.ajax({
    type: "post",
    url: `http://larevel.localhost/public/api/orders/status/UpdatingStatusById-${id}`,
    data: status,
    success: function (response) {

      var result = JSON.stringify(response);
      if (response.status) {
        $("#message").html(`Congrats !.. your Status is Updated..`);
        sessionStorage.setItem("updatedStatus", JSON.stringify(result));
        window.location.href = "viewAllOrders.html";
      }
    }
  });

});

// Ajax call deleting the order's.
$(document).on('click', ".delete", function () {
  var id = this.id.split("_")[1];
  $.ajax({
    type: "delete",
    url: `http://larevel.localhost/public/api/orders/DeleteOrderById-${id}`,
    success: function (response) {
      if (response.status) {
        var result = JSON.stringify(response.message);
        sessionStorage.setItem("deleteorder", JSON.stringify(result));
        window.location.href = "viewAllOrders.html";
      } else {
        toastr.error('something Wrong in deleting Order..');
      }
    }
  });
});
var upd_id: any;
// geting data to update the order's
$(document).on('click', ".update", async function () {
  upd_id = this.id.split('_')[1];
  const response = await fetch(`http://larevel.localhost/public/api/orders/GettingOrdersById-${upd_id}`);
  var ordersdata = await response.json();
  $("#ShippingAddress").val(ordersdata.ShippingAddress);
  $("#contactNo").val(ordersdata.contactNo);
  $("#quantity").val(ordersdata.quantity);
  $(`#updstatus`).find(`option[value="${ordersdata.status}"]`).attr("selected", true);
});

// Ajax call to update the order's.
$(document).on('submit', '#updateOrders', (e) => {
  e.preventDefault();
  var error = false;
  var ShippingAddress = $("#ShippingAddress").val()
  if (ShippingAddress == '') {
    e.preventDefault();
    error = true;
    $("#ErrShippingAddress").html("<span class='text-danger'>This feild is required..*</span>")
  } else {
    $("#ErrShippingAddress").html("<span class='text-success'></span>")
  }
  var contactNo = $("#contactNo").val()
  if (contactNo == '') {
    e.preventDefault();
    error = true;
    $("#ErrcontactNo").html("<span class='text-danger'>This feild is required..*</span>")
  } else {
    $("#ErrcontactNo").html("<span class='text-success'></span>")
  }
  var quantity = $("#quantity").val()
  if (quantity == '') {
    e.preventDefault();
    error = true;
    $("#Errquantity").html("<span class='text-danger'>This feild is required..*</span>")
  } else {
    $("#Errquantity").html("<span class='text-success'></span>")
  }
  var updstatus = $("#updstatus").val()
  if (updstatus == '') {
    e.preventDefault();
    error = true;
    $("#Errupdstatus").html("<span class='text-danger'>This feild is required..*</span>")
  } else {
    $("#Errupdstatus").html("<span class='text-success'></span>")
  }

  if (!error) {
    const updatedata = new FormData(this);
    updatedata.append('ShippingAddress', ShippingAddress);
    updatedata.append('contactNo', contactNo);
    updatedata.append('quantity', quantity);
    updatedata.append('updstatus', updstatus);
    $.ajax({
      method: "POST",
      url: `http://larevel.localhost/public/api/orders/UpdatingOrderById-${upd_id}`,
      data: updatedata,
      cache: false,
      processData: false,
      contentType: false,
      success: function (response) {
        if (response.status) {
          $("#message").html(`<p class='text-success'>your Account is Updated..</p>`);
          sessionStorage.setItem("updatedOrder", JSON.stringify(response.message));
          window.location.href = 'viewAllOrders.html';
        }
      },
      error: function (responce) {
        if (response.status) {
          $("#message").html(`<p class='text-success'>${JSON.stringify(response.message)}</p>`);
        }
      }

    });
  } else {
    return false;
  }
});
$(() => {
  let table = new DataTable('#table');
})
