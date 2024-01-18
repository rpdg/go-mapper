"use strict";
function getValueByPath(srcObj, path) {
    if (typeof srcObj !== 'object') {
        throw new Error('Invalid parameter [srcObj]');
    }
    if (typeof path !== 'string') {
        throw new Error('Invalid parameter [path]');
    }
    var pathArray = path.split('.');
    var tmpObj = srcObj;
    for (var i = 0; i < pathArray.length; i++) {
        if (tmpObj[pathArray[i]] === undefined) {
            return undefined;
        }
        tmpObj = tmpObj[pathArray[i]];
    }
    return tmpObj;
}
function setValueByPath(targetObj, path, value) {
    if (typeof targetObj !== 'object') {
        throw new Error('Invalid parameter [targetObj]');
    }
    if (typeof path !== 'string') {
        throw new Error('Invalid parameter [path]');
    }
    var pathArray = path.split('.');
    var currentObj = targetObj;
    for (var i = 0; i < pathArray.length - 1; i++) {
        var currentPath = pathArray[i];
        if (currentObj[currentPath] === undefined) {
            currentObj[currentPath] = {};
        }
        currentObj = currentObj[currentPath];
    }
    currentObj[pathArray[pathArray.length - 1]] = value;
}
function convert(srcObj, convertors) {
    var res = {};
    convertors.forEach(function (cfg) {
        var fromArr = cfg.from.split('||');
        for (var i = 0; i < fromArr.length; i++) {
            var f = fromArr[i].trim();
            var v = getValueByPath(srcObj, f);
            if (v === undefined && i + 1 < fromArr.length) {
                continue;
            }
            if (cfg.map !== undefined && Array.isArray(v)) {
                v = v.map(function (item) { return convert(item, cfg.map); });
            }
            if (!!cfg.render) {
                var render = new Function('val, srcObj', cfg.render);
                v = render.call(res, v, srcObj);
            }
            setValueByPath(res, cfg.to || f, v);
            break;
        }
    });
    return res;
}
