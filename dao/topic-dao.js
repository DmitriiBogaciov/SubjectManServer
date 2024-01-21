require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const { get_response } = require("../response.schema");


class TopicDAO {
  // Constructor sets the URI for connecting to MongoDB and initializes the MongoDB client
  constructor() {
    this.uri = process.env.MONGODB_URI;
    this.client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });
    this.dbName = process.env.DB_NAME;

    this.connect();
  }

  // Method to establish a connection to the MongoDB database
  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(this.dbName);
    } catch (error) {
      console.error('Error connecting to DB', error);
      throw get_response("Error connecting to DB", 500, error);
    }
  }

  // Method to close the connection to the MongoDB database
  async disconnect() {
    try {
      await this.client.close();
      console.log('Disconnected from the database');
    } catch (error) {
      console.error('Error disconnecting to DB', error);
      throw get_response("Error disconnecting to DB", 500, error);
    }
  }

  // Method to create a new topic in the 'topics' collection
  async create(topic) {
    try {

      const result = await this.db.collection('topics').insertOne(topic);

      if (result.acknowledged) {
        return get_response("Topic successfully created!", 200, { id: result.insertedId });
      } else {
        throw new Error("Insert operation not acknowledged");
      }
    } catch (error) {
      console.error('Topic was not created', error);
      throw get_response("Topic was not created", 500, error);
    }
  }

  // Method to retrieve a topic by its unique identifier (_id)
  async get(topicIds) {
    try {
      const objectIds = topicIds.map(id => new ObjectId(id));

      const result = await this.db.collection('topics').find({ _id: { $in: objectIds } }).toArray();
      console.log(result)
      if(result.length <= 0)
        return get_response("No topics found with given IDs", 400, result);
      else
        return get_response("Topics successfully obtained!", 200, result);

      
    } catch (error) {
      console.error('Could not get topic', error);
      throw get_response("Could not get topic", 500, error);
    }
  }

  async list() {
    try {
      const result = await this.db.collection('topics').find({}).toArray();
      return get_response("Topics successfully obtained!", 200, result);
    } catch (error) {
      console.error('Could not get topics', error);
      throw get_response("Could not get topics", 500, error);
    }
  }

  // Method to update an existing topic based on its unique identifier (_id)
  async update(topicId, updatedTopic) {
    try {
      const result = await this.db.collection('topics').updateOne(
        { _id: new ObjectId(topicId) },
        { $set: updatedTopic }
      );
      return get_response("Topic successfully updated!", 200, result.modifiedCount > 0);
    } catch (error) {
      console.error('Error updating topic', error);
      throw get_response("Topic was NOT updated!", 500, error);
    }
  }

  // Method to delete a topic based on its unique identifier (_id)
  async delete(topicId) {
    try {

      const result = await this.db.collection('topics').deleteOne({ _id: new ObjectId(topicId) });

      if (result.deletedCount > 0) {
        //delete topic from subject
        await this.db.collection('subjects').updateMany(
          { "topicIdList": topicId },
          { $pull: { "topicIdList": topicId } }
        );
        return get_response("Topic successfully deleted!", 200, true);
      } else {
        return get_response("Topic was NOT deleted!", 404, false);
      }
    } catch (error) {
      console.error('Error deleting topic', error);
      throw get_response("Internal Server Error", 500, error);
    }
  }

  async IDsExistsInDB(IDs) {
    //Check if digital content with given ID exists
    let all_content = (await this.list());
    console.log(all_content.result)
    if (all_content.response_code > 400)
      return all_content;
    else {
      let was_found = false;
      if (IDs.length > 0) {
        for (let new_dc in IDs) {
          for (let dc in all_content.result) {
            if (all_content.result[dc].id == IDs[new_dc]) {
              was_found = true;
              break;
            }
          }
          console.log(was_found)
          //Was not found
          if (was_found === false)
            return get_response("Topics with given IDs were NOT found in DB", 500, false);

          was_found = false;
        }
      }
    }
    return get_response("Topics with given IDs were found in DB", 200, true);
  }
  
}

module.exports = TopicDAO;
