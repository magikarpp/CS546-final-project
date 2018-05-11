const mongoCollections = require("../config/mongoCollections");
const campgrounds = mongoCollections.campgrounds;
const users = mongoCollections.users;
//const users = require("./users");
//const uuid = require("node-uuid");
const uuidv4 = require('uuid/v4');
const userData = require('./users');

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

    async removeCampById(id, username) {
        if(id === undefined || typeof id !== "string"){
            throw new Error("id is not a string");
        }
        if (!id) throw new Error("You must provide an id to search for");
        if(username === undefined || typeof username !== "string"){
            throw new Error("username is not a string");
        }
        if (!username) throw new Error("Invalid username");

        const userCollection = await users();
        const campgroundCollection = await campgrounds();

        const campground = await campgroundCollection.findOne({ _id: id });
        if (campground === null) throw new Error("No campground with that id");
        //delete campground on associated account
        const user = await userCollection.findOne({ "profile.username": username });
        for (camp in user.campgrounds){
            if(user.campgrounds[camp]._id == id){
                user.campgrounds.splice(camp, 1);
                await userCollection.findOneAndUpdate ({ _id: user._id }, {"$set": { campgrounds: user.campgrounds }});
            }
        }
        //delete campground
        await campgroundCollection.deleteOne({ _id: id });
    },

    async updateCampById(id, campground, img) {
        if(id === undefined || typeof id !== "string"){
            throw new Error("id is not a string");
        }
        if (!id) throw new Error("You must provide an id to search for");

        const campgroundCollection = await campgrounds();
        await campgroundCollection.findOneAndUpdate ({ _id: id }, {"$set": { name: campground.name, description: campground.description, location: campground.location, price: campground.price, contact_info: campground.contact_info }});
        if(img){
            await campgroundCollection.findOneAndUpdate ({ _id: id }, {"$set": { image: img}});
        }
    },

    async addCampground({name, description, price, location, contact_info}, image, owner) {
        const campgroundCollection = await campgrounds();
        const userCollection = await users();
        //console.log(name);

        let setId = uuidv4();
        const newCampground = {
          _id: setId,
          name: name,
          description: description,
          location: location,
          image: image,
          price: price,
          contact_info: contact_info,
          reviews: [],
          owner: owner
        };

        const newInsertInformation = await campgroundCollection.insertOne(newCampground);
        const user = await userCollection.findOne({ "profile.username": owner });
        //console.log(user.campground);
        if(!user){
          throw new Error("Username does not exist");
        }
        user.campgrounds.push(newCampground);
        await userCollection.findOneAndUpdate ({ "profile.username": owner }, {"$set": { campgrounds: user.campgrounds }});
        //console.log(user);
        return await this.getCampById(newInsertInformation.insertedId);
    },

    async addReviewById(id, {review, rating}, reviewer){
        if(id === undefined || typeof id !== "string"){
            throw new Error("id is not a string");
        }
        if (!id) throw new Error("You must provide an id to search for");
        if(review === undefined || typeof review !== "string"){
            throw new Error("review is not a string");
        }
        if (!review) throw new Error("You must provide an review to search for");
        if(rating === undefined || typeof rating !== "string" || isNaN(rating)){
            throw new Error("rating is not a string or number");
        }
        if (!rating) throw new Error("You must provide an rating to search for");
        if(reviewer === undefined || typeof reviewer !== "string"){
            throw new Error("reviewer is not a string");
        }
        if (!reviewer) throw new Error("You must provide an reviewer to search for");

        const campgroundCollection = await campgrounds();
        const camp = await campgroundCollection.findOne({_id:id});
        if (camp === null) throw new Error("No campground with that id");
        camp.reviews.push({review, rating, reviewer});
        await campgroundCollection.findOneAndUpdate ({ _id: id }, {"$set": { reviews: camp.reviews }});
    },
    
    async getRatingById(id) {
        if(id === undefined || typeof id !== "string"){
            throw new Error("id is not a string");
        }
        if (!id) throw new Error("You must provide an id to search for");

        const campgroundCollection = await campgrounds();
        const campground = await campgroundCollection.findOne({ _id: id });
        if (campground === null) throw new Error("No campground with that id");

        let campgroundRating = 0;
        for (review in campground.reviews){
            //console.log("Current Rating: " + campground.reviews[review].rating);
            campgroundRating += parseInt(campground.reviews[review].rating);
            //console.log("Total Rating so far: " + campgroundRating);
        }
        campgroundRating /= campground.reviews.length;
        //console.log(campgroundRating);
        //console.log(campground.reviews.length);
        return campgroundRating;
    },

    async removeAllCamps() {
        let camps = await this.getAllCampgrounds();
        for(camp in camps){
            await campgroundCollection.deleteOne({ _id: camps[camp]._id });
        }
    }

};
