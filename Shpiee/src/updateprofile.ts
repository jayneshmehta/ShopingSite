import typescriptLogo from './typescript.svg'
import { setupCounter } from './counter'


//check user
if (!sessionStorage.getItem('User')) {
    $('#auth').addClass("d-none");
    window.location.href = 'login.html';
} else {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;
    let urlid: any = searchParams.get('user');
    var userId = parseInt(atob(urlid));
    if( isNaN(userId)){
        let user: any = sessionStorage.getItem('User');
        user = JSON.parse(user);
        var userid: number = user.id;
    }else{
        userid = userId;
    }
    
    const userdatas: any = await fetch(`http://larevel.localhost/public/api/user/GettingUserById-${userid}`);
   
    let userdata = await userdatas.json();

    $("#name").val(userdata.name);
    $("#contactNo").val(userdata.contactNo);
    $("#email").val(userdata.email);
    $("#password").val(userdata.password);
    $("#address").val(userdata.address);
    if (userdata.profile != null) {
        $("#prevprofile").attr("src", `${userdata.profile}`);
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

    if (userdata.address != null) {
        $("#address").html(`${userdata.address}`);
    }

}

//update Function
$(document).on('submit', "#update", function (e): boolean {
    e.preventDefault();
    var error = false;
    let validname: any = $("#name").val();
    if (validname.trim() == "") {
        error = true;
        $("#errName").html('Name is required..');
        e.preventDefault();
    }
    let validcontact: any = $("#contactNo").val();
    if (validcontact.trim() == "") {
        error = true;
        $("#errContact").html('Contact No. is required..');
        e.preventDefault();
    }
    let validEmail: any = $("#email").val()
    if (validEmail.trim() == "") {
        error = true;
        $("#errEmail").html('Email is required..');
        e.preventDefault();
    }
    let validpassword: any = $("#password").val();
    if (validpassword.trim() == "") {
        error = true;
        $("#errPassword").html('Password is required..');
        e.preventDefault();
    }

    if (error) {
        return false;
    } else {

        $("#errName").html();
        $("#errContact").html();
        $("#errEmail").html();
        $("#errPassword").html();

        $("#message").html(`
        <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>`);
        $("#sign_up").addClass('disabled');
        var form = new FormData(this);

        $.ajax({
            "url": `http://larevel.localhost/public/api/update/UpdateUserbyid-${userid}`,
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

