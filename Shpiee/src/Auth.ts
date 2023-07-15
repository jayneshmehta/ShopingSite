import typescriptLogo from './typescript.svg'
import { setupCounter } from './counter'

//check user
if(sessionStorage.getItem('User')){
    $('#auth').addClass("d-none");
    window.location.href = 'index.html';
}

//Sign in Function
$(document).on('click', "#sign_in", function (e): boolean {
    var error = false;
    let validationemail:any = $("#email").val();
    if (validationemail.trim() == "") {
        error = true;
        $("#errEmail").html('Email is required..');
        e.preventDefault();
    }
    let validationpassword:any = $("#password").val();
    if (validationpassword.trim() == "") {
        error = true;
        $("#errPassword").html('Password is required..');
        e.preventDefault();
    }

    if (error) {
        return false;
    } else {
        var email:any = $("#email").val();
        var password:any = $("#password").val();
        $("#errEmail").html();
        $("#errPassword").html();
        $("#message").html(`
        <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>`);
        var form = new FormData();
        form.append("email", email);
        form.append("password", password);

        var settings:object = {
            "url": "http://larevel.localhost/public/api/login",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settings).done(function (response) {
            let responcedata = JSON.parse(response);
            console.log(responcedata.status);
            if (responcedata.status) {
                $("#message").html(`<p class='text-success'>Login Successfull..!</p>`);
                var userdata = JSON.stringify(responcedata.user);
                sessionStorage.setItem('User', userdata);
                window.location.href = 'index.html';
            }else{
                $("#message").html(`<p class='text-danger'>Email and passsword doen't matched..!</p>`);
            }
        });
        
        $.ajax(settings).fail(function (response) {
            var error = JSON.parse(response.responseText);
            console.log(error)
            if (!error.status) {
                $("#message").html(`<p class='text-danger'>Email and passsword doen't matched..!(Try again...)</p>`);
            }
        });

        return true;
    }
});

//Sign up Function
$(document).on('click', "#sign_up", function (e): boolean {

    var error = false;
    let validname:any = $("#name").val();
    if ( validname.trim() == "") {
        error = true;
        $("#errName").html('Name is required..');
        e.preventDefault();
    }
    let validcontact:any = $("#contact").val();
    if (validcontact.trim() == "") {
        error = true;
        $("#errContact").html('Contact No. is required..');
        e.preventDefault();
    }
    let validEmail:any = $("#email").val()
    if (validEmail.trim() == "") {
        error = true;
        $("#errEmail").html('Email is required..');
        e.preventDefault();
    }
    let validpassword:any = $("#password").val();
    if (validpassword.trim() == "") {
        error = true;
        $("#errPassword").html('Password is required..');
        e.preventDefault();
    }

    if (error) {
        return false;
    } else {

        var name:any = $("#name").val();
        var contact:any = $("#contact").val();
        var email:any = $("#email").val();
        var password:any = $("#password").val();
        $("#errName").html();
        $("#errContact").html();
        $("#errEmail").html();
        $("#errPassword").html();
        $("#message").html(`
        <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>`);
        $("#sign_up").addClass('disabled');
        var form = new FormData();
        form.append("name", name);
        form.append("contactNo", contact);
        form.append("email", email);
        form.append("password", password);

        var settings:object = {
            "url": "http://larevel.localhost/public/api/register",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settings).done(function (response) {
            let responcedata = JSON.parse(response);
            console.log(responcedata);
            if (responcedata.status) {
                $("#message").html(`<p class='text-success'>your Account is Created..</p>`);
                window.location.href = 'login.html';
            }
        });
        $.ajax(settings).fail(function (response) {
            var error = JSON.parse(response.responseText);
            if (!error.status) {
                $("#sign_up").removeClass('disabled');
                $("#message").html(`<p class='text-danger'>${error.errors.email}</p>`);
            }
        });
    }
    return true;
});

