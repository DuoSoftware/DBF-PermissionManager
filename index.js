
const Redis = require('./lib/redisManager');
const bluebird = require("mongoose");
const GetUserByUserName = require('./lib/UserManager').GetUserByUsernameInternal;
const GetRoles = require('./lib/RoleManager').GetRolesInternal;

let redis = new Redis();

module.exports = (permission) => {

    //console.log(permission)

    return function (req, res, next) {
        let email = req.user.sub;
        let company = parseInt(req.user.company);
        let tenant = parseInt(req.user.tenant);

        let key = `srn:${email}:${company}:${tenant}:${permission.permissionName}`;
        let allKey = `srn:${email}:${company}:${tenant}:all`;

        redis.GetSession(key).then(function (value) {

            if (value !== null && value !== 'null') {
                if (value.permissionObj[permission.permission] === true || value.permissionObj[permission.permission] === "true") {
                    next();
                } else {
                    next(new Error('Permission not given. User is Unauthorized'));
                }
            } else {

                redis.GetSession(allKey).then(function (value) {

                    if (value === 'true' || value === true) {
                        next();
                    } else {

                        GetUserByUserName(req, (user) => {

                            let User = JSON.parse(user);

                            if (User.Result !== null && (User.IsSuccess === true || User.IsSuccess === 'true')) {
                                let userRoles = User.Result.roles;

                                GetRoles(req, (roles) => {
                                    let Roles = JSON.parse(roles);
                                    let RolesArray = Roles.Result;

                                    let allExist = userRoles.filter((role) => {
                                        return (role.roleId === 'all');
                                    });

                                    if (allExist.length !== 0) {

                                        redis.SetSession(allKey, true).then(function (value) {
                                            //console.log(value)
                                        }).catch(function (ex) {
                                            console.log('Exception thrown when calling set session method to set true: ' + ex);
                                            next(new Error('Exception thrown when calling set session method to set true'));
                                        });
                                        //Do not delay for redis ack if call fails not a big issue, will be set in the next call
                                        next();

                                    } else if (Roles.IsSuccess === true || Roles.IsSuccess === 'true') {

                                        let auth = false;
                                        for (let role of RolesArray) {
                                            for (let userRole of userRoles) {
                                                if (userRole.roleId === role._id) {
                                                    for (let permissionObject of role.permissions) {

                                                        //console.log("*********************************************************")
                                                        //console.log(permissionObject.permissionName);
                                                        //console.log(permission.permissionName);
                                                        //console.log(permissionObject.permissionObj.hasOwnProperty(permission.permission))
                                                        //console.log("*********************************************************")


                                                        if (permissionObject.permissionName === permission.permissionName && permissionObject.permissionObj.hasOwnProperty(permission.permission)) {

                                                            redis.SetSession(key, permissionObject).then(function (value) {
                                                                //console.log(value)
                                                            }).catch(function (ex) {
                                                                console.log('Exception thrown when calling set session method to set permissionObject: ' + ex);
                                                                next(new Error('Exception thrown when calling set session method to set permissionObject'));
                                                            });

                                                            if (permissionObject.permissionObj[permission.permission] === true || permissionObject.permissionObj[permission.permission] === "true") {
                                                                auth = true;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        if (auth) {
                                            next();
                                        } else {
                                            next(new Error('Permission not given (auth is set to false). User is Unauthorized'));
                                        }
                                    } else {
                                        next(new Error('Roles retrieving has failed'));
                                    }
                                })
                            } else {
                                next(new Error('User not found or user data retrieving has failed'));
                            }
                        })
                    }
                }).catch(function (ex) {
                    console.log('Exception thrown when calling get session method: ' + ex);
                    next(new Error('Exception thrown when calling get session method'));
                });
            }
        }).catch(function (ex) {
            console.log('Exception thrown when calling get session method: ' + ex);
            next(new Error('Exception thrown when calling get session method'));
        });
    };
};

