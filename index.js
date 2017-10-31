const express = require('express');
const bodyParser = require('body-parser');
const patient_hello_world_service = require('./services/patient-hello-world');
const app = express();

// This is necessary middleware to parse JSON into the incoming request body for POST requests
app.use(bodyParser.json());

app.use((request, response, next) => {
  if (request.method !== 'GET' && request._contentType && request._contentType.match('json\\+fhir')){
    request.body = request.body ? JSON.parse(request.body.toString()) : {}
  }

  next();
});

/**
 * Security Considerations:
 * - CDS Services must implement CORS in order to be called from a web browser
 */
app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.setHeader('Access-Control-Expose-Headers', 'Origin, Accept, Content-Location, ' +
    'Location, X-Requested-With');

  // Pass to next layer of middleware
  next();
});

// Keys of this object are CDS Service ID's
const services = {
  'patient-hello-world': patient_hello_world_service
};

const isValidCdsService = (id) => {
  return id in services;
};

const isValidJson = (obj) => {
  try {
    JSON.stringify(obj);
    return true;
  } catch (err) {
    return false;
  }
};

const discoveryDefinitions = Object.keys(services).map((serviceId) => {
  return services[serviceId].definition
});

app.get('/cds-services', (request, response) => {
  const discoveryEndpointServices = {
    services: discoveryDefinitions
  };
  response.send(JSON.stringify(discoveryEndpointServices, null, 2));
});

app.post('/cds-services/:serviceId', (request, response) => {
  const serviceEndpoint = request.params.serviceId;

  // Invalid CDS Service endpoint
  if (!isValidCdsService(serviceEndpoint)) {
    response.status(404);
  }

  // Bad request
  if (!isValidJson(request.body)) {
    response.status(400);
  }

  var cdsService = services[serviceEndpoint];
  cdsService.serviceResponse(request.body, (err, serviceResponse) => {
    response.send(JSON.stringify(serviceResponse, null, 2));
  });
});

app.listen((process.env.PORT || 3000));
