import {errorHandler} from "./global-scripts.js";

(function () {

    let theform;
    document.addEventListener('DOMContentLoaded', function () {
        theform = document.getElementsByTagName("form")[0];
        theform.addEventListener('submit', registerSubmitHendler);
        for (const field of document.getElementsByClassName('form-control')){
            field.addEventListener('click', errorHandler().clearError);
        }
    });

    function registerSubmitHendler(e) {
        e.preventDefault();
        //valdation();
        fetch('/register/api/emailavailable', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": document.getElementById("email").value
            })
        }).then(status)
            .then(function (response) {
                return response.json();
            }).then(res => {
            if (res === true)
                theform.submit();
            else
                errorHandler().showError(document.getElementById("email"), "sorry, this e-mail ia already in use")
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
            `<p> we can not regiter You now</p><p>${err.message}</p>`);
    }


})();