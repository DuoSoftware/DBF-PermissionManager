/**
 * Created by vmkde on 5/31/2018.
 */


const messageFormatter = require('dvp-common-lite/CommonMessageGenerator/ClientMessageJsonFormatter.js');
const users = require('dbf-dbmodels/Models/RolesAndGroups').user;
const mongoose = require("mongoose");




module.exports.GetUserByUsernameInternal = function(req, res){

    console.log("DBF-Services.GetUserByEmail Internal method ");

    let Schema = mongoose.Schema;
    let ObjectId = Schema.ObjectId;

    let company = parseInt(req.user.company);
    let tenant = parseInt(req.user.tenant);
    let userName = req.user.sub;
    let jsonString;

    users.findOne({userName:userName},function (err, _users) {
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






