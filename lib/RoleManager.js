/**
 * Created by vmkde on 5/30/2018.
 */



const messageFormatter = require('dvp-common-lite/CommonMessageGenerator/ClientMessageJsonFormatter.js');
const roles = require('dbf-dbmodels/Models/RolesAndGroups').roles;



module.exports.GetRolesInternal = function(req, res){

    console.log("DBF-Services.GetRoles Internal method ");

    let company = parseInt(req.user.company);
    let tenant = parseInt(req.user.tenant);
    let jsonString;

    roles.find({tenant:tenant},function (err, _roles) {
        if(err)
        {
            jsonString=messageFormatter.FormatMessage(err, "Roless get failed", false, undefined);
        }
        else
        {
            jsonString=messageFormatter.FormatMessage(undefined, "Roless get succeeded", true, _roles);
        }
        res(jsonString);
    });

};


