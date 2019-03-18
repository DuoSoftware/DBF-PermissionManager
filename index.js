
const Redis  = require('./lib/redisManager');
const bluebird = require("mongoose");
const GetUserByUserName = require('./lib/UserManager').GetUserByUsernameInternal;
const GetRoles = require('./lib/RoleManager').GetRolesInternal;

let redis = new Redis();

module.exports = (permission) =>{

    //console.log(permission)

    return function(req, res, next) {


        let email = req.user.sub;
        let company = parseInt(req.user.company);
        let tenant = parseInt(req.user.tenant);

        let key = `${email}:${company}:${tenant}:${permission.permissionName}`;

        redis.GetSession(key).then(function (value) {


            if(value !== null && value !== 'null'){
                if(value.permissionObj[permission.permission] === true || value.permissionObj[permission.permission] === "true"){
                    next()
                }
                else{
                    next(new Error('Unauthorized'));
                }
            }
            else {
                GetUserByUserName(req, (user)=>{

                    let User = JSON.parse(user);

                    if(User.Result !== null && (User.IsSuccess === true || User.IsSuccess === 'true')){
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

                                                //console.log("*********************************************************")
                                                //console.log(permissionObject.permissionName);
                                                //console.log(permission.permissionName);
                                                //console.log(permissionObject.permissionObj.hasOwnProperty(permission.permission))
                                                //console.log("*********************************************************")


                                                if(permissionObject.permissionName === permission.permissionName && permissionObject.permissionObj.hasOwnProperty(permission.permission)){

                                                    redis.SetSession(key, permissionObject).then(function (value) {
                                                        //console.log(value)

                                                    }).catch(function (ex) {
                                                        console.log(ex);
                                                        next(new Error('Error'));
                                                    });

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

            }
        }).catch(function (ex) {
            console.log(ex);
            next(new Error('Error'));

        });

    };

};

