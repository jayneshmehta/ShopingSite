import DataTable from "datatables.net-dt";
import swal from 'sweetalert';
import { products } from "./addata";

const response = await fetch("http://larevel.localhost/public/api/products");
var product:object[] = await response.json();


// show confremation on update/Add payment
if (sessionStorage.getItem("updatedProduct")) {
    swal("Congratulations!", "Product is been updated ..", "success");
    sessionStorage.removeItem("updatedProduct");
  }

// show confremation on update/Add payment
if (sessionStorage.getItem("deleteProduct")) {
    swal("Congratulations!", "Product is been deleted ..", "success");
    sessionStorage.removeItem("deleteProduct");
  }


product.forEach((element:products|any, i:number) => {
    $("#listing").append(`
        <tr class='text-center'>
        <td width='200px' class=" border border-dark border-2 " >${i+1}</td>
        <td width='200px'  class=" border border-dark border-2 "  >${element.title}</td>
        <td width='600px' class=" border border-dark border-2 " >${element.description}</td>
        <td class=" border border-dark border-2 " >${element.price}</td>
        <td class=" border border-dark border-2 " >${element.category}</td>
        <td class=" border border-dark border-2 " ><a class='btn btn-danger delete' id='del_${element.id}' >Delete</a><a class='btn btn-warning ms-3' id='upd_${element.id}' href='updateproduct.html?product=${btoa(element.id)}' >Update</a></td>
        </tr>
    `);
});

$(()=>{
    let table = new DataTable('#table');
})

$(document).on('click', ".delete", function () {

    var id = this.id.split("_")[1];

    $.ajax({
        type: "delete",
        url: `http://larevel.localhost/public/api/products/DeletingProductById-${id}`,
        success: function (response) {
            if (response.status) {
                var result = JSON.stringify(response.message);
                sessionStorage.setItem("deleteProduct", JSON.stringify(result));
                window.location.href = "viewAllproduct.html";
            }
        }
    });

});