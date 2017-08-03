import LogLevel from'./../common/models/log-level';

export default Object.create({
    server: {
        host: "localhost", //process.env.NODE_HOST || 
        port:  process.env.NODE_PORT || 5000

    },
    app: {
        name:'bff',
        referenceDataApiBaseUrl: "http://localhost:15002/ref-data-service/v1/reference-data-maintenance",
        referenceDataJsonSchema: "./assets/contracts/ReferenceDataMaintenanceV2.json",
        useMocks: true,
        logLevel:LogLevel.LOG
    }
});