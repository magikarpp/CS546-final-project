const mongoCollections = require("../config/mongoCollections");
const campgrounds = mongoCollections.campgrounds;
//const users = require("./users");
//const uuid = require("node-uuid");
const uuidv4 = require('uuid/v4');

module.exports = {

    async getAllCampgrounds() {
        return campgrounds().then(campgroundCollection => {
          return campgroundCollection.find({}).toArray();
        });
      },

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

    async removeCampById(id) {
        if(id === undefined || typeof id !== "string"){
            throw new Error("id is not a string");
        }
        if (!id) throw new Error("You must provide an id to search for");
    
        const campgroundCollection = await campgrounds();
        await campgroundCollection.deleteOne({ _id: id });
    },

    async updateCampById(id, campground) {
        if(id === undefined || typeof id !== "string"){
            throw new Error("id is not a string");
        }
        if (!id) throw new Error("You must provide an id to search for");
    
        const campgroundCollection = await campgrounds();
        await campgroundCollection.findOneAndUpdate ({ _id: id }, {"$set": { name: campground.name, description: campground.description, location: campground.location, price: campground.price, contact_info: campground.contact_info }});
    },

    async addCampground({name, description, price, location, contact_info}, image) {
        //ERROR CHECK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
        const campgroundCollection = await campgrounds();
        //console.log(name);

        let setId = uuidv4();
        const newCampground = {
          _id: setId,
          name: name,
          description: description,
          location: location,
          image: image,
          price: price,
          contact_info: contact_info
        };

        const newInsertInformation = await campgroundCollection.insertOne(newCampground);
        return await this.getCampById(newInsertInformation.insertedId);
    }

};
