var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProjectsSchema = new Schema({
  id: String,
  title: String,
  user_id: String,
  description: String,
  skills_required: String,
  min_budget: String,
  max_budget: String,
  created_at: Date,
  assigned_to: String,
  file_name: String,
  date_of_completion: Date,
  folder_name: String
});

module.exports = mongoose.model("Project", ProjectsSchema);
