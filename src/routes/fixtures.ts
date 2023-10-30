import express from 'express';
import { AllFixtures, CreateFixture,DeleteFixture, SingleFixture, UpdateFixture } from '../controller/admin'; 
import  { Admin, authMiddleware } from '../middleware/authorisation';


const router = express.Router();

// Create a new team
router.post('/fixtures',[ authMiddleware,Admin], CreateFixture);

// Get a list of all teams
router.get('/fixtures', AllFixtures);

// Get a single team by ID
router.get('/fixture/:fixtureId', SingleFixture);

// Update a team by ID
router.patch('/fixture/:fixtureId',[ authMiddleware,Admin], UpdateFixture);

// Delete a team by ID
router.delete('/fixture/:fixtureId',[ authMiddleware,Admin], DeleteFixture);

export default router;