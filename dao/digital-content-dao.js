require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const { get_response } = require("../response.schema");

class DigitalContentDAO {
  constructor() {
    this.uri = process.env.MONGODB_URI;
    this.client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });
    this.dbName = process.env.DB_NAME;
    this.connect();
  }

  // Establishes a connection to the MongoDB database
  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      console.log('Connected to the database');
    } catch (error) {
      console.error('Error connecting to the database', error);
      throw get_response("Error connecting to the database",500,error);
    }
  }

  // Closes the connection to the MongoDB database
  // async disconnect() {
  //   try {
  //     await this.client.close();
  //     console.log('Disconnected from the database');
  //   } catch (error) {
  //     console.error('Error disconnecting from the database', error);
  //     throw error;
  //   }
  // }

  // Creates a new digital content in the 'digitalContents' collection
  async createDigitalContent(content) {
    try {
      const result = await this.db.collection('digitalContents').insertOne(content);
      console.log(result);

      // Извлекаем id из результата
      const insertedId = result.insertedId;

      // Формируем объект ответа с id
      let response = get_response("Digital content created.", 200, {
        acknowledged: result.acknowledged,
        insertedId: insertedId,
      });

      return response;
    } catch (error) {
      console.error('Error creating digital content', error);
      throw get_response("Error creating digital content", 500, error);
    }
  }

  // Retrieves digital content by its unique identifier (_id)
  async getDigitalContent(contentIds) {
    try {
      // Преобразовываем массив строковых ID в массив объектов ObjectId
      const objectIdArray = contentIds.map((contentId) => new ObjectId(contentId));

      // Используем find с массивом ObjectId
      const result = await this.db.collection('digitalContents').find({ _id: { $in: objectIdArray } }).toArray();

      return get_response("Digital content obtained.", 200, result);
    } catch (error) {
      console.error('Error getting digital content', error);
      throw get_response("Error getting digital content", 500, error);
    }
  }

  //Returns list of digital content
  async getAllDigitalContent() {
    try {
      const result = await this.db.collection('digitalContents').find({}).toArray();
      let response = get_response("Digital content/s obtained.",200,result);
      return response;
    } catch (error) {
      console.error('Error getting digital content', error);
      throw get_response("Error getting digital content",500,error);;
    }
  }

  // Updates existing digital content based on its unique identifier (_id)
  async updateDigitalContent(contentId, updatedContent) {
    try {
      const result = await this.db.collection('digitalContents').updateOne(
        { _id: new ObjectId(contentId) },
        { $set: updatedContent }
      );

      let response = get_response("Digital content updated.",200,result.modifiedCount > 0);
      return response;
    } catch (error) {
      console.error('Error updating digital content', error);
      throw get_response('Error updating digital content',500, error);
    }
  }

  // Deletes digital content based on its unique identifier (_id)
  async deleteDigitalContent(contentId) {
    try {
      const subjectsWithDeletedContent = await this.db.collection('subjects').updateMany(
        { "digitalContentIdList": contentId },
        { $pull: { "digitalContentIdList": contentId } }
      );

      const topicsWithDeletedContent = await this.db.collection('topics').updateMany(
        { "digitalContentIdList": contentId },
        { $pull: { "digitalContentIdList": contentId } }
      );

      const result = await this.db.collection('digitalContents').deleteOne({ _id: new ObjectId(contentId) });

      if (result.deletedCount > 0) {
        return get_response("Digital content deleted.", 200, true);
      } else {
        return get_response("Digital content was NOT deleted!", 404, false);
      }
    } catch (error) {
      console.error('Error deleting digital content', error);
      throw get_response('Error deleting digital content', 500, error);
    }
  }
}

module.exports = DigitalContentDAO;
