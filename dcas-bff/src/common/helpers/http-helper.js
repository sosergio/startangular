export default class HttpHelper {

    /**
     * Looks for the given existing property in the object, and returns it as encoded Uri component
     */
    static getRequestParam(params, prop) {
        if (params[prop]) {
            return encodeURIComponent(params[prop]);
        }
        return null;
    }
}