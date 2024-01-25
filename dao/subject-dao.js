require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const { get_response } = require("../response.schema");

//Getting referenced DAO's
const sp_dao = require("./study-programme-dao");
const study_programme_dao = new sp_dao();

class SubjectDAO {
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

  // Method to close the connection to the MongoDB database
  async disconnect() {
    try {
      await this.client.close();
      console.log("Disconnected from the database");
    } catch (error) {
      console.error("Error disconnecting from the database", error);
      throw get_response("Error disconnecting from the databases", 500, error);
    }
  }

  // Method to create a new subject in the 'subjects' collection
  async create(subject) {
    try {
      const result = await this.db.collection("subjects").insertOne(subject);
      return get_response(
        "Subject created successfully!",
        200,
        {_id:result.insertedId}
      );
    } catch (error) {
      console.error("Error creating subject", error);
      throw get_response("Error creating subject", 500, error);
    }
  }

  // Method to retrieve a subject by its unique identifier (_id)
  async get(subjectIds) {
    if (subjectIds === undefined || subjectIds == null)
      return get_response("You did not sent any valid ids", 400, {});
    try {
      const objectIds = subjectIds?.map((_id) => new ObjectId(_id));

      const result = await this.db
        .collection("subjects")
        .find({ _id: { $in: objectIds } })
        .toArray();

      return get_response("Subjects obtained successfully!", 200, result);
    } catch (error) {
      console.error("Error getting subjects by IDs", error);
      throw get_response("Error getting subject by ID", 500, error);
    }
  }
  // Method to retrieve all subjects
  async list() {
    try {
      const result = await this.db.collection("subjects").find({}).toArray();
      return get_response("Subjects obtained successfully!", 200, result);
    } catch (error) {
      console.error("Error getting subjects", error);
      throw get_response("Error getting subjects", 500, error);
    }
  }


  // Method to update an existing subject based on its unique identifier (_id)
  async update(updatedSubject) {
    try {

      let _id = updatedSubject._id;
      delete updatedSubject["_id"];

      const result = await this.db.collection('subjects').updateOne(
        { _id: new ObjectId(_id) },
        { $set: updatedSubject }
      );

      if (result.modifiedCount > 0) {
        // Возвращаем новый объект, полученный из результата обновления
        const updatedSubjectData = await this.db.collection('subjects').findOne({ _id: new ObjectId(subjectId) });
        return get_response("Subject updated successfully!", 200, updatedSubjectData);
      } else {
        return get_response("No subject was updated!", 300, null);
      }
    } catch (error) {
      console.error('Error updating subject', error);
      throw get_response("Subject was not updated!", 500, error);
    }
  }

  // Method to delete a subject based on its unique identifier (_id)
  async delete(subjectId) {
    try {
      const result = await this.db.collection('subjects').deleteOne({ _id: new ObjectId(subjectId) });
      
      if (result.deletedCount > 0) {
        //Deleting refences
        await this.db.collection('Study Programmes').updateMany(
          { "subjects._id": subjectId },
          { "$pull": { "subjects": { "_id": subjectId } } }
       )

        return get_response("Subject deleted successfully!", 200, true);
      } else {
        return get_response("Subject not found or not deleted", 404, false);
      }
    } catch (error) {
      console.error('Error deleting subject', error);
      throw get_response("Subject was not deleted!", 500, error);
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
        for (let newId in IDs) {
          for (let dc in all_content.result) {
            console.log(new ObjectId(all_content.result[dc]._id)+" | "+ IDs[newId])
            if (all_content.result[dc]._id == IDs[newId]) {
              was_found = true;
              break;
            }
          }
          console.log(was_found)
          //Was not found
          if (was_found === false)
            return get_response("Subjects with given IDs were NOT found in DB", 500, false);

          was_found = false;
        }
      }
    }
    return get_response("Subjects with given IDs were found in DB", 200, true);
  }
}

module.exports = SubjectDAO;
