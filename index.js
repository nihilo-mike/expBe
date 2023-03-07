const app = require("./src/app");
const http = require("http");
const server = http.createServer(app);
const redis = require("./src/api/redisConfig");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
require("dotenv").config();
const authRoute = require("./src/api/routes/authRouter");
const customerRoute = require("./src/api/routes/customerRoute");
const employeeRoute = require("./src/api/routes/employeeRouter");
const masterData = require("./src/api/routes/masterDataRouter");
const company = require("./src/api/routes/companyRouter");
const rateCon = require("./src/api/routes/rateconRouter");
const registration = require("./src/api/routes/registrationRouter");
const packet = require("./src/api/routes/packetRouter");
const document = require("./src/api/routes/documentRouter");
const invoice = require("./src/api/routes/invoiceRouter");
const messageC=require("./src/api/routes/messageRoute");
const registerNotificationHandlers = require("./src/api/services/notificationHandler");
const { verifyToken, getUser } = require("./src/api/middleware/verifyToken");
const { default: Redis } = require("ioredis");

//getting port from env file
const port = process.env.PORT || "3000";
app.set("port", port);
app.use(morgan("dev"));
//creating HTTP server

app.use("/auth", authRoute);
app.use("/customer", customerRoute);
app.use("/employee", employeeRoute);
app.use("/masterData", masterData);
app.use("/company", company);
app.use("/ratecon", rateCon);
app.use("/documents", document);
app.use("/packets", packet);
app.use("/invoice", invoice);
app.use("/register", registration);
app.use("messages",messageC);
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

const onConnection = (socket) => {
  registerNotificationHandlers(io, socket);
  socket.on("connected", function (token) {
    const sid = socket.id;
    //checking if the user is an employee and adding them to a room
    getUser(token.tkn).then((usr) => {
      if (Boolean(usr.Employees)) {
        redis.set(`${usr.user_id}`, `${sid}`);
        socket.join("employeeRoom");
        console.log('ab');
      }

      if (Boolean(usr.Customers)) {
        redis.set(`${usr.user_id}`, `${sid}`);
        socket.join(`${usr.Customers.companyCompany_id}`);
        io.emit('roomJoined',{roomId:usr.Customers.companyCompany_id});
        console.log('ad');
      }
    });
  });
};

io.on("connection", onConnection);

server.listen(port, () => {
  console.log("listening on" + port);
});
