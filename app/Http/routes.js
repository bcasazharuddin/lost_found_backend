const express=require('express');
//const middleWare=require('')
const midlleWare=require('./Middlewares')
const Response=require('../Http/Controller/Response');//Regarding Response Related Data 

const router=express.Router();
router.get('/',Response.default); //Default Value response 
router.post('/v1/authReport',Response.applicationReport)
router.post('/v1/registration',midlleWare.fileUpload({allowedFiles: ['jpeg','jpg','png','pdf']}),Response.registration);
router.post('/v1/login',Response.login);
router.post("/v1/report",midlleWare.fileUpload({allowedFiles: ['jpeg','jpg','png','pdf']}),Response.report);
router.post("/v1/postCategory/add",Response.add_post_category);
router.post("/v1/postCategory/delete",Response.delete_post_category);
router.post("/v1/postCategory/update",Response.update_post_category);
router.get("/v1/postCategory/fetchAll",Response.fetch_post_category);
router.get("/v1/memberInformation/fetchAll",Response.fetch_member_information);
router.post("/v1/memberInformation/delete",Response.delete_member_information);
router.post("/v1/memberInformation/update",Response.update_member_information);
router.get("/v1/lostandfoundItem/fetchAll",Response.fetch_lost_and_found_item);

module.exports=router;