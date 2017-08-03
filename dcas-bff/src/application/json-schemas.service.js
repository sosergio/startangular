import Wreck from 'wreck';
import ReferenceDataSearchRequest from '../dtos/reference-data-search-request';
import pluralize from 'pluralize';
import LoggerFactory from './../common/services/logger.service';
import fs from 'fs';
import path from 'path';

export default class JsonSchemasAppService {

    /**
     * Build the ReferenceDataAppService with an environemnt injected 
     * @param {Environment} environment 
     */
    constructor(environment) {
        this.environment = environment;
        this.logger = LoggerFactory(environment);
    }

    /**
     * Get all the json schemas for the reference data objects
     */
    getReferenceDataSchemas() {
        let app = this.environment.app;
        var fileUrl = app.referenceDataJsonSchema;
        return new Promise((resolve, reject) => {
            fs.readFile(fileUrl, 'utf8', function (err, data) {
                if (err) {
                    console.error("[JsonSchemasAppService] getReferenceDataSchemas - Error: ", err);
                    return reject(err);
                }
                var contractJson = JSON.parse(data);
                let definitions = contractJson['definitions'];
                
                let allSchemas =[];
                let baseProperties = definitions['ReferenceDataMaintenanceDto']['properties'];
                for (let p in definitions) {
                    if (p != "ReferenceDataMaintenanceDto") {
                        let obj = definitions[p];
                        let typeName = obj["x-discriminator-value"];
                        if (typeName) {
                            //we only add items that can be loaded from the api
                            let typeProperties = obj["allOf"][1]["properties"];
                            let jsonSchema = Object.assign({}, baseProperties);
                            Object.assign(jsonSchema, typeProperties);
                            allSchemas.push({
                                name:typeName,
                                schema:jsonSchema
                            });
                        }
                    }
                }
                
                return resolve(allSchemas);
            });

        });
    }


}