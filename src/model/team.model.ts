import mongoose from 'mongoose';

// Define the schema for the sports team
const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
    unique: true,
  },
  sport: {
    type: String,
    required: true,
  },
  homeCity: String,
  homeStadium: String,
  championships: {
    type: Number,
    default: 0, 
    },
  country:String,
  players: [
    {
      playerName: String,
      position: String,
    },
  ],
  founded: {
    type: Date,
    default: Date.now, 
  },
});

export const Team = mongoose.model('Team', teamSchema);

