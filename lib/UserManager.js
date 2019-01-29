/**
 * Created by vmkde on 5/31/2018.
 */


const messageFormatter = require('dvp-common-lite/CommonMessageGenerator/ClientMessageJsonFormatter.js');
const config = require('config');
const logger = require('dvp-common-lite/LogHandler/CommonLogHandler.js').logger;
const request = require("request");
const users = require('dbf-dbmodels/Models/RolesAndGroups').user;
const mongoose = require("mongoose");
const async = require('async');
const validator = require('validator');
var Client = require('node-rest-client').Client;




module.exports.GetUserByEmailInternal = function(req, res){

    console.log("DBF-Services.GetUserByEmail Internal method ");

    let Schema = mongoose.Schema;
    let ObjectId = Schema.ObjectId;

    let company = parseInt(req.user.company);
    let tenant = parseInt(req.user.tenant);
    let email = req.user.iss;
    let jsonString;

    users.findOne({email:email, company:company,tenant:tenant},function (err, _users) {
        if(err)
        {
            jsonString=messageFormatter.FormatMessage(err, "GetUserByEmail failed", false, undefined);
        }
        else
        {
            jsonString=messageFormatter.FormatMessage(undefined, "GetUserByEmail succeeded", true, _users);
        }
        res(jsonString);
    });

};






