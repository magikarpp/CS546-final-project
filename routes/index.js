const usersRoute = require("./users");
const campgroundsRoute = require("./campgrounds");

const constructorMethod = app => {
  app.use("/users", usersRoute);
  app.use("/campgrounds", campgroundsRoute);

  app.use("*", (req, res) => {
    res.status(404).json({error: "Not found"});
  });
};

module.exports = constructorMethod;
