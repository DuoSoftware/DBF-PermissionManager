/**
 * Created by vmkde on 7/18/2018.
 */
module.exports = {
    "Redis":{
        "mode":"SYS_REDIS_MODE",
        "ip": "SYS_REDIS_HOST",
        "port": "SYS_REDIS_PORT",
        "user": "SYS_REDIS_USER",
        "password": "SYS_REDIS_PASSWORD",
        "sentinels":{
            "hosts": "SYS_REDIS_SENTINEL_HOSTS",
            "port":"SYS_REDIS_SENTINEL_PORT",
            "name":"SYS_REDIS_SENTINEL_NAME"
        }

    },
    "ObjectSore" : {
        "ip":"SYS_OBSTORE_HOST",
        "port":"SYS_OBSTORE_PORT",
        "protocol" : "SYS_OBSTORE_PROTOCOL"
    },
    "Mongo":
        {
            "ip":"SYS_MONGO_HOST",
            "port":"SYS_MONGO_PORT",
            "dbname":"SYS_MONGO_DB",
            "password":"SYS_MONGO_PASSWORD",
            "user":"SYS_MONGO_USER",
            "replicaset" :"SYS_MONGO_REPLICASETNAME",
            "cloudAtlas": "SYS_MONGO_CLOUDATLAS"
        }

};

