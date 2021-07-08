var recordModel = require("./records");

module.exports = {
  getData: function (req, res) {
    recordModel.recordModel.find({}, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  },
  createData: function (req, res) {
    var inputData = req.body;
    recordModel.createData(inputData, (data) => {
      res.send("Record successfully created");
    });
  },
  getIndividualData: function (req, res) {
    const id = req.url.split("/")[2];
    recordModel.recordModel.findOne({ _id: id }, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  },
  updateData: function (req, res) {
    const data = req.body;
    const id = req.url.split("/")[2];
    recordModel.recordModel.findOneAndUpdate(
      { _id: id },
      data,
      { upsert: true },
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  },
};
