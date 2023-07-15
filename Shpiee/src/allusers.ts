import DataTable from "datatables.net-dt";
import swal from 'sweetalert';
import { products } from "./addata";

interface users{
    profile:string;
    name:string;
    address:string;
    contactNo:string;
    email:string;
    password:string;
}


const response = await fetch("http://larevel.localhost/public/api/user/getUsers");
var users:users[] = await response.json();
console.log(users);


// // show confremation on update/Add payment
// if (sessionStorage.getItem("updatedProduct")) {
//     swal("Congratulations!", "Product is been updated ..", "success");
//     sessionStorage.removeItem("updatedProduct");
//   }

// // show confremation on update/Add payment
// if (sessionStorage.getItem("deleteProduct")) {
//     swal("Congratulations!", "Product is been deleted ..", "success");
//     sessionStorage.removeItem("deleteProduct");
//   }


  users.forEach((element:users|any, i:number) => {
    $("#listing").append(`
        <tr class='text-center'>
        <td width='100px' class=" border border-dark border-2 " >${i+1}</td>
        <td width='200px'  class=" border border-dark border-2 " ><img src='${element.profile}' alt='' width='150px' height='100px' ></td>
        <td class=" border border-dark border-2 " >${element.name}</td>
        <td width='600px' class=" border border-dark border-2 " >${element.address}</td>
        <td class=" border border-dark border-2 " >${element.contactNo}</td>
        <td class=" border border-dark border-2 " >${element.email}</td>
        <td width='220px' class=" border border-dark border-2 " ><a class='btn btn-danger delete' id='del_${element.id}' >Delete</a><a class='btn btn-warning ms-3' id='upd_${element.id}' href='updateprofile.html?user=${btoa(element.id)}' >Update</a></td>
        </tr>
    `);
});

$(()=>{
    let table = new DataTable('#table');
})

$(document).on('click', ".delete", function () {

    var id = this.id.split("_")[1];
    if(confirm("Are you sure you want to delete this user?")){
        
    $.ajax({
        type: "delete",
        url: `http://larevel.localhost/public/api/user/DeletingUserById-${id}`,
        success: function (response) {
            if (response.status) {
                var result = JSON.stringify(response.message);
                sessionStorage.setItem("deleteProduct", JSON.stringify(result));
                window.location.href = "viewAllusers.html";
            }
        }
    });
}
});