import pack  from './../package.json'; 
import environment from './config/environment';
import Server from './init/server';
import LoggerFactory  from './common/services/logger.service';
import './common/common.module';

let logger = LoggerFactory(environment);
Server.start(environment, pack).then(res => {
    logger.logSuccess('Server running at: ', res.info.uri);
    logger.logSuccess('Swagger Api available at: ', `${res.info.uri}/documentation`);
    res.on('response', function (request) {
        var requestWResponse = `${request.info.remoteAddress}: ${request.method.toUpperCase()} ${request.url.path} --> ${request.response.statusCode}`;
        logger.warn(requestWResponse);
    });
}).catch(err => logger.error(`Error while starting the server: ${err}`));