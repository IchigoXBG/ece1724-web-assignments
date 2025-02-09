const express = require("express");
const router = express.Router();
const db = require("./database");
const { validatePaper, validateId } = require("./middleware");
const dbOperations = require("./database");

// GET /api/papers
router.get("/papers", async (req, res, next) => {
  try {
    const filters = {
      year: req.query.year,
      published_in: req.query.published_in,
      limit: req.query.limit ? req.query.limit === undefined : 10,
      offset: req.query.offset ? req.query.offset === undefined : 0,
    };

    const maxLimit = 100;

    
    

    if (filters.year !== undefined){
      if(filters.year <= 1900 || isNaN(filters.year) || !/^\d{4,}$/.test(filters.year) ){
        throw { type: "Invalid_Query_Parameter"};
      }
    }else{ 
      filters.year  = null;
    }


    if (isNaN(filters.limit) || !/^\d{1,3}$/.test(filters.limit) || parseInt(filters.limit) > maxLimit || parseInt(filters.limit) < 0 ) {
      throw { type: "Invalid_Query_Parameter"};
    }


    if (isNaN(filters.offset) || filters.offset.trim() === "" || !/^\d+$/.test(filters.offset) || parseInt(filters.offset) < 0 ) {
      throw { type: "Invalid_Query_Parameter"};
    } 

    if (filters.published_in !== undefined  && filters.published_in.trim() === ""){
      throw { type: "Invalid_Query_Parameter"};
    }
    
   
    const result = await dbOperations.getAllPapers(filters);
    
    const papers = Object.values(result);

    res.status(200).json(papers);


  } catch (error) {
    next(error);
  }
});

// GET /api/papers/:id
router.get("/papers/:id", validateId, async (req, res, next) => {
  try {
    // Your implementation here

    const result_paper = await dbOperations.getPaperById(req.params.id);


    if (result_paper === undefined || result_paper === null) {
      throw { type: "Not_Found_Error" };
    }else{
      
      // change timestamp format to ISO 8601
      result_paper.created_at = new Date(result_paper.created_at).toISOString();
      result_paper.updated_at = new Date(result_paper.updated_at).toISOString();

    }


    res.status(200).json(result_paper);



  } catch (error) {
    next(error);
  }
});

// POST /api/papers
router.post("/papers", async (req, res, next) => {
  try {

    const errors = validatePaper(req.body);

    if (errors.length > 0) {
      throw { type: "Validation_Error", messages: errors };
    }
  
    // Get fields from the request body
    const { title, authors, published_in, year } = req.body;

    const result = await dbOperations.createPaper({ title, authors, published_in, year });

    const result_paper = await dbOperations.getPaperById(result.id);

    if (result_paper === undefined || result_paper === null) {
      throw { type: "Not_Found_Error" };
    }else{
      
      // change timestamp format to ISO 8601
      result_paper.created_at = new Date(result_paper.created_at).toISOString();
      result_paper.updated_at = new Date(result_paper.updated_at).toISOString();

    }


    res.status(201).json(result_paper);

  } catch (error) {
    next(error);
  }
});

// PUT /api/papers/:id
router.put("/papers/:id", validateId, async (req, res, next) => {
  try {

    const errors = validatePaper(req.body);
    if (errors.length > 0) {
      throw { type: "Validation_Error", messages: errors };
    }

    await dbOperations.updatePaper(req.params.id, req.body);

    const result_paper = await dbOperations.getPaperById(req.params.id);

    if (result_paper === undefined || result_paper === null) {
      throw { type: "Not_Found_Error" };
    }else{

      // change timestamp format to ISO 8601
      result_paper.created_at = new Date(result_paper.created_at).toISOString();
      result_paper.updated_at = new Date(result_paper.updated_at).toISOString();

    }




    res.status(200).json(result_paper);

    // Your implementation here
  } catch (error) {
    next(error);
  }
});

// DELETE /api/papers/:id
router.delete("/papers/:id", validateId, async (req, res, next) => {
  try {
    
    const result_paper = await dbOperations.getPaperById(req.params.id);
    if (result_paper === undefined || result_paper === null) {
      throw { type: "Not_Found_Error" };
    }

    await dbOperations.deletePaper(req.params.id);

    res.status(204).send();

  } catch (error) {
    next(error);
  }
});

module.exports = router;
