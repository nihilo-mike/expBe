const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger_output.json";
const endpointsFiles = [
  "./src/api/routes/authRouter.js",
  "./src/api/routes/customerRoute.js",
  "./src/api/routes/employeeRouter.js",
  "./src/api/routes/masterDataRouter.js",
  "./src/api/routes/companyRouter.js",
  "./src/api/routes/rateconRouter.js",
  "./src/api/routes/packetRouter.js",
  "./src/api/routes/documentRouter.js"
];

swaggerAutogen(outputFile, endpointsFiles).then(() => {
  require("./index.js");
});
