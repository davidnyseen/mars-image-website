
(function () {
    //import {errorHandler } from 'global-scripts.js';

    const APIKEY = 'c7nM6QHFXKstteE5WOOeQXftczTPj3GzSxiwVn0U';
    const baseApiUrl = '/access-mars/api';
    const baseUrl = 'https://api.nasa.gov/mars-photos/api/v1';
    let cameraId = "";
    let rogerId = "";
    let dateToReceive = "";
    let manifestObj = {};
    let resImgArr = [];
    let tasksArea;
    let savedImageCarosol;
    let savedImg = [];
    let savedImagesArea;
    let ResponseVisual;

    //let showError=errorHandler().showError();

    /**
     * roger details
     */
    class manifest {
        constructor(landing_date, max_date, max_sol, name) {
            this.landing_date = landing_date;
            this.max_date = max_date;
            this.max_sol = max_sol;
            this.name = name;
        }
    }

    /**
     * imag details
     */
    class img {
        constructor(img_src, earthDate, sol, roverName, camera, id) {
            this.imageSorce = img_src;
            this.earthDate = earthDate;
            this.solDate = sol;
            this.roger = roverName;
            this.camera = camera;
            this.catID = id;
        }
    }

    //page settings
    document.addEventListener('DOMContentLoaded', function () {
        tasksArea = document.getElementById("tasks-area");
        savedImageCarosol = document.getElementById("savedImageCarosol");
        savedImagesArea = document.getElementById("savedImages");
        document.querySelector("#getDataButton").addEventListener("click", getData);
        document.querySelector("#clearButton").addEventListener("click", clearButton);
        document.getElementById("carouselButton").addEventListener("click", (e) => {
            document.getElementById("imgCarousel").classList.toggle("d-none");
        });
        document.getElementById('daleteButton').addEventListener('click',deleteAllImages )
        ResponseVisual = document.querySelector("#responseVisual");
        cameraId = document.getElementById("cameraId");
        rogerId = document.getElementById("rogerId");
        dateToReceive = document.getElementById("dateToReceive");
        document.getElementById('dateToReceive').addEventListener('keypress', clearError);
        for (const field of document.getElementsByClassName('form-control'))
            field.addEventListener('click', clearError);
        getAllManifest();
        rogerId.addEventListener('click', clearDateErrors);
        document.getElementById("logOut").addEventListener('click',()=>window.location.href = `${baseApiUrl}/log-out`);
        getUserData();
    });

    /**
     *Brings the user data from the server
     */
    function getUserData(){
        fetch(baseApiUrl + '/search/rovers/user-information')
            .then(status)
            .then(res => res.json())
            .then(res => {
                setUserData(res);
            })
            .catch(()=>{

            });
    }

    /**
     *Embed the user data in their place
     */
    function setUserData(object){
        document.getElementById("userName").innerText = object.fullName.firstName+' '+object.fullName.lastName;
        for(const image of object.images){
            addImageToDOM(image);
        }
    }

    /**
     *
     */
    function clearButton(e){
        tasksArea.innerHTML='';
        clearFormFunction();
    }

    /**
     *Improves the page by emptying the saved list
     */
    function atEmptyList(){
        if(savedImagesArea.childNodes.length ===0) {
            document.getElementById("carouselButton").disabled = true; //disable the caruosol
            document.getElementById("daleteButton").disabled = true; //disable the button
        }
    }

    /**
     *sends delete command to server, make it on page 
     */
    function deleteAllImages(){
        const savingResponseVisual = document.getElementById('savingResponseVisual');
        savingResponseVisual.classList.remove('d-none');
        fetch(baseApiUrl+`/deleteAll`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        }).then(status)
            .then(res => res.json())
            .then(res => {
                console.log(res)
                savingResponseVisual.classList.add('d-none');
                /*if (res!==true)
                    throw ("error");*/
                savedImagesArea.innerHTML ='';
                atEmptyList();
            })
            .catch((err) => {
                console.log(err);
                savingResponseVisual.classList.add('d-none');
                openWarningModal(
                    `<p> can't delete saved image</p><p>${err.message}</p>`);
            })
    }

    /**
     * reset and remove error sins from element
     * @param e a input HTML element
     */
    function clearError(e) {
        e.target.classList.remove("is-invalid");
        e.target.nextElementSibling.innerHTML = "";
    }

    /**
     * reset the error signs from date input.
     * it is needed cecaue we have to use it by clicking another element
     */
    function clearDateErrors() {
        dateToReceive.classList.remove("is-invalid");
        dateToReceive.nextElementSibling.innerHTML = "";
    }

    /**
     * adding a image card to pagh with all its parts
     */
    function crtCard() {
        tasksArea.innerHTML = "";
        for (let arr of resImgArr) {
            tasksArea.innerHTML +=
                `<div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-3 " style="display: inline-block;column-break-inside: avoid;">
                    <div class="card" style="/*max-width: 18rem;*/ height: auto">
                        <img class="card-img-top img-fluid " src="${arr.imageSorce}" alt="Card image cap">
                        <div class ="card-body">
                            <p class ="card-text">earthDate ${arr.earthDate}</p>
                            <p class ="card-text">sol ${arr.solDate}</p>
                            <p class ="card-text">misson ${arr.roger}</p>
                            <p class ="card-text">camera ${arr.camera}</p>
                            <a clas s="btn btn-primary m-1" onclick="window.open('${arr.imageSorce}', '_blank', 'location=yes,scrollbars=yes,status=yes');">
                                Full Size
                            </a>
                            <a href="#" class="btn btn-primary m-1" id="${arr.imageSorce}">save</a>
                        </div>
                    </div>
                </div>`
        }
        for (let a of resImgArr) {
            let s = document.getElementById(`${a.imageSorce}`)
            s.addEventListener("click", saveImg);
        }
    }

    function openWarningModal(content) {
        document.getElementById('modalMassage').innerHTML =content;
        let myModal = new bootstrap.Modal(document.getElementById('warningMassage'), {keyboard: false});
        myModal.show();
    }

    /**
     *
     * @param date got a Date object
     * @returns {string} the date as yyyy-mm-dd
     */
    function addToAccount(imageData) {
        const savingResponseVisual = document.getElementById('savingResponseVisual');
        savingResponseVisual.classList.remove('d-none');
        fetch(baseApiUrl + '/save-image', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(imageData)
        }).then(status)
            .then(res => res.json())
            .then(res => {
                savingResponseVisual.classList.add('d-none');
                console.log(res)
                if (res === true)
                    addImageToDOM(imageData);
            })
            .catch((err) => {
                console.log(err);
                savingResponseVisual.classList.add('d-none');
                openWarningModal(
                    `<p> can't add this image to saved image</p><p>${err.message}</p>`);
            })
    }

    /**
    *!no used now
    * it have to catch andreport the failed of save image etc
    */
    function saved_imageError_handler(error){
        
    }

    /**
     *add image to list of asaved, and caruosol
     * @param imageData got the imaje details
     */
    function addImageToDOM(imageData){
        savedImagesArea.innerHTML +=
            `<li id="${imageData.catID}">
                    <button type="button" class="btn btn-outline-info btn-sm ">delete</button>
                    <a class="link-primary" onclick="window.open('${imageData.imageSorce}', '_blank', 
                    'location=yes,scrollbars=yes,status=yes');">
                     image ${imageData.catID}</a>               
                     <br />
                    <p> earth Date: ${imageData.earthDate}, sol: ${imageData.solDate}, 
                    rover Name: ${imageData.roger}, camera: ${imageData.camera}</p>
                </li>`
        addToCarosol(imageData);
        for(const ele of savedImagesArea.childNodes) {
            ele.firstElementChild.addEventListener('click', deleteSavedImage);
        }
        //savedImagesArea.lastElementChild.firstElementChild.addEventListener('click', deleteSavedImage);
        document.getElementById("carouselButton").disabled = false; //enable the caruosol
        document.getElementById("daleteButton").disabled = false; 
    }

    /**
     *to handle removeing saved image feom DB and after then from list
     * @param e, the button n the list item
     */
    function deleteSavedImage(e){
        const savingResponseVisual = document.getElementById('savingResponseVisual');
        savingResponseVisual.classList.remove('d-none');
        fetch(baseApiUrl+`/${e.target.parentElement.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            //body: JSON.stringify(e.target.parentElement.id)
        }).then(status)
            .then(res => res.json())
            .then(res => {
                console.log(res)
                savingResponseVisual.classList.add('d-none');
                /*if (res!==true)
                    throw ("error");*/
                e.target.parentElement.remove();
                atEmptyList();
            })
            .catch((err) => {
                console.log(err);
                savingResponseVisual.classList.add('d-none');
                openWarningModal(
                    `<p> can't delete this image to saved image</p><p>${err.message}</p>`);
            })
    }
    /**
     * add a presses image to saved list and saved array
     * @param e. abuuton with an imagh sorce id
     */
    function saveImg(e) {
        /*for (const a of savedImg) { // if we have picture saved.
            if (a.imageSorce == e.target.id) {
                openModal();
                return;
            }
        }*/
        for (const a of resImgArr) {
            if (a.imageSorce === e.target.id) {  //we found the asked image details
               addToAccount(a);
                //savedImg.push(a); //save img
            }
        }
    }

    /**
     *add a image to bootstrap caruosol
     * @param image a local object with image details
     */
    function addToCarosol(image) {
        const activeClass = (savedImageCarosol.innerHTML === "") ? "active" : ""
        savedImageCarosol.innerHTML += `<div class="carousel-item ${activeClass}">\n` +
            `          <img class="d-block w-100 mg-fluid" src="${image.imageSorce}" alt="${image.roger} ${image.earthDate}">\n` +
            `<div class="carousel-caption d-md-block "><div class="bg-light opacity-50"><button class="btn btn-secondary" onclick="window.open('${image.imageSorce}', '_blank', 
                    'location=yes,scrollbars=yes,status=yes');">
                     full size</button><h5 style="color: black">${image.catID}</h5>  </div>     ` +
            `        </div>                                                                `;
    }

    /**
     *gets a json response from NASA and stored the data in a js array
     * @param res the feeching resolt with all image arr got
     * @returns {boolean} if thre is any image on response
     */
    function setImg(res) {
        if (res.photos.length == 0) {
            tasksArea.innerHTML = "<div class='col-12' style='color: darkgray; border-color: gray; font-size: xx-large'>no image found</div>"
            console.log("no image found");
            return false;
        }
        for (const a in res.photos) {
            resImgArr.push(new img(res.photos[a].img_src, res.photos[a].earth_date,
                res.photos[a].sol, res.photos[a].rover.name, res.photos[a].camera.name, res.photos[a].id))
        }
        return true;
    }

    /**
     *det a json roger manifest and create a manifest(class) with the needed parameter.
     * puts them into an object, named with its name
     * @param json with roger manifest
     */
    function crtManifest(json) {// create class manifest info, landing_date, max_sol, rojer name
        /*manifestArr.push(new manifest(json.photo_manifest.landing_date,
            json.photo_manifest.max_date, json.photo_manifest.max_sol,
            json.photo_manifest.name));*/
        manifestObj[json.photo_manifest.name] = (new manifest(json.photo_manifest.landing_date,
            json.photo_manifest.max_date, json.photo_manifest.max_sol,
            json.photo_manifest.name));

    }

    /*const getDate = () => {
        const date = new Date();
        return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`
    }*/

    /**
     *
     * @param date got a Date object
     * @returns {string} the date as yyyy-mm-dd
     */
    function formatDate(date) {
        let month = '' + (date.getMonth() + 1);
        let day = '' + date.getDate();
        let year = date.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    /**
     *checks the response of fetch
     * @param response
     * @returns {Promise<never>|Promise<unknown>}
     */
    function status(response) {
        if (response.status ===401) {
            openWarningModal(
                '<p>You are out an account. please <a href="/logIn">log-in </a></p>'
            );
            return Promise.resolve(response);
        }
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            console.log(("error status"));
            return Promise.reject(new Error(response.statusText))
        }
    }

    /**
     *cell the #getManifest function for each roger
     */
    function getAllManifest() {
        getManifest("Curiosity");
        getManifest("Opportunity");
        getManifest("Spirit");
        //console.log( manifestObj);
    }

    /**
     *will cell if the grtting manifast not completing
     */
    function errorManifestHandler(error) {
        let myModal = new bootstrap.Modal(document.getElementById('notconnecingModal'), {
            backdrop: 'static',
            keyboard: false
        });
        myModal.show();
    }

    /**
     *fetch from NASA the Details and Limitations of to got images from a roger
     * @param rogerName a specific roger
     */
    function getManifest(rogerName) { // for validation perpuses get maxSol etc
        fetch(baseUrl + '/manifests/' + rogerName + '?api_key=' + APIKEY)
            .then(status)
            .then(res => res.json())
            .then(res => crtManifest(res))
            .catch(errorManifestHandler);
    }

    /**
     *edit the addres of json of mars imagge according the input
     * @returns {string} to fetch from NASA server
     */
    function setSubmitUrl() {
        let datevalue;
        if (dateToReceive.value.search("-") >= 0) {
            datevalue = "earth_date=" + dateToReceive.value;
        } else {
            datevalue = "sol=" + dateToReceive.value;
        }
        let camera = "&camera=" + cameraId.value;
        return baseApiUrl + `/search/rovers/${rogerId.value}/photos?${datevalue}${camera}`
    }

    /**
     *checks if th input no empty and display if it is
     * @param inputField a HTML input element
     * @returns {boolean} if it contain any value
     */
    const notEmptyValidate = function (inputField) {
        if (inputField.value.length === 0) {
            showError(inputField, `please enter a ${inputField.previousElementSibling.innerText} value`)
            return false;
        }
        return true;
    };

    /**
     *checks if GLOBAL date input is valid according to any option, and if it mutch thr roger imitations
     * @returns {boolean}
     */
    const dateValidator = function () {
        if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(dateToReceive.value))//|| /^[0-9]+$/.test(dateToReceive.value))
        {
            const maxDate = new Date(manifestObj[rogerId.value].max_date);
            const laandingDate = new Date(manifestObj[rogerId.value].landing_date);
            console.log(new Date(dateToReceive.value));
            const date = new Date(dateToReceive.value);
            if (date == "Invalid Date") {
                showError(dateToReceive, `please. enter a valid date `);
                return false;
            }
            if (new Date(dateToReceive.value) >= laandingDate && new Date(dateToReceive.value) <= maxDate)
                return true;
            else {
                showError(dateToReceive, `please. to use the ${rogerId.value} roger, enter date between ${formatDate(laandingDate)} and ${formatDate(maxDate)}`);
                return false;
            }
        } else if (/^[0-9]+$/.test(dateToReceive.value)) {
            const solDate = parseInt(dateToReceive.value);
            const maxSolDate = manifestObj[rogerId.value].max_sol;
            if (solDate > 0 && solDate <= maxSolDate)
                return true;
            else {
                showError(dateToReceive, `please. to use the ${rogerId.value} roger, enter a sol day between ${1} and ${maxSolDate}`);
                return false;
            }
        } else {
            showError(dateToReceive, `please, enter a valid date. sol day, or yyyy-mm-dd`);
            return false;
        }
    };

    /**
     *validate the inputs according the ruls, during specific functions
     * @returns {boolean} if all arr true
     */
    const validate = function () {
        resetErrors();
        const a = notEmptyValidate(rogerId);
        const b = notEmptyValidate(dateToReceive) && a && dateValidator(); //if the rogher it no select, no check the date etails
        const c = notEmptyValidate(cameraId);
        return (a && b && c)
    };

    /**
     *got the answers from NASA according to users input
     */
    function getData() { // main function
        if (!validate())
            return;
        ResponseVisual.classList.remove("d-none"); //setSubmitUrl(); // for getting the url
        fetch(setSubmitUrl())
            .then(status)
            .then(res => res.json())
            .then(res => {
                resImgArr = [];
                if (setImg(res))
                    crtCard(); // print card
                ResponseVisual.classList.add("d-none");
                clearFormFunction();
            })
            .catch(error);
    }

    /**
     *
     */
    function outOfAccountError(){

    }

    /**
     *handles submit fech errrors
     * @param err the error throwed
     */
    function error(err) {
        ResponseVisual.classList.add("d-none");
        //document.querySelector("#tasks-area").innerHTML = `<p>something went wrong...try again later <br> ${err}`;
        console.log("something went wrong...try again later" + err);
    }

    /**
     reset the input values and their feedbacks
     */
    function clearFormFunction() {
        document.querySelector('form').reset();
        resetErrors();
    }

    /**
     *reset the input elements from error signs
     */
    const resetErrors = function () {
        document.querySelectorAll(".is-invalid").forEach((e) => e.classList.remove("is-invalid"));
        document.querySelectorAll(".errormessage").forEach((e) => e.innerHTML = "");
    }

    /**
     *show and signed no valid inputs
     * @param inputElement got a HTML input element
     * @param massage a string to add bellow the input element
     */
    function showError(inputElement, massage) {
        inputElement.nextElementSibling.innerHTML += `<div><small>${massage}</small></div>`;
        inputElement.classList.add("is-invalid");
    }
})();
