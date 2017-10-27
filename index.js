/**
 * Responds to any HTTP request that can provide a "message" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports['cds-services'] = function cdsServices(req, res) {
  const patientHelloWorldService = {
    id: "patient-hello-world",
    name: "Patient hello world", // Remove on complete transition to CDS Hooks 1.0 Spec
    title: "Patient hello world",
    description: "Greet patient by name",
    hook: "patient-view",
    prefetch: {
      patientToGreet: "Patient/{{Patient.id}}"
    }
  };

  const cmsPriceCheckService = {
    name: "CMS Pricing Service", // Remove on complete transition to CDS Hooks 1.0 Spec
    title: "CMS Pricing Service",
    id: "cms-price-check",
    description: "Estimate the price of a prescription based on historical pharmacy dispensing data",
    hook: "medication-prescribe"
  };

  const pediatricDoseCheck = {
    hook: "medication-prescribe",
    name: "Random grab-bag of mock services", // Remove on complete transition to CDS Hooks 1.0 Spec
    title: "Random grab-bag of mock services",
    description: "Generate a bunch of cards for various reasons",
    id: "pediatric-dose-check",
    prefetch:{
      patient: "Patient/{{Patient.id}}"
    }
  };

  return res.json({
    services: [
      patientHelloWorldService,
      cmsPriceCheckService,
      pediatricDoseCheck
    ]
  })
};
