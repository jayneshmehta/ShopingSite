import typescriptLogo from './typescript.svg'
import { setupCounter } from './counter'


//check user
if (!sessionStorage.getItem('User')) {
    $('#auth').addClass("d-none");
    window.location.href = 'login.html';
}

$(function () {
    // Multiple images preview in browser
    var imagesPreview = function (input, placeToInsertImagePreview) {

        if (input.files) {
            var filesAmount = input.files.length;

            $(placeToInsertImagePreview).html(``);
            for (let i = 0; i < filesAmount; i++) {
                var reader = new FileReader();
                reader.onload = function (event) {
                    $(placeToInsertImagePreview).attr({ 'src': `${event.target.result}` });
                }
                reader.readAsDataURL(input.files[i]);
            }
        }
    };
    $(document).on('change', "#profile", function () {
        imagesPreview(this, '#prevprofile');
    });

});

//update Function
$(document).on('submit', "#adduser", function (e): boolean {
    e.preventDefault();
    var error = false;
    let validname: any = $("#name").val();
    if (validname.trim() == "") {
        error = true;
        $("#errName").html('Name is required..');
        e.preventDefault();
    } else {
        $("#errName").html('');
    }
    let validcontact: any = $("#contactNo").val();
    if (validcontact.trim() == "") {
        error = true;
        $("#errContact").html('Contact No. is required..');
        e.preventDefault();
    } else {
        $("#errContact").html('');
    }
    let validEmail: any = $("#email").val()
    if (validEmail.trim() == "") {
        error = true;
        $("#errEmail").html('Email is required..');
        e.preventDefault();
    } else {
        $("#errEmail").html('');
    }
    let validpassword: any = $("#password").val();
    if (validpassword.trim() == "") {
        error = true;
        $("#errPassword").html('Password is required..');
        e.preventDefault();
    } else {
        $("#errPassword").html('');
    }

    if (error) {
        return false;
    } else {


        $("#message").html(`
        <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>`);
        // $("#add").addClass('disabled');
        var form = new FormData(this);

        $.ajax({
            "url": `http://larevel.localhost/public/api/adduser`,
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form,
            success: function (response) {
                response = JSON.parse(response);
                if (response.status) {
                    $("#message").html(`<p class='text-success'>your Account is Updated..</p>`);
                    window.location.href = 'profile.html';
                }
            }
        });
    }
    return true;
});

