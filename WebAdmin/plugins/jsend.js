var success = function (msg, data, code) {
    if (!code) {
        code = 200;
    }
    if (!msg) {
        msg = "Success";
    }
    if (!data) {
        data = {};
    }
    return {
        "msg": msg,
        "code": code,
        "data": data
    }
}

var failure = function (msg, data, code) {
    if (!code) {
        code = 500;
    }
    if (!msg) {
        msg = "Failure";
    }
    if (!data) {
        data = {};
    }
    return {
        "msg": msg,
        "code": code,
        "data": data
    }
}

var notFound = function (msg, data, code) {
    if (!code) {
        code = 404;
    }
    if (!msg) {
        msg = "Not Found";
    }
    if (!data) {
        data = {};
    }
    return {
        "msg": msg,
        "code": code,
        "data": data
    }
}


module.exports = {
    'success': success,
    'failure': failure,
    'notFound': notFound
}
