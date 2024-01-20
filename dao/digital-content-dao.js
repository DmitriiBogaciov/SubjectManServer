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
      throw get_response("Error connecting to the database", 500, error);
    }
  }


  // Creates a new digital content in the 'digitalContents' collection
  async create(content) {
    try {
      const result = await this.db.collection('digitalContents').insertOne(content);
      console.log(result);

      // Извлекаем id из результата
      const insertedId = result.insertedId;

      let response = get_response("Digital content created.", 200, {
        acknowledged: result.acknowledged,
        insertedId: insertedId,
      });

      return response;
    } catch (error) {
      throw get_response("Error creating digital content", 500, error);
    }
  }

  // Retrieves digital content by its unique identifier (_id)
  async get(contentIds) {
    try {
      const objectIdArray = contentIds.map((contentId) => new ObjectId(contentId));
      const result = await this.db.collection('digitalContents').find({ _id: { $in: objectIdArray } }).toArray();

      return get_response("Digital content obtained.", 200, result);
    } catch (error) {
      console.error('Error getting digital content', error);
      throw get_response("Error getting digital content", 500, error);
    }
  }

  //Returns list of digital content
  async list() {
    try {
      const result = await this.db.collection('digitalContents').find({}).toArray();
      let response = get_response("Digital content/s obtained.", 200, result);
      return response;
    } catch (error) {
      console.error('Error getting digital content', error);
      throw get_response("Error getting digital content", 500, error);;
    }
  }

  // Updates existing digital content based on its unique identifier (_id)
  async update(contentId, updatedContent) {
    try {
      const result = await this.db.collection('digitalContents').updateOne(
        { _id: new ObjectId(contentId) },
        { $set: updatedContent }
      );

      let response = get_response("Digital content updated.", 200, result.modifiedCount > 0);
      return response;
    } catch (error) {
      console.error('Error updating digital content', error);
      throw get_response('Error updating digital content', 500, error);
    }
  }

  // Deletes digital content based on its unique identifier (_id)
  async delete(contentId) {
    try {
      const subjectsWithDeletedContent = await this.db.collection('subjects').updateMany(
        { "digitalContentIdList": contentId },
        { $pull: { "digitalContentIdList": contentId } }
      );

      /*const topicsWithDeletedContent = await this.db.collection('topics').updateMany(
        { "digitalContentIdList": contentId },
        { $pull: { "digitalContentIdList": contentId } }
      );*/

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

  async IDsExistsInDB(IDs) {
    //Check if digital content with given ID exists
    console.log(IDs)
    let all_digital_content = (await this.list());
    console.log(all_digital_content.result)
    if (all_digital_content.response_code > 400)
      return all_digital_content;
    else {
      let was_found = false;
      if (IDs.length > 0) {
        for (let new_dc in IDs) {
          for (let dc in all_digital_content.result) 
          {
            if (all_digital_content.result[dc].id === IDs[new_dc]) 
            {
              console.log("Match")
              was_found = true;
              break;
            }
          }
          console.log(was_found)
          //Was not found
          if(was_found === false)
            return get_response("Digital contents with given IDs were NOT found in DB", 500, false);
         
          was_found = false;
        }
      }
    }
    return get_response("Digital contents with given IDs were found in DB", 200, true);
  }
}

module.exports = DigitalContentDAO;
