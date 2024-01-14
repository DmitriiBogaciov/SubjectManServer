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
  async createSubject(subject) {
    try {
      const result = await this.db.collection("subjects").insertOne(subject);
      return get_response(
        "Subject created successfully!",
        200,
        result.acknowledged
      );
    } catch (error) {
      console.error("Error creating subject", error);
      throw get_response("Error creating subject", 500, error);
    }
  }

  // Method to retrieve a subject by its unique identifier (_id)
  async getSubjects(subjectIds) {
    if (subjectIds === undefined || subjectIds == null)
      return get_response("You did not sent any valid ids", 400, {});
    try {
      const objectIds = subjectIds?.map((id) => new ObjectId(id));

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
  async getAllSubjects() {
    try {
      const result = await this.db.collection("subjects").find({}).toArray();
      return get_response("Subjects obtained successfully!", 200, result);
    } catch (error) {
      console.error("Error getting subjects", error);
      throw get_response("Error getting subjects", 500, error);
    }
  }


  // Method to update an existing subject based on its unique identifier (_id)
  async updateSubject(subjectId, updatedSubject) {
    try {
      const result = await this.db.collection('subjects').updateOne(
        { _id: new ObjectId(subjectId) },
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
  async deleteSubject(subjectId) {
    try {
      const result = await this.db.collection('subjects').deleteOne({ _id: new ObjectId(subjectId) });
      //Removing references 
      const all_sp_response = await study_programme_dao.getAll();
      if (all_sp_response.response_code !== 500) {
        for (let s in all_sp_response.result) {

          let current_sp = JSON.parse(JSON.stringify(all_sp_response.result[s]));
        
          //Removing subject from study programme
          if (current_sp.subjects) {

            current_sp.subjects = current_sp.subjects.filter((subject) => {
              if (subject.subjectId !== subjectId) {
                return subject
              }           
            });
          }

          //Updating study programme
          let programme_id = current_sp._id;
          delete current_sp._id;

          if (current_sp.subjects) {
            if (all_sp_response.result[s].subjects.length > current_sp.subjects.length) {
              let updated_programme = await study_programme_dao.update(programme_id, current_sp);
              if (updated_programme.response_code === 500)
                return get_response("Error updating study programme when deleting subject", 500, updated_programme.result)
            }
          }
        }
      }
      else return all_sp_response;

      if (result.deletedCount > 0) {
        return get_response("Subject deleted successfully!", 200, true);
      } else {
        return get_response("Subject not found or not deleted", 404, false);
      }
    } catch (error) {
      console.error('Error deleting subject', error);
      throw get_response("Subject was not deleted!", 500, error);
    }
  }
}

module.exports = SubjectDAO;
