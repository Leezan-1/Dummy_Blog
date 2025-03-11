function toJson(dbQueryValues) {
    return JSON.parse(JSON.stringify(dbQueryValues));
}
module.exports = toJson;