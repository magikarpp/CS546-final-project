const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
//const users = require("./users");
//const uuid = require("node-uuid");
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt-nodejs');

module.exports = {
    async setSessionId(username, trig){
      if(username === undefined || typeof username !== "string"){
          throw new Error("username is not a string");
      }
      const userCollection = await users();
      const user = await userCollection.findOne({ "profile.username": username });
      if(trig == 0){
        user._id = "0";
      }
      if(trig == 1){
        user._id = uuidv4();
      }
    },

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

      if(username == "" || username === undefined || typeof username !== "string"){
        return {
          status: false,
          message: "Username invalid"
        };
      }
      if(user){
        return {
          status: false,
          message: "Username already taken"
        };
      }
      if(password == "" || password === undefined || typeof password !== "string"){
        return {
          status: false,
          message: "Password invalid"
        };
      }
      if(bio === undefined || typeof bio !== "string"){
        return {
          status: false,
          message: "Bio invalid"
        };
      }
      
      var newArray = new Array();

      const newUser = {
        sessionid: "0", //This will be set to a non-zero uuid upon login
        hashedPassword: password, //hashed using createHashedPassword
        _id: uuidv4(),
        campgrounds: newArray,
        profile: {
            username: username,
            bio: bio
        }
      };

      const newInsertInformation = await userCollection.insertOne(newUser);
      return {
        status: true,
        message: "New User Created"
      };
    },

    async updateUser(id, username, bio){
      const userCollection = await users();
      const anotherUser = await userCollection.findOne({ "profile.username": username, _id: {"$ne": id} });

      if(username == "" || username === undefined || typeof username !== "string"){
        return {
          status: false,
          message: "Username invalid"
        };
      }
      if(anotherUser){
        return {
          status: false,
          message: "Username already taken"
        };
      }
      if(bio === undefined || typeof bio !== "string"){
        return {
          status: false,
          message: "Bio invalid"
        };
      }

      await userCollection.findOneAndUpdate ({ _id: id }, {"$set": { "profile.username": username, "profile.bio": bio }});
      return {
        status: true,
        message: "Account Updated!"
      };
    },

    async verifyUserPassword(username, password){
      const userCollection = await users();
      const user = await userCollection.findOne({ "profile.username": username });
      if(username == "" || username === undefined || typeof username !== "string" || !user){
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
      if(password == "" || password === undefined || typeof password !== "string"){
        throw new Error("Invalid password");
      }
      var salt = bcrypt.genSaltSync(7);
      let hash = bcrypt.hashSync(password, salt);
      return hash;
    },

    async deleteUser(id){
      if(!id){
        throw new Error("id must be provided");
      }
      const userCollection = await users();
      const user = await userCollection.findOne({ _id: id });
      if(!user){
        return {
          status: false,
          message: `User does not exist`
        };
      }
      const username = user.profile.username;
      const result = await userCollection.deleteOne({ _id: id });
      if (!result){
        return {
          status: false,
          message: `User not found with id: ${id}`
        };
      }
      return {
        status: true,
        message: `User Account "${username}" has been deleted`
      };
    }

};
