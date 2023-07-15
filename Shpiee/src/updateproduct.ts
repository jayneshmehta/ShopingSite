import typescriptLogo from './typescript.svg'
import { setupCounter } from './counter'
import { products } from './addata'
import { categories } from "./main";
import { ajax, htmlPrefilter } from 'jquery';
import { json } from 'stream/consumers';

const url = new URL(window.location.href);
const searchParams = url.searchParams;
let urlid: any = searchParams.get('product');
var productId = parseInt(atob(urlid));


const response = await fetch(`http://larevel.localhost/public/api/products/GettingProductById-${productId}`);
var product: products = await response.json();
console.log(product);

$('#title').val(product.title)
$('#description').val(product.description)
$('#brand').val(product.brand)
$('#price').val(product.price)
$('#discountPercentage').val(product.discountPercentage)
$('#rating').val(product.rating)
$('#stock').val(product.stock)
$('#thumbnail_img').attr('src', product.thumbnail);
let images: any = product.images;
images = images.split(',');
console.log(images);

images.forEach((element: string) => {
    $("#image_src").append(`
    <img class=' border border-2 border-dark rounded p-1' src="${element}" width ='100px' height="70px" alt="" srcset="" >
    `);
});

categories.forEach((element) => {
    if (element == product.category) {
        $("#category").append(`<option  value = '${element}' selected>${element}</option>`);
    } else {
        $("#category").append(`<option  value = '${element}' >${element}</option>`);
    }
});

$(document).on("submit", "#AddProductForm", function (e) {
    var error = false;
    let title: any = $('#title').val();
    (title.trim() == "")
        ? ($("#errtitle").html(`<span class='text-danger'>This field is required..</span>`), e.preventDefault(), error = true)
        : $("#errtitle").html(``);

    let description: any = $('#description').val();
    (description.trim() == "")
        ? ($("#errdescription").html(`<span class='text-danger'>This field is required..</span>`), error = true)
        : $("#errdescription").html(``);

    let price: any = $('#price').val();
    (price.trim() == "")
        ? ($("#errprice").html(`<span class='text-danger'>This field is required..</span>`), e.preventDefault(), error = true)
        : $("#errprice").html(``);

    let discountPercentage: any = $('#discountPercentage').val();
    (discountPercentage.trim() == "")
        ? ($("#errdiscountPercentage").html(`<span class='text-danger'>This field is required..</span>`), e.preventDefault(), error = true)
        : (discountPercentage.trim() > 90)
            ? ($("#errdiscountPercentage").html(`<span class='text-danger'>Discount should between 1 - 90 %</span>`), e.preventDefault(), error = true)
            : $("#errdiscountPercentage").html(``);

    let stock: any = $('#stock')?.val();
    (stock.trim() == "")
        ? ($("#errstock").html(`<span class='text-danger'>This field is required..</span>`), e.preventDefault(), error = true)
        : $("#errstock").html(``);

    ($('#category').val() == "")
        ? ($("#errcategory").html(`<span class='text-danger'>select any category feild is required..</span>`), e.preventDefault(), error = true)
        : $("#errcategory").html(``);

    let brand: any = $('#brand').val();
    (brand.trim() == "")
        ? ($("#errbrand").html(`<span class='text-danger'>select any category feild is required..</span>`), e.preventDefault(), error = true)
        : $("#errbrand").html(``);

    if (!error) {

        e.preventDefault();
        const formData = new FormData(this);
        let rating: any = product.rating;
        formData.append("rating", rating);
        $("#message").html(`
            <div class="spinner-border text-primary " role="status">
            <span class="sr-only"></span>
            </div>
        `);
        $.ajax({
            type: "post",
            url: `http://larevel.localhost/public/api/products/UpdatingProductById-${productId}`,
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            success: function (response) {
                var result = JSON.stringify(response.productDetails);
                if (response.status) {
                    $("#message").html(`Congrats !.. your Product is Updated..`);
                    sessionStorage.setItem("updatedProduct", JSON.stringify(result));
                    window.location.href = "viewAllproduct.html";
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
