const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./paper_management.db", (err) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log("Connected to SQLite database");
  }
});

// TODO: Create a table named papers with the schema specified in the handout

// TODO: Implement these database operations
const dbOperations = {
  createPaper: async (paper) => {
    // Your implementation here
    // Hint: You need to:
    // 1. Create and execute an INSERT SQL statement
    // 2. Use await to handle the promise
    // 3. Return the created paper with its ID
    // Example structure:
    // try {
    //   const result = await new Promise((resolve, reject) => {
    //     db.run(
    //       "INSERT INTO ... VALUES ...",
    //       [...values],
    //       function(err) {
    //         if (err) reject(err);
    //         else resolve(this.lastID);
    //       }
    //     );
    //   });
    //   return { id: result, ...paper };
    // } catch (error) {
    //   throw error;
    // }
    
    try {
      const result = await new Promise((resolve, reject) => {
        db.run(
          "INSERT INTO papers (title, authors, published_in, year) VALUES (?, ?, ?, ?)",
          [paper.title, paper.authors, paper.published_in, paper.year],
          function(err) {
            if (err) reject(err);
            else resolve(this.lastID);
          }
        );
      });
      return { id: result, ...paper };
    } catch (error) {
      throw error;
    }

  },

  getAllPapers: async (filters = {}) => {
    // Your implementation here
    // Remember to handle filters (year, published_in)
    // Hint:
    // 1. Start with a basic SELECT query
    // 2. Add WHERE clauses based on filters:
    //    - If filters.year exists, add "year = ?"
    //    - If filters.published_in exists, add "published_in LIKE ?"
    // 3. Use an array to store query parameters
    // Example structure:
    // let query = "SELECT * FROM papers";
    // const params = [];
    // if (filters.year) {
    //   query += " WHERE year = ?";
    //   params.push(filters.year);
    // }
    // ...
    // const result = await new Promise((resolve, reject) => {
    //   db.all(query, params, (err, rows) => {
    //     if (err) reject(err);
    //     else resolve(rows);
    //   });
    // });
    const maxLimit = 100;

    let query = "SELECT * FROM papers WHERE 1=1 ";
    const params = [];


    if (filters.year !== undefined && filters.year !== null){
      if(filters.year >= 1900){
        query += "AND year = ? ";
        params.push(filters.year);
      }else{
        throw { type: "Invalid_Query_Parameter"};
      }
    }

    if (filters.published_in !== undefined && filters.published_in !== null) {
      query += " AND published_in LIKE ? COLLATE NOCASE";
      params.push(`%${filters.published_in}%`);
    }


    // Paging Control
    query += " LIMIT ? OFFSET ?";

    if ( filters.limit !== undefined && filters.limit !== null ){
      if (filters.limit <= maxLimit || filters.limit >= 0) {
        params.push(filters.limit);
      }else{
        throw { type: "Invalid_Query_Parameter"};
      }
    }else{
      filters.limit = 10;
      params.push(filters.limit);
    }

    if (filters.offset !== undefined && filters.offset !== null ){
      if (filters.offset >= 0) {
        params.push(filters.offset);
      } else{
        throw { type: "Invalid_Query_Parameter"};
      }
    } else{
      filters.offset = 0;
      params.push(filters.offset);
    }

    console.log("query: ",query);

    try {
      const result = await new Promise((resolve, reject) => {
        db.all(
          query,
          params,
          function(err, rows) {
            if (err) reject(err);
            else resolve(rows);
          }
        );
      });
      return { ...result };
    } catch (error) {
      throw error;
    }





  },

  getPaperById: async (id) => {
    // Your implementation here
    // Hint: Use await with a new Promise that wraps the db.get() operation
    try {
      const result = await new Promise((resolve, reject) => {
        db.get("SELECT * FROM papers WHERE id =?", [id], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
      return result;
    } catch (error) {
      throw error;
    }
    
  },

  updatePaper: async (id, paper) => {
    // Your implementation here
  },

  deletePaper: async (id) => {
    // Your implementation here
  },
};

module.exports = dbOperations;
