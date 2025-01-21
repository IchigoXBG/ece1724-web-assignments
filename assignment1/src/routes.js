const express = require("express");
const router = express.Router();
const db = require("./database");
const { validatePaper } = require("./middleware");
const dbOperations = require("./database");

// GET /api/papers
router.get("/papers", async (req, res, next) => {
  try {
    const filters = {
      year: req.query.year ? parseInt(req.query.year) : null,
      published_in: req.query.published_in,
      limit: req.query.limit ? parseInt(req.query.limit) : 10,
      offset: req.query.offset ? parseInt(req.query.offset) : 0,
    };
    
   
    const result = await dbOperations.getAllPapers(filters);
    
    const papers = Object.values(result);

    res.status(201).json(papers);

    // Your implementation here
  } catch (error) {
    next(error);
  }
});

// GET /api/papers/:id
router.get("/papers/:id", async (req, res, next) => {
  try {
    // Your implementation here
  } catch (error) {
    next(error);
  }
});

// POST /api/papers
router.post("/papers", async (req, res, next) => {
  try {

    const errors = validatePaper(req.body);

    if (errors.length > 0) {

      throw { type: "ValidationError", messages: errors };

    }
  
    // Get fields from the request body
    const { title, authors, published_in, year } = req.body;

    const result = await dbOperations.createPaper({ title, authors, published_in, year });

    const result_paper = await dbOperations.getPaperById(result.id);

    // change timestamp format to ISO 8601
    result_paper.created_at = new Date(result_paper.created_at).toISOString();
    result_paper.updated_at = new Date(result_paper.updated_at).toISOString();

    res.status(201).json(result_paper);

  } catch (error) {
    next(error);
  }
});

// PUT /api/papers/:id
router.put("/papers/:id", async (req, res, next) => {
  try {
    const errors = validatePaper(req.body);
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ error: "Validation Error", messages: errors });
    }

    // Your implementation here
  } catch (error) {
    next(error);
  }
});

// DELETE /api/papers/:id
router.delete("/papers/:id", async (req, res, next) => {
  try {
    // Your implementation here
  } catch (error) {
    next(error);
  }
});

module.exports = router;
