import Joi from 'joi';
import ReferenceDataSearchRequest from './../dtos/reference-data-search-request';
import AuthRequest from './../dtos/auth-request';
import HttpHelper from './../common/helpers/http-helper';

export default class JsonSchemasApi {
    /**
     * Registers the routing for the Referenece Data Maintenance Api
     * @param {*} server the Hapi.Server
     * @param {*} jsonSchemaAppService JsonSchemaAppService instance
     */
    static register(server, jsonSchemaAppService) {

        var basePath = '/json-schemas';

        //todo:
        //Load routings from a yaml contract
        //with a generic custom proxy handler

        server.route({
            method: 'GET',
            path: `${basePath}/reference-data`,
            handler: function (request, reply) {
                jsonSchemaAppService.getReferenceDataSchemas()
                    .then(result => reply(result))
                    .catch(err => reply(err));
            },
            config: {
                description: 'Get all json schemas available for reference data',
                tags: ['api', 'json-schemas'],
            }
        });
    }
}