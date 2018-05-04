const aboutUsers = require("./users");

const constructorMethod = app => {
  app.use("/users", aboutUsers);

  app.use("*", (req, res) => {
    res.status(404).json({error: "Not found"});
  });
};

module.exports = constructorMethod;