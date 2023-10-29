import express from 'express';
import {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
} from '../controller/admin'; 
import  { Admin, authMiddleware } from '../middleware/authorisation';


const router = express.Router();

// Create a new team
router.post('/teams',[authMiddleware, Admin], createTeam);

// Get a list of all teams
router.get('/teams', getAllTeams);

// Get a single team by ID
router.get('/teams/:teamId', getTeamById);

// Update a team by ID
router.patch('/teams/:teamId',[authMiddleware, Admin], updateTeam);

// Delete a team by ID
router.delete('/teams/:teamId',[authMiddleware, Admin], deleteTeam);

export default router;
