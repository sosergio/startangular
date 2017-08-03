import Wreck from 'wreck';
import ReferenceDataSearchRequest from '../dtos/reference-data-search-request';
import pluralize from 'pluralize';
import LoggerFactory from './../common/services/logger.service';

export default class ReferenceDataAppService {

    /**
     * Build the ReferenceDataAppService with an environemnt injected 
     * @param {Environment} environment 
     */
    constructor(environment) {
        this.environment = environment;
        this.logger = LoggerFactory(environment);
    }

    /**
     * Search for all reference data by type
     * @param {String} type 
     * @param {Object} request an object of type ReferenceDataSearchRequest
     */
    search(type, request) {
        let app = this.environment.app;
        var typePlural = pluralize(type);
        var url = `${app.referenceDataApiBaseUrl}/${typePlural}`;
        return new Promise((resolve, reject) => {
            this.logger.warn(url);
            let options = {};
            console.log("[ReferenceDataService] the request object is:", request);
            if(request.auth){
                options.headers = request.auth.toHeaders();
            }
            console.log("[ReferenceDataService] the options headers object is:", options.headers);
            Wreck.get(url, options, (err, res, payload) => {
                if (err) {
                    console.error("[ReferenceDataAppService] search - Error while connecting to the proxy server:", err.description);
                    return reject(err);
                }
               
                console.log("[ReferenceDataAppService] search - Retrieved with success");

                let all = JSON.parse(payload);
                let result = all;
                if (request.freeText) {
                    result = all.filter(d => {
                        for (let p in d) {
                            if (d[p].toString().toLowerCase().indexOf(request.freeText.toLowerCase()) > -1) {
                                return true;
                            }
                        }
                    });
                }

                if (!request.allVersions) {
                    let objTypeCameCase = type.toCamelCase() + "Id";
                    let grouped = result.groupBy(objTypeCameCase);
                    let highestCeds = Object.keys(grouped).map(key => {
                        let arr = grouped[key];
                        let highestCed = arr.orderBy("changeEffectiveDate", false)[0];
                        return highestCed;
                    });
                    result = highestCeds;

                } else if (request.status) {
                    result = result.filter(d => d.approvalStatusId == request.status);
                }

                if (request.order) {
                    result = result.orderBy(request.order, request.asc);
                }

                let page = result ? result.slice(request.offset, request.count + request.offset) : null;

                let response = {
                    data: page,
                    currentPage: parseInt((request.offset / request.count) + 1),
                    totalCount: result.length
                };

                return resolve(response);
            });
        });
    }

    load(type, id) {
        let app = this.environment.app;
        var url = `${app.referenceDataApiBaseUrl}/${type}/${id}`;
        return new Promise((resolve, reject) => {
            Wreck.get(url, null, (err, res, payload) => {
                if (err) {
                    this.logger.error("[ReferenceDataAppService] Get - Error while connecting to the proxy server:", err);
                    reject(err);
                }
                if (res.statusCode !== 200) {
                    reject(res.statusCode);
                }
                this.logger.log("[ReferenceDataAppService] Get - Retrieved with success");
                resolve(JSON.parse(payload));
            });
        });
    }

    create(type, id, item) {
        let app = this.environment.app;
        var url = `${app.referenceDataApiBaseUrl}/${type}`;
        return new Promise((resolve, reject) => {
            Wreck.post(url, item, (err, res, payload) => {
                if (err) {
                    console.log("[ReferenceDataAppService] Create - Error while connecting to the proxy server:", err);
                    reject(err);
                }
                if (res.statusCode !== 200) {
                    reject(res.statusCode);
                }
                console.log("[ReferenceDataAppService] Create - Retrieved with success");
                resolve(JSON.parse(payload));
            });
        });
    }

    update(type, id, item) {}

    delete(type, id) {}

    submitMany(type, ids) {}

    approveMany(type, ids) {}

    rejectMany(type, ids) {}

    retractMany(type, ids) {}

    withdrawMany(type, ids) {}
}