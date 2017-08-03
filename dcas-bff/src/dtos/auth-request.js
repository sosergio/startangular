export default class AuthRequest {
    constructor() {
        this.cn = null;
        this.businessId = 0;
        this.roles = null;

    }

    /**
     * Builds the AuthRequest object reading from the given headers
     * @param {*} headers Hapi request's headers
     */
    static fromHeaders(headers) {
        let authReq = new AuthRequest();
        if (headers) {
            if (headers["x-forwarded-cn"]) {
                authReq.cn = headers["x-forwarded-cn"];
            }
            if (headers["x-forwarded-businessid"]) {
                authReq.businessId = headers["x-forwarded-businessid"];
            }
            if (headers["x-forwarded-roles"]) {
                authReq.roles = headers["x-forwarded-roles"];
            }
        }
        return authReq;
    }

    /**
     * Converts the AuthRequest object to an object suitable to be used as a Wreck Headers
     */
    toHeaders() {
        let result = {};
        if (this.cn) {
            result["X-Forwarded-cn"] = this.cn;
        }
        if (this.businessId) {
            result["X-Forwarded-businessId"] = this.businessId;
        }
        if (this.roles) {
            result["X-Forwarded-roles"] = this.roles;
        }
        return result;
    }
}