"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_1 = require("../controller/admin");
const authorisation_1 = require("../middleware/authorisation");
const router = express_1.default.Router();
// Create a new team
router.post('/fixtures', [authorisation_1.authMiddleware, authorisation_1.Admin], admin_1.CreateFixture);
// Get a list of all teams
router.get('/fixtures', admin_1.AllFixtures);
// Get a single team by ID
router.get('/fixture/:fixtureId', admin_1.SingleFixture);
// Update a team by ID
router.patch('/fixture/:fixtureId', [authorisation_1.authMiddleware, authorisation_1.Admin], admin_1.UpdateFixture);
// Delete a team by ID
router.delete('/fixture/:fixtureId', [authorisation_1.authMiddleware, authorisation_1.Admin], admin_1.DeleteFixture);
exports.default = router;
