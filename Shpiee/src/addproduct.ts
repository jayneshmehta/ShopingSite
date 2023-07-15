import typescriptLogo from './typescript.svg'
import { setupCounter } from './counter'

import { categories } from "./main";
import { ajax, htmlPrefilter } from 'jquery';
import { json } from 'stream/consumers';



categories.forEach((element) => {
    $("#category").append(`
    <option  value = '${element}' >${element}</option>
    `);
});

$(document).on("submit", "#AddProductForm", function (e):void {
    var error = false;
    var title:any = $('#title').val();
    if ( title.trim() == "") {
        $("#errtitle").html(`<span class='text-danger'>This field is required..</span>`);
        e.preventDefault();
        error = true;
    } else {
        $("#errtitle").html(``);
    }
    let description:any = $('#description').val();
    if (description.trim() == "") {
        $("#errdescription").html(`<span class='text-danger'>This field is required..</span>`);
        e.preventDefault();
        error = true;
    } else {
        $("#errdescription").html(``);
    }
    let price:any = $('#price').val()
    if (price.trim() == "") {
        $("#errprice").html(`<span class='text-danger'>This field is required..</span>`);
        e.preventDefault();
        error = true;
    } else {
        $("#errprice").html(``);
    }
    let discountPercentage:any = $('#discountPercentage').val()
    if (discountPercentage.trim() == "") {
        $("#errdiscountPercentage").html(`<span class='text-danger'>This field is required..</span>`);
        e.preventDefault();
        error = true;
    } else if (discountPercentage.trim() > 90) {
        $("#errdiscountPercentage").html(`<span class='text-danger'>Discount should between 1 - 90 %</span>`);
        e.preventDefault();
        error = true;
    } else {
        $("#errdiscountPercentage").html(``);
    }
    let stock:any = $('#stock').val()
    if (stock.trim() == "") {
        $("#errstock").html(`<span class='text-danger'>This field is required..</span>`);
        e.preventDefault();
        error = true;
    } else {
        $("#errstock").html(``);
    }

    let category:any = $('#category').val();
    if (category.trim() == "") {
        $("#category").html(`<span class='text-danger'>select any category feild is required..</span>`);
        e.preventDefault();
        error = true;
    } else {
        $("#errcategory").html(``);
    }
    let brand:any = $('#brand').val();
    if (brand.trim() == "") {
        $("#errbrand").html(`<span class='text-danger'>select any category feild is required..</span>`);
        e.preventDefault();
        error = true;
    } else {
        $("#errbrand").html(``);
    }

    let thumbnail:any = $('#thumbnail').val()
    if (thumbnail.trim() == "") {
        $("#errthumbnail").html(`<span class='text-danger'>Select at least one img its compulsary..</span>`);
        e.preventDefault();
        error = true;
    } else {
        $("#errthumbnail").html(``);
    }

    let images:any = $('#images').val(); 
    if (images.trim() == "") {
        $("#errimages").html(`<span class='text-danger'>Select at least one img its compulsary..</span>`);
        e.preventDefault();
        error = true;
    } else {
        $("#errimages").html(``);
    }
    
    if (!error) {
        e.preventDefault();
        const formData = new FormData(this);
        formData.append("rating", '0');
        $("#message").html(`
            <div class="spinner-border text-primary " role="status">
            <span class="sr-only"></span>
            </div>
        `);
        $.ajax({
            type: "POST",
            url: "http://larevel.localhost/public/api/products",
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            success: function (response) {
                console.log(response);
                
                var result = JSON.stringify(response.productDetails); 
                if (response.status) {
                    $("#message").html(`Congrats !.. your Product is added..`);
                    sessionStorage.setItem("newProduct",JSON.stringify(result));
                    window.location.href = "index.html";
                }
            }
        });
    }
});


$(function () {
    // Multiple images preview in browser
    var imagesPreview = function (input, placeToInsertImagePreview) {

        if (input.files) {
            var filesAmount = input.files.length;
            
            $(placeToInsertImagePreview).html(``);
            for (let i = 0; i < filesAmount; i++) {
                console.log(filesAmount);
                var reader = new FileReader();
                reader.onload = function (event) {
                    $(placeToInsertImagePreview).append(`<img class=' border border-2 border-dark rounded p-1' src="${event.target.result}" width ='100px' height="70px" alt="" srcset="" >`);
                }
                reader.readAsDataURL(input.files[i]);
            }
        }
    };
    $(document).on('change', "#images", function () {
        imagesPreview(this, '#image_src');
    });

    $(document).on('change', "#thumbnail", function () {
        imagesPreview(this, '#thumbnail_prev');
    });

});

