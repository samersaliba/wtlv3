  $(function () {
    var user={};
	if (typeof(Storage) !== "undefined") {
		// Code for localStorage/sessionStorage.
		if (sessionStorage.user) {
			user = JSON.parse(sessionStorage.user);
			if (user.rememberme) {
				$('.login-box-body').prepend('<p class="login-box-msg"><img src="/admin/res/img/' + user.image + '" class="img-circle user_image" alt="User Image"></p>');
				$("input[name=username]").val(user.username);
			}
			$("input[name=rememberme]").prop('checked', user.rememberme);
			
			
		}
	} else {
		// Sorry! No Web Storage support..
	}
	//if (user!='') console.log(user);
    $('input[name=rememberme]').iCheck({
      checkboxClass: 'icheckbox_square-blue',
      radioClass: 'iradio_square-blue',
      increaseArea: '20%' /* optional */
    });
	/*
	.on('ifChanged',function() {
		console.log('check');
        if(this.checked) {
            localStorage.rememberme = true;
            //$(this).prop("checked", returnVal);
        } else {
			localStorage.rememberme = false;
		}
    });
	*/
	$('#loginForm').ajaxForm({
		dataType: 'json',
		url: '/admin/script/',
		method: "POST",
		data: {action:'login'},
		beforeSubmit: function(arr, $form, options){
			//return $form.parsley().isValid()
			//console.log("submit form");
			},
		error: function(e,error,errorText,o){
			Swal.fire({icon: 'error',title: "Error",text: error + ": Check with administrator!" });
			console.log(e.responseText);
			},
		success: function(data){
			//console.log("submited form");

			if(data.status) {
				window.location.href = "/admin/pages/"; 
			} else {
				Swal.fire({icon: 'error',title: 'Error',text: data.msg});
				//console.log(data);
			}
		} 
	});

	
  });

