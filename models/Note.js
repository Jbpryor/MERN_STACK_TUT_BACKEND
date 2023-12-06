const mongoose = require('mongoose')
const Counter = require('./Counter')

const noteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        title: {
            type: String,
            required: true
        },
        text: { 
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        },
        ticket: {
            type: Number
        }
    },
    {
        timestamps: true
    }
)

noteSchema.pre('save', async function (next) {
    // Check if the document is new or if the ticket field is not set
    if (this.isNew || !this.ticket) {
      try {
        // Find and update the counter
        const counter = await Counter.findOneAndUpdate(
          { name: 'ticketCounter' },
          { $inc: { value: 1 } },
          { upsert: true, new: true }
        );
  
        // Set the ticket field with the updated counter value
        this.ticket = counter.value;
        next();
      } catch (error) {
        next(error);
      }
    } else {
      next();
    }
  });

module.exports = mongoose.model('Note', noteSchema)