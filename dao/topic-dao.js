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
      console.log('Connected to the database');
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
    }catch (error) {
      console.error('Error disconnecting to DB', error);
      throw get_response("Error disconnecting to DB", 500, error); 
    }
  }

  // Method to create a new topic in the 'topics' collection
  async createTopic(topic) {
    try {
      const result = await this.db.collection('topics').insertOne(topic);

      if (result.acknowledged) {
        // Возвращаем объект с идентификатором созданного топика
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
  async getTopic(topicIds) {
    try {

      const objectIds = topicIds.map(id => new ObjectId(id));

      const result = await this.db.collection('topics').find({ _id: { $in: objectIds } }).toArray();

      return get_response("Topic successfully obtained!",200,result);
    } catch (error) {
      console.error('Could not get topic', error);
      throw get_response("Could not get topic", 500, error); 
    }
  }

  async getAllTopics() {
    try {
      const result = await this.db.collection('topics').find({}).toArray();
      return get_response("Topics successfully obtained!",200,result);
    } catch (error) {
      console.error('Could not get topics', error);
      throw get_response("Could not get topics", 500, error); 
    }
  }

  // Method to update an existing topic based on its unique identifier (_id)
  async updateTopic(topicId, updatedTopic) {
    try {
      const result = await this.db.collection('topics').updateOne(
        { _id: new ObjectId(topicId) },
        { $set: updatedTopic }
      );
      return get_response("Topic successfully updated!",200,result.modifiedCount > 0);
    } catch (error) {
      console.error('Error updating topic', error);
      throw get_response("Topic was NOT updated!", 500, error);
    }
  }

  // Method to delete a topic based on its unique identifier (_id)
  async deleteTopic(topicId) {
    try {

      //delete topic from subject
      const subjectsWithDeletedTopic = await this.db.collection('subjects').updateMany(
        { "topicIdList": topicId },
        { $pull: { "topicIdList": topicId } }
      );
    
      const result = await this.db.collection('topics').deleteOne({ _id: new ObjectId(topicId) });

      if (result.deletedCount > 0) {
        return get_response("Topic successfully deleted!", 200, true);
      } else {
        return get_response("Topic was NOT deleted!", 404, false);
      }
    } catch (error) {
      console.error('Error deleting topic', error);
      throw get_response("Internal Server Error", 500, error);
    }
  }

}

module.exports = TopicDAO;
