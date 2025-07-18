const mongoose = require('mongoose');

const screenshotSchema = new mongoose.Schema({
  filename: { type: String, required: true }, // Filename of the screenshot
  timestamp: { type: Date, default: Date.now }, // Timestamp when the screenshot was taken
  takenBy: { type: String, required: true }, // User who took the screenshot (oceanAiEmail)
});

const meetSchema = new mongoose.Schema({
  convenor: { type: String, required: true },
  oceanAiEmail: { type: String, required: true },
  oceanAiName: { type: String, required: true },
  meetingTitle: { type: String, required: true },
  meetingStartTimeStamp: { type: Date, required: true },
  meetingEndTimeStamp: { type: Date, required: true },
  speakers: [{ type: String }],
  attendees: [{ type: String }],
  transcriptData: [
    {
      name: { type: String, required: true },
      timeStamp: { type: Date, required: true },
      type: { type: String, required: true }, // 'transcript' or 'chat'
      duration: { type: Number, required: true },
      content: { type: String, required: true },
    },
  ],
  speakerDuration: {
    type: Map,
    of: Number, // Each key is a speaker's name, and the value is their duration in seconds
  },
  screenshots: [screenshotSchema], // Array of screenshot objects
});

const Meet = mongoose.model('Meet', meetSchema);
module.exports = Meet;
