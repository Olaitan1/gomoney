import express from 'express';
import { AllFixtures, CreateFixture,DeleteFixture, SingleFixture, UpdateFixture } from '../controller/admin'; 


const router = express.Router();

// Create a new team
router.post('/fixtures', CreateFixture);

// Get a list of all teams
router.get('/fixtures', AllFixtures);

// Get a single team by ID
router.get('/fixture/:fixtureId', SingleFixture);

// Update a team by ID
router.patch('/fixture/:fixtureId', UpdateFixture);

// Delete a team by ID
router.delete('/fixture/:fixtureId', DeleteFixture);

export default router;