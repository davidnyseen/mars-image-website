import {validations, errorHandler} from "./global-scripts.js";

(function () {

    let theForm;
    document.addEventListener('DOMContentLoaded', function () {
        theForm = document.getElementsByTagName("form")[0];
        theForm.addEventListener('submit', registerSubmitHendler);
        document.getElementById('reRegisterBtn').addEventListener('click',()=>{
            window.location.replace('/register');
        })
        for (const field of document.getElementsByClassName('form-control')){
            field.addEventListener('click', errorHandler().clearError);
        }
    });

    function registerSubmitHendler(e) {
        e.preventDefault();
        console.log(theForm, theForm.pass1.value);
        if(!(validations().passwordRules(theForm.pass1.value))) {
            errorHandler().showError(document.getElementById('pass1'), 'pass needs at least 8 characters')
            return;
        }
        if(!(validations().areTheSame(theForm.pass1.value, theForm.pass2.value))) {
            errorHandler().showError(document.getElementById('pass2'), 'it do not match the prior input')
            return;
        }
        fetch('/register/api/password/confirmation', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": document.getElementById("email").value,
                "firstName": document.getElementById("firstName").value,
                "lastName": document.getElementById("lastName").value,
                "password": document.getElementById("pass1").value
            })
        }).then(status)
            .then(function (response) {
                return response.json();
            }).then(res => {
            if (res === true)
                window.location.replace('/logIn');
            else{
                throw ("Something went wrong with the input data. Try again")
            }
        })
            .catch(fetch_error);
    }

    function fetch_error(err){
        errorHandler().openWarningModal(
            `<p>Error in registry data. The user can not be registered with this data at this time.
                </p><p>${err.message}</p>`);
    }

    function status(response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            console.log(("error status"));
            return Promise.reject(new Error(response.statusText))
        }
    }

})();