const mongoCollections = require("../mongoCollections");
const campgrounds = mongoCollections.campgrounds;
//const users = require("./users");
//const uuid = require("node-uuid");
const uuidv4 = require('uuid/v4');

module.exports = {

    async getCampById(id) {
        if(id === undefined || typeof id !== "string"){
            throw new Error("id is not a string");
        }
        if (!id) throw new Error("You must provide an id to search for");
    
        const campgroundCollection = await campgrounds();
        const campground = await campgroundCollection.findOne({ _id: id });
        if (campground === null) throw new Error("No campground with that id");
    
        return campground;
    },


    async addCampground({name, password, bio}) {
        //ERROR CHECK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
        const campgroundCollection = await campgrounds();

        //console.log(name);
        
        let setId = uuidv4();
        const newCampground = {
          _id: setId
        };
    
        const newInsertInformation = await campgroundCollection.insertOne(newCampground);
        return await this.getCampById(newInsertInformation.insertedId);
    }

};