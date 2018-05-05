const usersRoute = require("./users");
const campgroundsRoute = require("./campgrounds");

const constructorMethod = app => {
  app.use("/users", usersRoute);
  app.use("/campgrounds", campgroundsRoute);

  app.use("*", (req, res) => {
    res.redirect("/users");
  });
};

module.exports = constructorMethod;
