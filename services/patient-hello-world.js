module.exports = {
  serviceResponse: function(requestBody, callback) {
    callback(null, response(requestBody));
  },
  definition: {
    id: "patient-hello-world",
    name: "Patient hello world", // Remove on complete transition to CDS Hooks 1.0 Spec
    title: "Patient hello world",
    description: "Display which patient the user is currently working with",
    hook: "patient-view",
    prefetch: {
      patient: "Patient/{{Patient.id}}"
    }
  }
};

function response(data) {
  var patient = data.prefetch.patient.resource;
  var name = patient.name[0].given[0];
  return {
    cards: [{
      summary: "Now seeing: " + name,
      source: {
        label: "Patient tracking service"
      },
      indicator: "info"
    }]
  }
}
