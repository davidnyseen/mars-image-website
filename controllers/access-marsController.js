const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const db = require('../models');

exports.getAllAPI = function (req, res, next) {
    res.redirect('/');
}

exports.checkAllows = function (req, res, next) {
    if(req.session.loggedin) {
        console.log("session.loggedin");
        next();
    }
    else
        res.status(401).send({msg:"this session is out of an account"});
}
exports.saveImages = function (req, res, next) {
    return db.marsImage.findOne({where: {catID:req.body.catID}})
        .then((result)=>{
            if(result!== null)
                return res.status(201).send({msg:"this image is already saved"});
            else
                db.marsImage.create( {catID:req.body.catID,
                imageSorce:req.body.imageSorce,earthDate:req.body.earthDate,solDate:req.body.solDate,
                roger:req.body.roger,camera:req.body.camera,email:req.session.account} )
        })
        .then((record) => {
            return res.status(200).send(true)})
        .catch((err) => {
            console.log('*** error creating a saved image', JSON.stringify(err))
            return res.status(400).send("error creating a saved image")
        })
}
exports.deleteAll = function (req, res, next) {
    return db.marsImage.destroy({
        where: {},
        truncate: true})
        .then(() => res.send(true))
        .catch((err) => {
            console.log('***Error deleting image', JSON.stringify(err))
            res.status(400).send(err)
        })
}
exports.deleteSome = function (req, res, next) {
    return db.marsImage.findOne({where: {catID: req.params.catid}})
        .then((image) => image.destroy({ force: true }))
        .then(() => res.send(true))
        .catch((err) => {
            console.log('***Error deleting image', JSON.stringify(err))
            res.status(400).send(err)
        })
}
exports.search = function (req, res, next) {
    const APIKEY = 'c7nM6QHFXKstteE5WOOeQXftczTPj3GzSxiwVn0U';
    const baseUrl = 'https://api.nasa.gov/mars-photos/api/v1';
        /*if (!validate())
            return;*/
    let url;
        if(req.query.earth_date)
             url =(baseUrl+`/rovers/${req.params.rover}/photos?earth_date=${req.query.earth_date.trim()}&camera=${req.query.camera}&api_key=${APIKEY}`);
        else if(req.query.sol)
             url =(baseUrl+`/rovers/${req.params.rover}/photos?sol=${req.query.sol}&camera=${req.query.camera.trim()}&api_key=${APIKEY}`);

    //console.log(url);
        fetch(url)
            .then(status)
            .then(innerRes => innerRes.json())
            .then(innerRes => {/*console.log(innerRes,"then");*/res.send(innerRes)})
            .catch((e)=>{
                res.status(500).send("")
            });

}
exports.logOut = function (req, res, next) {

    req.session.loggedin = false;
    res.redirect('/logIn');
}

exports.sendUserInformation = function (req, res, next) {
    let userData={};
    db.User.findOne({where: {email: req.session.account}, attributes: ['firstName', 'lastName']})
        .then((userName) => {
            userData["fullName"] = userName.dataValues;
        }).then(() => {
            db.marsImage.findAll({where: {email: req.session.account}, attributes: ['catID',
                    'roger','camera','earthDate','solDate','imageSorce']}).then((images) => {
                console.log(images);
                userData["images"] = images;
                res.send(userData);
            })
        }).catch((err) => {
            console.log('There was an error querying user data', JSON.stringify(err))
            return res.status(500).send('There was an error querying user data');
        });
}

/**
 *checks the response of fetch
 * @param response
 * @returns {Promise<never>|Promise<unknown>}
 */
function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}

