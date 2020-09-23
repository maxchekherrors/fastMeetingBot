const deepai = require('deepai');
const{apiAI:config} = require('../config');
deepai.setApiKey(config.apiKey);
module.exports = async (fileId)=>{
    const {output:{faces}} = await deepai.callStandardApi("facial-recognition", {
        image:`${config.source}/${fileId}`,
    });
    return faces;
};