const crudOperation=require('../db_operation/mongoQuery/logsInsert');
var application_report = require('../Models/applicationModel').application_details
const isValid=require('./Controller/validation/customValidation')
const util=require('./../util/customResponse')
const multer = require('multer');
const os = require("os");
const path = require("path");

const Middlewaresfun={}
Middlewaresfun.addInputLogs=(req, res, next)=>{
    console.log('LOGGED');
    console.log(req.url);
    next();
}

/**
 * Heading App id and App validation required 
 * @param {} req 
 * @param {*} res 
 * @param {*} next 
 */
Middlewaresfun.headerApplicationCheck=async (req, res, next)=>{
    let requireFields = {}
    requireFields.application_id = req.headers['x-application-id']
    requireFields.application_name = req.headers['x-application-name']
    var checkdata = await isValid.checkProperties(requireFields);
    if (checkdata.status == false){
        util.getSuccessResponse(res,req,200,checkdata.message,false,'',0,'ref_id','LENDER','');
    }else{
        console.log("-- application_report--",application_report);
    var checkHeaderValidation = await crudOperation.countQuery("res", application_report, { application_id: requireFields.application_id, application_name: requireFields.application_name });
    if (checkHeaderValidation > 0) {
    next();
    }else{
    util.getSuccessResponse(res,req,200,"Invalid Application Id/ Application Name",false,'',0,'ref_id','LENDER','APP_ID_VALIDATION');
    }
}
}

Middlewaresfun.fileUpload = (params) => {
    const tempDir = os.tmpdir(); 
    const dir = params && params.dir ? path.normalize(`${tempDir}/${params.dir}`) : path.normalize(tempDir);
    const allowedFiles = params && params.allowedFiles ? new RegExp(`\\b(${params.allowedFiles.join("|")})\\b`, "i") : new RegExp(/jpeg|jpg|png|xls|xlsx|pdf|doc|docx/, "i");
    const maxFileSize = params && params.maxFileSize ? params.maxFileSize : process.env.MAX_FILE_SIZE_ALLOWED;
    return (req,res,next) => {
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                // Set the destination folder (e.g., /tmp/)
                cb(null, dir)
            },
            filename: function (req, file, cb) {
                // Set the file name with original name and timestamp
                cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
            }
        });
        // Define the maximum size for uploading
        const maxSize = maxFileSize * 1000 * 1000;

        // Set up multer with the defined storage strategy
        const upload = multer({ 
            storage: storage,
            limits: { fileSize: maxSize },
            fileFilter: function (req, file, cb){
                // Set the filetypes, it is optional
                let filetypes = allowedFiles;
                let extname = filetypes.test(path.extname(file.originalname).toLowerCase());
                if (extname) {
                    cb(null, true);
                }else{
                    return cb(new Error("File upload only supports the following filetypes - " + (params.allowedFiles ? params.allowedFiles.join(",") : '/jpeg|jpg|png|xls|xlsx|pdf/'), false));
                }
            } 
         });

        // Call the upload middleware for a single file, passing the fieldname
        return upload.any()(req,res,(err)=>{
            if (err) {
                // Log any error if occurs during file upload
                console.log("---err---", err);
                // return res.status(500).send({ error: 'File upload failed' });
                // return 
                util.getSuccessResponse(res,req,400,err.message,false,'',0,'ref_id','LENDER','UPLOAD_FILE_EXT_NOT_ALLOWED');
            }
            // Move to the next middleware or route handler
            next();
        });
   }
};

module.exports=Middlewaresfun;