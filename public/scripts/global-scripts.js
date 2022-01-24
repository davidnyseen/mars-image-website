

    
/**
*functions to handle the input erros
*/
function errorHandler (){
     /**
     * shows the user input error on html 
     */
     function showError(inputElement, massage) {
         inputElement.nextElementSibling.innerHTML += `<div><small>${massage}</small></div>`;
         inputElement.classList.add("is-invalid");
     }
     /**
     *removs the error signs if a specific input fueld
     * @param e is the event
     */
    function clearError(e){
        e.target.classList.remove("is-invalid");
        e.target.nextElementSibling.innerHTML = "";
    }
    /**
     *
     * @param content is the event
     */
    function openWarningModal(content) {
        document.getElementById('modalMassage').innerHTML =content;
        let myModal = new bootstrap.Modal(document.getElementById('warningMassage'), {keyboard: false});
        myModal.show();
    }
     return {
         showError:showError,
         clearError:clearError,
         openWarningModal:openWarningModal
     }
}
export { errorHandler };

/**
*functions to monitor input requirements
*/
function validations (){
    /**
     * cheks the 2 inputs are the same
     */
    function areTheSame(first, second) {
        return first===second;
    }
    /**
     * cheks the 2 inputs are the same
     */
    function notEmpty(value) {
        return value.trim().length>0;
    }
      /**
     * sets the security requirements of passsword
     */
    function passwordRules(pass) {
        return pass.length >=8;
    }

    return {
        areTheSame:areTheSame,
        passwordRules:passwordRules
    };

}
export { validations };
