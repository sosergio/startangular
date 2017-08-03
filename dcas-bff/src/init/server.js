import Hapi from 'hapi';
import Vision from 'vision';
import Inert from 'inert'; //Static file and directory handlers plugin for hapi.js.
import HapiSwagger from 'hapi-swagger';
import ApiRoutes from './api-routes.js';

export default class Server {
    /**
     * Setup servers configurations and loads the api
     * @param {*} environment 
     * @param {*} Pack 
     */
    static start(environment, Pack) {
        return new Promise((resolve, reject) => {
            if (!environment.server.port) {
                reject(new Error('The server must be started with an available port'));
            }
            const server = new Hapi.Server();
            server.connection({
                port: environment.server.port,
                //host: environment.server.host,
                routes: {
                    cors: {
                        origin:['*'],
                        exposedHeaders: ['Authorization']
                    }
                }
            });

            const options = {
                info: {
                    'title': 'DCAS Backend For Frontend Api Documentation',
                    'version': Pack.version,
                }
            };

            server.register([
                Inert,
                Vision,
                {
                    'register': HapiSwagger,
                    'options': options
                }
            ], (err) => {
                if (err) {
                    return reject(err);
                }
            });

            //configure handling of static files
            server.route({
                method: 'GET',
                path: '/{param*}',
                handler: {
                    directory: {
                        path: '.',
                        redirectToSlash: true,
                        index: true
                    }
                }
            });

            //configure handling of OPTIONS requests
            server.route({
                method: 'OPTIONS',
                path: '/{param*}',
                handler: function (request, reply) {
                    console.log("Incoming OPTIONS request headers:", request.headers);
                    let origin = request.headers["origin"];
                    let methods = request.headers["access-control-request-method"];
                    let headers = request.headers["access-control-request-headers"];
                    const response = reply('success');
                    response.header('Access-Control-Allow-Origin', origin);
                    response.header('Access-Control-Allow-Methods', methods);
                    response.header('Access-Control-Allow-Headers', headers);
                }
            });

            //load the api routes
            ApiRoutes.register(environment, server);

            //start the server
            server.start().then(() => resolve(server)).catch(err => reject(err));
        });
    }
}