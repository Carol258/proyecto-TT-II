// RUTAS DEL INDEX
const { Router } = require('express');
const { renderIndex } = require('../controllers/index.controllers');
const router = Router();


// INICIO
router.get('/', renderIndex);



module.exports = router;