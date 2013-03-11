var assert = require('assert');
var extend = require('node.extend');

function ovverrideConfingWithEnviromentSettings(config, env, parentName) {
    var envPropertyName, key, val;
    if (parentName == null) {
        parentName = '';
    }
    for (key in config) {
        val = config[key];
        if (typeof val === "object") {
            ovverrideConfingWithEnviromentSettings(val, env, "" + parentName + key + "_");
        }
        envPropertyName = (parentName + key).toUpperCase();
        if (env[envPropertyName] != null) {
            config[key] = typeParse(typeof config[key], env[envPropertyName]);
        }
    }

    return config;
}

function typeParse(type, property) {
    if (type === 'boolean') {
        return property === 'false' ? false : Boolean(property);
    }
    if (type === 'number') {
        property = Number(property);
        assert(isNaN(property) === false, 'not a number provided');
        return property;
    } else {
        return property;
    }
}

module.exports = function (pathToConfigJson) {
    var config = require(path.join(pathToConfigJson, 'config.json'));
    var isNonDevEnv = process.env.NODE_ENV !== '' && process.env.NODE_ENV != 'development';
    if (isNonDevEnv) {
        try {
            var envSpecificConfig = require(path.join(pathToConfigJson,
                                                      'config.' + process.env.NODE_ENV + '.json'));
            extend(true, config, envSpecificConfig);
        }
        catch (e) {
        }
    }

    return ovverrideConfingWithEnviromentSettings(config, process.env);
};
