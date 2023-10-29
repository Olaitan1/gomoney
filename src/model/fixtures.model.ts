const mongoose = require('mongoose');

const fixtureSchema = new mongoose.Schema({
  homeTeam: {
    type: String,
    ref: 'Team', 
    required: true,
  },
  awayTeam: {
    type: String,
    ref: 'Team', 
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  result: {
    homeScore: Number,
    awayScore: Number,
    },
   status: {
    type: String,
    enum: ['complete', 'pending', 'cancelled'],
    required: true,
  },
});

export const Fixture = mongoose.model('Fixture', fixtureSchema);


