const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
//const users = require("./users");
//const uuid = require("node-uuid");
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt-nodejs');

module.exports = {
    async getUserByUsername(username){
      if(username === undefined || typeof username !== "string"){
          throw new Error("username is not a string");
      }
      if (!username) throw new Error("You must provide an username to search for");
      const userCollection = await users();
      const user = await userCollection.findOne({ "profile.username": username });
      if (user === null) throw new Error("No user with that username");

      return user;
    },

    async getUserById(id) {
        if(id === undefined || typeof id !== "string"){
            throw new Error("id is not a string");
        }
        if (!id) throw new Error("You must provide an id to search for");

        const userCollection = await users();
        const user = await userCollection.findOne({ _id: id });
        if (user === null) throw new Error("No user with that id");

        return user;
    },

    async addUser({username, password, bio}) {
      const userCollection = await users();
      const user = await userCollection.findOne({ "profile.username": username });

      if(username === undefined || typeof username !== "string"){
        throw new Error("Invalid Username");
      }
      if(user){
        throw new Error("Username Taken");
      }
      if(password === undefined || typeof password !== "string"){
        throw new Error("Invalid password");
      }
      if(bio === undefined || typeof bio !== "string"){
        throw new Error("Invalid bio");
      }

      let setId = uuidv4();
      const newUser = {
        sessionid: "0", //This will be set to a non-zero uuid upon login
        hashedPassword: password, //Need to actually hash it (Bcrypt)
        profile: {
            username: username,
            bio: bio,
            _id: setId
        },
        _id: setId
      };

      const newInsertInformation = await userCollection.insertOne(newUser);
      return await this.getUserById(newInsertInformation.insertedId);
    },

    async verifyUserPassword(username, password){
      const userCollection = await users();
      const user = await userCollection.findOne({ "profile.username": username });
      if(!user){
        return {
          status: false,
          message: "Username invalid"
        };
      }
      else if(!bcrypt.compareSync(password, user.hashedPassword)){
        return {
          status: false,
          message: "Incorrect password"
        };
      }else {
        return {
          status: true,
          message: `${username}`
        };
      }
    },

    createHashedPassword: (password) => {
      if(password === undefined || typeof password !== "string"){
        throw new Error("Invalid password");
      }
      var salt = bcrypt.genSaltSync(7);
      let hash = bcrypt.hashSync(password, salt);
      return hash;
    },

};
