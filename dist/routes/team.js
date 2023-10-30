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
router.post('/teams', [authorisation_1.authMiddleware, authorisation_1.Admin], admin_1.createTeam);
// Get a list of all teams
router.get('/teams', admin_1.getAllTeams);
// Get a single team by ID
router.get('/teams/:teamId', admin_1.getTeamById);
// Update a team by ID
router.patch('/teams/:teamId', [authorisation_1.authMiddleware, authorisation_1.Admin], admin_1.updateTeam);
// Delete a team by ID
router.delete('/teams/:teamId', [authorisation_1.authMiddleware, authorisation_1.Admin], admin_1.deleteTeam);
exports.default = router;
