## RDG Frontend DCAS

### User Interface
The dcas-ui folder contains the user interface, an angular app.

To build the app for _production_ run the following script:

	cd dcas-ui
    npm install
	npm run build

To build the app for _development_ run the following script:

	cd dcas-ui
    npm install
    npm run start
    
A live reload node js server will start, and a change in files will trigger a rebuild.
    
### Backend for Frontend
The dcas-bff folder contains the backend for frontend, a node.js app.

To build the app for _production_ run the following script:

	cd dcas-bff
    npm install
	npm run build

To build the app for _development_ run the following script:

	cd dcas-bff
    npm install
    npm run start

A live demon process will watch for file changes and trigger a rebuild.

### Docker
At the root level there is a docker-compose.yml file which can be used to run both projects in a production environment.

	docker-compose build
    docker-compose up
    
The Bff will be running at http://localhost:5000 and the Ui at http://localhost:80.
Bff api documentation is available at http://localhost:5000/documentation

    
    




