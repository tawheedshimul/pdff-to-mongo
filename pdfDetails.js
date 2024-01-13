const mongoose = require("mongoose");

const PdfDetailsSchema = new mongoose.Schema(
    {
        pdf: String,
        title: String,
    },
    {
        collection:"PdfDetais"
    }
);

mongoose.model("PdfDetails",PdfDetailsSchema);