import ReferenceDataApi  from '../api/reference-data.api';
import ReferenceDataAppService from '../application/reference-data.service';
import ReferenceDataMockAppService from '../application/reference-data-mock.service';
import JsonSchemasApi from '../api/json-schemas.api';
import JsonSchemaAppService from '../application/json-schemas.service';

export default class ApiRoutes {
    /**
     * Registers all routes defined in the Apis
     * @param {*} environment 
     * @param {*} server 
     */
    static register(environment, server) {
        var rdAppService = new ReferenceDataAppService(environment);
        var jsonSchemaAppService = new JsonSchemaAppService(environment);

        if (environment.app.useMocks) {
            rdAppService = new ReferenceDataMockAppService(environment);
        }
        
        ReferenceDataApi.register(server, rdAppService);
        JsonSchemasApi.register(server, jsonSchemaAppService);
    }
}