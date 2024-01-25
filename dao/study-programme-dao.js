require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const { get_response } = require("../response.schema");

const uri = process.env.MONGODB_URI;

class StudyProgrammeDao {

  // Constructor sets the URI for connecting to MongoDB and initializes the MongoDB client
  constructor() {
    this.uri = process.env.MONGODB_URI;
    this.client = new MongoClient(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.dbName = process.env.DB_NAME;

    this.connect();
  }


  // Method to establish a connection to the MongoDB database
  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      console.log("Connected to the database");
    } catch (error) {
      console.error("Error connecting to the database", error);
      throw get_response("Error connecting to the database", 500, error);
    }
  }
  async create(programme) {
    const client = new MongoClient(uri);

    try {

      const collection = this.db.collection("Study Programmes");

      const result = await collection.insertOne(programme);

      console.log(`Study Programme saved with ID: ${result.insertedId}`);

      return get_response("Study Programme saved", 200, true);;
    } catch (error) {
      console.error("Error saving study programme", error);
      throw get_response("Error saving study programme", 500, error);
    } finally {
      await client.close();
    }
  }

  async getAll() {
    const client = new MongoClient(uri);

    try {

      const collection = this.db.collection("Study Programmes");

      const studyProgrammes = await collection.find({}).toArray();

      return get_response("Study programmes obtained", 200, studyProgrammes);
    } catch (error) {
      console.error("Error retrieving study programmes:", error);
      throw get_response("Error retrieving study programmes:", 500, error);
    } finally {
      await client.close();
    }
  }

  async getById(id) {
    console.log(id);
    const client = new MongoClient(uri);

    try {
      await client.connect();

      const collection = this.db.collection("Study Programmes");
      const studyProgramme = await collection.findOne({
        _id: new ObjectId(id),
      });

      return get_response("Study programme obtained", 200, studyProgramme);
    } catch (error) {
      console.error("Error retrieving study programme by ID:", error);
      throw get_response("Error retrieving study programme by ID", 500, error);
    } finally {
      await client.close();
    }
  }

  async update(updatedData) {
    const client = new MongoClient(uri);

    try {
      await client.connect();

      const collection = this.db.collection("Study Programmes");

      //Cant send _id on update
      let _id = updatedData._id;
      delete updatedData["_id"];
      
      const result = await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: updatedData }
      );

      if (result.modifiedCount > 0) {
        console.log(`Study Programme updated with ID: ${updatedData._id}`);
        return get_response("Study Programme updated", 200, true);
      } else {
        console.log(`Study Programme not found or not modified with ID: ${updatedData._id}`);
        return get_response("Study Programme not found or not modified", 500, false);

      }
    } catch (error) {
      console.error("Error updating study programme:", error);
      throw get_response("Error updating study programme:", 500, error);
    } finally {
      await client.close();
    }
  }

  async remove(id) {
    const client = new MongoClient(uri);

    try {
      await client.connect();

      const collection = this.db.collection("Study Programmes");

      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount > 0) {
        console.log(`Study Programme deleted with ID: ${id}`);
        return get_response("Study Programme deleted", 200, true);
      } else {
        console.log(`Study Programme not found or not deleted with ID: ${id}`);
        return get_response("Study Programme not found or not deleted with ID", 500, false);
      }
    } catch (error) {
      console.error("Error deleting study programme:", error);
      throw get_response("Error deleting study programme", 500, false);
    } finally {
      await client.close();
    }
  }

}

module.exports = StudyProgrammeDao;
