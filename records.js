const mongoose = require("mongoose");
const record = new mongoose.Schema({
    topic: String,
    description: String,
    replies : [{
        username:String,
        description:String
    }]
})

recordTable = new mongoose.model("Record", record)

module.exports = {
    recordModel: recordTable,
    createData: function(inputData,callback){
        recordData = new recordTable(inputData);
        recordData.save(function(err, data){
            if (err) throw err;
            return callback(data)
        })
    }
}