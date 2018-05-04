const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
//const users = require("./users");
//const uuid = require("node-uuid");
const uuidv4 = require('uuid/v4');

module.exports = {

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


    async addUser({name, password, bio}) {
        //ERROR CHECK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
        const userCollection = await users();

        console.log(name);

        let setId = uuidv4();
        const newUser = {
          sessionid: "0", //This will be set to a non-zero uuid upon login
          hashedPassword: password, //Need to actually hash it (Bcrypt)
          profile: {
              name: name,
              bio: bio,
              _id: setId
          },
          _id: setId
        };

        const newInsertInformation = await userCollection.insertOne(newUser);
        return await this.getUserById(newInsertInformation.insertedId);
    }

};
