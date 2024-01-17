require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const { get_response } = require("../response.schema");

const uri = process.env.MONGODB_URI;

class StudyProgrammeDao {
  
  async create(programme) {
    const client = new MongoClient(uri);

    try {
      await client.connect();

      const database = client.db("SubjectMan");
      const collection = database.collection("Study Programmes");

      const result = await collection.insertOne(programme);

      console.log(`Study Programme saved with ID: ${result.insertedId}`);

      return get_response("Study Programme saved",200,true);;
    } catch (error) {
      console.error("Error saving study programme", error);
      throw get_response("Error saving study programme",500, error);
    } finally {
      await client.close();
    }
  }

  async getAll() {
    const client = new MongoClient(uri);

    try {
      await client.connect();

      const database = client.db("SubjectMan");
      const collection = database.collection("Study Programmes");

      const studyProgrammes = await collection.find({}).toArray();

      return get_response("Study programmes obtained",200,studyProgrammes);
    } catch (error) {
      console.error("Error retrieving study programmes:", error);
      throw get_response("Error retrieving study programmes:",500, error);
    } finally {
      await client.close();
    }
  }

  async getById(id) {
    console.log(id);
    const client = new MongoClient(uri);

    try {
      await client.connect();

      const database = client.db("SubjectMan");
      const collection = database.collection("Study Programmes");

      const studyProgramme = await collection.findOne({
        _id: new ObjectId(id),
      });

      return get_response("Study programme obtained",200,studyProgramme);
    } catch (error) {
      console.error("Error retrieving study programme by ID:", error);
      throw get_response("Error retrieving study programme by ID",500, error);
    } finally {
      await client.close();
    }
  }

  async update(id, updatedData) {
    const client = new MongoClient(uri);

    try {
      await client.connect();

      const database = client.db("SubjectMan");
      const collection = database.collection("Study Programmes");

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );

      if (result.modifiedCount > 0) {
        console.log(`Study Programme updated with ID: ${id}`);
        return get_response("Study Programme updated",200,true);
      } else {
        console.log(`Study Programme not found or not modified with ID: ${id}`);
        return get_response("Study Programme not found or not modified",500,false);
        
      }
    } catch (error) {
      console.error("Error updating study programme:", error);
      throw get_response("Error updating study programme:",500,error);
    } finally {
      await client.close();
    }
  }

  async remove(id) {
    const client = new MongoClient(uri);

    try {
      await client.connect();

      const database = client.db("SubjectMan");
      const collection = database.collection("Study Programmes");

      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount > 0) {
        console.log(`Study Programme deleted with ID: ${id}`);
        return get_response("Study Programme deleted",200,true);
      } else {
        console.log(`Study Programme not found or not deleted with ID: ${id}`);
        return get_response("Study Programme not found or not deleted with ID",500,false);
      }
    } catch (error) {
      console.error("Error deleting study programme:", error);
      throw get_response("Error deleting study programme",500,false);
    } finally {
      await client.close();
    }
  }

  async checkSubjectsExist(subjects) {
    const client = new MongoClient(uri);

    try {
      await client.connect();

      const database = client.db("test");
      const subjectCollection = database.collection("subjects");

      for (const subject of subjects) {
        const subjectId = subject.subjectId;
        const existingSubject = await subjectCollection.findOne({
          _id: new ObjectId(subjectId),
        });

        const count = await subjectCollection.countDocuments();
        console.log(`Number of documents in 'subjects' collection: ${count}`);

        if (!existingSubject) {
          console.log(`Subject not found with ID: ${subjectId}`);
          return get_response(`Subject not found with ID: ${subjectId}`,500,false);
        }
      }

      return get_response("Subject found",200,true);
    } catch (error) {
      console.error("Error checking subjects:", error);
      throw get_response("Error checking subjects:",500, error);;
    } finally {
      await client.close();
    }
  }
}

module.exports = StudyProgrammeDao;
