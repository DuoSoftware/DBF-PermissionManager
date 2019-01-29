
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


        //TODO : Get User groups and roles and check if permission is available
        let email = req.user.iss;
        let company = parseInt(req.user.company);
        let tenant = parseInt(req.user.tenant);

        console.log(email);
        console.log(company);
        console.log(tenant);

        GetUserByEmail(req, (user)=>{
            console.log(user);

            let User = JSON.parse(user);

            if(User.IsSuccess === true || User.IsSuccess === 'true'){
                let userRoles = User.roles;

                GetRoles(req, (roles) =>{
                    console.log(roles);
                    let Roles = JSON.parse(roles);
                    let RolesArray = Roles.Result;

                    let userPermissions = [];
                    if(Roles.IsSuccess === true || Roles.IsSuccess === 'true'){


                        for(let role of RolesArray){
                            for(let userRole of userRoles){

                                if(userRole.roleId === role._id){
                                    userPermissions.push(role)
                                }


                            }

                        }

                        console.log(userPermissions);
                        next();
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

