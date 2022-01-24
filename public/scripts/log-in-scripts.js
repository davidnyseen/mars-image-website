import {errorHandler} from "./global-scripts.js";

(function () {

    let theform;
    document.addEventListener('DOMContentLoaded', function () {
        theform = document.getElementsByTagName("form")[0];
        theform.addEventListener('submit', logInSubmitHendler);
        for (const field of document.getElementsByClassName('form-control')){
            field.addEventListener('click', errorHandler().clearError);
        }
    });

    function logInSubmitHendler(e) {
        e.preventDefault();
        fetch('/register/api/accountAccess', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": document.getElementById("email").value,
                "password": document.getElementById("password").value
            })
        }).then(status)
            .then(function (response) {
                return response.json();
            }).then(res => {
            if (res === true)
                window.location.replace('/access-mars');
            else
                errorHandler().showError(document.getElementById("email"), "one or more user details are not correct")
        })
            .catch(fetch_error);

    }

    function status(response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(new Error(response.statusText))
        }
    }

    function fetch_error(err) {
        errorHandler().openWarningModal(
            `<p> can not lofin now with those details</p><p>${err.message}</p>`);
    }

})();