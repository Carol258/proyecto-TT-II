// RUTAS MÓDULO (ADMINISTRADOR)
const { Router, application } = require("express");
const router = Router();
const { renderModuleForm, createNewModule, showModule, renderVideo, renderTestForm, addTest, renderTest, resultsTest, renderUpdateModule, updateModule, deleteModule, resourcesModules, updateResourcesModules, createResourcesModule } = require('../controllers/modules.controllers')
const { isAuthenticated } = require('../helpers/auth');



// CREAR MÓDULO
router.get('/modulesCourse/add', isAuthenticated, renderModuleForm);

router.post('/modulesCourse/newModule', isAuthenticated, createNewModule);



// MOSTRAR CONTENIDO DEL MÓDULO
router.get('/modulesCourse/showModule/:id', isAuthenticated, showModule);

router.get('/modulesCourse/renderVideo/:name/:id?', isAuthenticated, renderVideo);



// AÑADIR CUESTIONARIO
router.get('/modulesCourse/renderTestForm', isAuthenticated, renderTestForm);

router.post('/modulesCourse/addTest', isAuthenticated, addTest);



// MOSTRAR CUESTIONARIO (USER)
router.get('/modulesCourse/test', isAuthenticated, renderTest);

router.post('/modulesCourse/results', isAuthenticated, resultsTest);



// MODIFICAR MÓDULO
router.get('/modulesCourse/updateModule/:id', isAuthenticated, renderUpdateModule);

router.post('/modulesCourse/updateModuleDone/:id', isAuthenticated, updateModule);


// ELIMINAR MÓDULO
router.get('/modulesCourse/deleteModule/:id', isAuthenticated, deleteModule);


// MOSTRAR LINKS DE RECURSOS
router.get('/modulesCourse/resourcesModules', isAuthenticated, resourcesModules);

router.post('/modulesCourse/createResourcesModules', isAuthenticated, createResourcesModule);

router.post('/modulesCourse/updateResourcesModules/:name', isAuthenticated, updateResourcesModules)


module.exports = router;