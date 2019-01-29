
const Redis  = require('./lib/redisManager');
const mongoose = require("mongoose");
//const MongooseConnection = new require('dbf-dbmodels/MongoConnection');
//let connection = new MongooseConnection();
const GetUserByEmail = require('./lib/UserManager').GetUserByEmailInternal;
const GetRoles = require('./lib/RoleManager').GetRolesInternal;


let redis = new Redis();

module.exports = (permission) =>{

    //console.log(permission)

    return function(req, res, next) {


        let email = req.user.iss;
        let company = parseInt(req.user.company);
        let tenant = parseInt(req.user.tenant);


        GetUserByEmail(req, (user)=>{

            let User = JSON.parse(user);

            if(User.IsSuccess === true || User.IsSuccess === 'true'){
                let userRoles = User.Result.roles;

                GetRoles(req, (roles) =>{
                    let Roles = JSON.parse(roles);
                    let RolesArray = Roles.Result;

                    if(Roles.IsSuccess === true || Roles.IsSuccess === 'true'){


                        let auth = false;
                        for(let role of RolesArray){
                            for(let userRole of userRoles){

                                if(userRole.roleId === role._id){
                                    for (let permissionObject of role.permissions){

                                        console.log("*********************************************************")
                                        console.log(permissionObject.permissionName);
                                        console.log(permission.permissionName);
                                        console.log(permissionObject.permissionObj.hasOwnProperty(permission.permission))
                                        console.log("*********************************************************")


                                        if(permissionObject.permissionName === permission.permissionName && permissionObject.permissionObj.hasOwnProperty(permission.permission)){

                                            if(permissionObject.permissionObj[permission.permission] === true || permissionObject.permissionObj[permission.permission] === "true"){
                                                auth = true;
                                            }
                                        }
                                    }

                                }


                            }

                        }

                        if(auth){
                            next();
                        }else {
                            next(new Error('Unauthorized'));

                        }

                    }
                    else {
                        next(new Error('Roles Not Found'));
                    }

                })

            }
            else{
                next(new Error('User Not Found'));
            }
        })



    };




};

