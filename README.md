# Assignments 1 Repository


## Repository Structure

The repository is organized as follows:

/assignment1/

- src/: Starter code for the assignment
- package.json
- README.md

...

## How to Use

1. Install required componet:

   ```bash
   npm install
   ```
2. Start the server

   ```bash
   npm start
   ```

## DataBase

1. Sqlite 3
2. File Name:  paper_management.db

Structure:

```sql
CREATE TABLE papers (  
    id INTEGER PRIMARY KEY AUTOINCREMENT,  
    title TEXT NOT NULL,  
    authors TEXT NOT NULL,    published\_in TEXT NOT NULL,   
    year INTEGER NOT NULL CHECK (year > 1900),  
    created\_at DATETIME DEFAULT CURRENT\_TIMESTAMP,  
    updated\_at DATETIME DEFAULT CURRENT\_TIMESTAMP);
```
