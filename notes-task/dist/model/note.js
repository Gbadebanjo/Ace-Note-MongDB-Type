"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Note = void 0;
const mongoose_1 = require("mongoose");
const noteSchema = new mongoose_1.Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
    },
    dueDate: {
        type: String,
    },
    status: {
        type: String,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
}, {
    timestamps: true,
});
exports.Note = (0, mongoose_1.model)('Note', noteSchema);
