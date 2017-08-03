import Joi from 'joi';
import ReferenceDataSearchRequest from './../dtos/reference-data-search-request';
import AuthRequest from './../dtos/auth-request';
import HttpHelper from './../common/helpers/http-helper';

export default class ReferenceDataApi {
    /**
     * Registers the routing for the Referenece Data Maintenance Api
     * @param {*} server the Hapi.Server
     * @param {*} referenceDataAppService ReferenceDataAppService instance
     */
    static register(server, referenceDataAppService) {

        var basePath = '/reference-data';

        //todo:
        //Load routings from a yaml contract
        //with a generic custom proxy handler

        server.route({
            method: 'GET',
            path: `${basePath}/{type}`,
            handler: function (request, reply) {
                console.log("Incoming Request object is ", request.headers);
                var t = HttpHelper.getRequestParam(request.params, "type");
                var searchRequest = new ReferenceDataSearchRequest(request.query);
                searchRequest.auth = AuthRequest.fromHeaders(request.headers);
                console.log('transformed:', searchRequest);
                referenceDataAppService.search(t, searchRequest).then(data => {
                    reply(data);
                }).catch(err => {
                    reply(err);
                })
            },
            config: {
                description: 'Search for reference data by type, text and status',
                tags: ['api', 'reference-data'],
                validate: {
                    params: {
                        type: Joi.string()
                            .required()
                            .description('the type of reference data')
                    },
                    query: {
                        freeText: Joi.string()
                            .description('some text to search in all reference data of the type specified'),
                        status: Joi.number().min(1).max(3)
                            .description('the status of reference data 1 Draft, 2 Awaiting Approval, 3 Approved'),
                        order: Joi.string()
                            .description('the order of the result of reference data'),
                        asc: Joi.boolean()
                            .description('wether the sort is ascendent or not'),
                        count: Joi.number().min(1)
                            .description('wether the sort is ascendent or not'),
                        offset: Joi.number().min(0)
                            .description('wether the sort is ascendent or not'),
                        allVersions: Joi.boolean()
                            .description('wether to return all versions or only the actual')
                    }
                }
            }
        });

        server.route({
            method: 'POST',
            path: `${basePath}/{type}`,
            handler: function (request, reply) {
                var t = HttpHelper.getRequestParam(request.params, "type");
                var item = request.payload;
                referenceDataAppService.create(t, item).then(data => {
                    reply(data);
                }).catch(err => {
                    reply(err);
                })
            },
            config: {
                description: 'Create a new reference data of the type specified',
                tags: ['api', 'reference-data'],
                validate: {
                    params: {
                        type: Joi.string()
                            .required()
                            .description('the type of reference data'),
                    }
                }
            }
        });

        server.route({
            method: 'PUT',
            path: `${basePath}/{type}/{id}`,
            handler: function (request, reply) {
                var t = HttpHelper.getRequestParam(request.params, "type");
                var id = HttpHelper.getRequestParam(request.params, "id");
                var item = request.payload;
                referenceDataAppService.update(t, id, item).then(data => {
                    reply(data);
                }).catch(err => {
                    reply(err);
                })
            },
            config: {
                description: 'Updates the reference data with the id and type specified',
                tags: ['api', 'reference-data'],
                validate: {
                    params: {
                        type: Joi.string()
                            .required()
                            .description('the type of reference data'),
                        id: Joi.number()
                            .required()
                            .description('the id of the reference data'),
                    }
                }
            }
        });

        server.route({
            method: 'GET',
            path: `${basePath}/{type}/{id}`,
            handler: function (request, reply) {
                var t = HttpHelper.getRequestParam(request.params, "type");
                var id = HttpHelper.getRequestParam(request.params, "id");
                referenceDataAppService.load(t, id).then(data => {
                    reply(data);
                }).catch(err => {
                    reply(err);
                })
            },
            config: {
                description: 'Get the reference data of the type and id specified',
                tags: ['api', 'reference-data'],
                validate: {
                    params: {
                        type: Joi.string()
                            .required()
                            .description('the type of the reference data'),
                        id: Joi.number()
                            .required()
                            .description('the id of the reference data'),
                    }
                }
            }
        });

        server.route({
            method: 'POST',
            path: `${basePath}/{type}/deletions`,
            handler: function (request, reply) {
                var t = HttpHelper.getRequestParam(request.params, "type");
                var item = request.payload;
                var id = item.id;
                var reason = item.reason;
                referenceDataAppService.delete(t, id, reason).then(data => {
                    reply(data);
                }).catch(err => {
                    reply(err);
                })
            },
            config: {
                description: 'Deletes the reference data of the type and ids specified',
                tags: ['api', 'reference-data'],
                validate: {
                    params: {
                        type: Joi.string()
                            .required()
                            .description('the type of the reference data')
                    }
                }
            }
        });

        server.route({
            method: 'POST',
            path: `${basePath}/{type}/submissions`,
            handler: function (request, reply) {
                var t = HttpHelper.getRequestParam(request.params, "type");
                var ids = request.payload;
                referenceDataAppService.submitMany(t, ids).then(data => {
                    reply(data);
                }).catch(err => {
                    reply(err);
                })
            },
            config: {
                description: 'Submits the reference data of the type and ids specified',
                tags: ['api', 'reference-data'],
                validate: {
                    params: {
                        type: Joi.string()
                            .required()
                            .description('the type of the reference data')
                    }
                }
            }
        });

        server.route({
            method: 'POST',
            path: `${basePath}/{type}/approvals`,
            handler: function (request, reply) {
                var t = HttpHelper.getRequestParam(request.params, "type");
                var ids = request.payload;
                referenceDataAppService.approveMany(t, ids).then(data => {
                    reply(data);
                }).catch(err => {
                    reply(err);
                })
            },
            config: {
                description: 'Approves the reference data of the type and ids specified',
                tags: ['api', 'reference-data'],
                validate: {
                    params: {
                        type: Joi.string()
                            .required()
                            .description('the type of the reference data')
                    }
                }
            }
        });

        server.route({
            method: 'POST',
            path: `${basePath}/{type}/withdrawals`,
            handler: function (request, reply) {
                var t = HttpHelper.getRequestParam(request.params, "type");
                var ids = request.payload;
                referenceDataAppService.withdrawMany(t, ids).then(data => {
                    reply(data);
                }).catch(err => {
                    reply(err);
                })
            },
            config: {
                description: 'Withdraws the reference data of the type and ids specified',
                tags: ['api', 'reference-data'],
                validate: {
                    params: {
                        type: Joi.string()
                            .required()
                            .description('the type of the reference data')
                    }
                }
            }
        });



    }
}