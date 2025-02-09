const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./paper_management.db", (err) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log("Connected to SQLite database");
  }
});

// TODO: Create a table named papers with the schema specified in the handout

db.serialize(() => {
  // 创建 papers 表（如果不存在）
  db.run(`
    CREATE TABLE IF NOT EXISTS papers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      authors TEXT NOT NULL,
      published_in TEXT NOT NULL,
      year INTEGER NOT NULL CHECK (year > 1900),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {err});
});

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
    

    let query = "SELECT * FROM papers WHERE 1=1 ";
    const params = [];


    if (filters.year !== null){
        query += "AND year = ? ";
        params.push(filters.year);
    }



    if (filters.published_in !== undefined && filters.published_in !== null) {
      query += " AND published_in LIKE ? COLLATE NOCASE";
      params.push(`%${filters.published_in}%`);
    }


    // Paging Control
    query += " LIMIT ? OFFSET ?";


    params.push(filters.limit);
    params.push(filters.offset);





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
    try{
      
      await new Promise((resolve, reject) => {
        db.run(`UPDATE papers
                SET 
                  title = ?, 
                  authors = ?, 
                  published_in = ?, 
                  year = ?, 
                  updated_at = CURRENT_TIMESTAMP
                WHERE id = ?;
                `, [paper.title, paper.authors, paper.published_in, paper.year, id], (err, row) => {
          if (err) {
            reject(err);
          }
          else{
            resolve(this);
          }
        });
      });

  

    }catch (error) {
      throw error;
    }


  },

  deletePaper: async (id) => {
    
    try {
      await new Promise((resolve, reject) => {
        db.run("DELETE FROM papers WHERE id = ?", [id], (err) => {
          if (err) {
            reject(err);
          }
          else{
            resolve(this);
          }
        });
      });

  

    } catch (error) {
      throw error;
    }

  },
};

module.exports = {
  db, // export the database instance
  ...dbOperations, // spreads all operations as individual exports
};

