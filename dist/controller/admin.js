"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteFixture = exports.UpdateFixture = exports.SingleFixture = exports.AllFixtures = exports.CreateFixture = exports.deleteTeam = exports.updateTeam = exports.getTeamById = exports.getAllTeams = exports.createTeam = exports.AdminLogin = exports.RegisterAdmin = void 0;
const user_model_1 = require("../model/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const team_model_1 = require("../model/team.model");
const utility_1 = require("../utils/utility");
const fixtures_model_1 = require("../model/fixtures.model");
//Register Admin
const RegisterAdmin = async (req, res) => {
    try {
        const { email, username, phone, password } = req.body;
        const validateRegister = utility_1.registerSchema.validate(req.body, utility_1.option);
        if (validateRegister.error) {
            return res
                .status(400)
                .json({ Error: validateRegister.error.details[0].message });
        }
        //Generate salt
        const salt = await (0, utility_1.GenerateSalt)(10);
        //Encrypting password
        const adminPassword = await (0, utility_1.GeneratePassword)(password, salt);
        const admin = await user_model_1.User.findOne({ $or: [{ email }, { username }] });
        if (admin) {
            if (admin.username === username) {
                return res.status(400).json({ Error: "Username already exists" });
            }
            if (admin.email === email) {
                return res.status(400).json({ Error: "Admin email already exists" });
            }
        }
        //create admin
        const newAdmin = await user_model_1.User.create({
            username,
            email,
            password: adminPassword,
            role: "admin"
        });
        return res.status(201).json({
            message: "User created successfully",
            newAdmin: newAdmin
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.RegisterAdmin = RegisterAdmin;
//Login Admin
const AdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validateRegister = utility_1.loginSchema.validate(req.body, utility_1.option);
        if (validateRegister.error) {
            return res
                .status(400)
                .json({ Error: validateRegister.error.details[0].message });
        }
        // Find the admin by email
        const admin = await user_model_1.User.findOne({ email });
        // Check if the admin exists
        if (!admin) {
            return res.status(404).json({ error: "Not a registered User" });
        }
        // Compare the password
        const isPasswordValid = await bcrypt_1.default.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }
        // Generate and return a token if the login is successful
        const token = await (0, utility_1.GenerateToken)({
            id: admin.id,
            email: admin.email,
            role: '',
        });
        res.status(200).json({ token, admin });
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.AdminLogin = AdminLogin;
/***************************** TEAMS **************************/
// Create a new team
const createTeam = async (req, res) => {
    try {
        const { teamName, sport, homeCity, homeStadium, country } = req.body;
        // Validate the request body using a schema (e.g., with a library like Joi).
        const validateResult = utility_1.teamSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                error: validateResult.error.details[0].message,
            });
        }
        // Check if a team with the same name already exists.
        const existingTeam = await team_model_1.Team.findOne({ teamName });
        if (existingTeam) {
            return res.status(400).json({ error: "Name already taken" });
        }
        // If validation passes and the team doesn't already exist, create and save the new team.
        const team = await team_model_1.Team.create({
            teamName,
            sport,
            homeCity,
            homeStadium,
            country,
        });
        return res.status(201).json({
            message: "Team created successfully",
            savedTeam: team,
        });
    }
    catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({ error: 'Error creating team' });
    }
};
exports.createTeam = createTeam;
// Get a list of all teams
const getAllTeams = async (_, res) => {
    try {
        const teams = await team_model_1.Team.find();
        res.status(200).json(teams);
    }
    catch (error) {
        res.status(500).json({ error: 'Could not fetch teams' });
    }
};
exports.getAllTeams = getAllTeams;
// Get a single team by ID
const getTeamById = async (req, res) => {
    const { teamId } = req.params;
    try {
        const team = await team_model_1.Team.findById(teamId);
        if (team) {
            res.status(200).json(team);
        }
        else {
            res.status(404).json({ error: 'Team not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Could not fetch team' });
    }
};
exports.getTeamById = getTeamById;
// Update a team by ID
const updateTeam = async (req, res) => {
    const { teamId } = req.params;
    const { players } = req.body;
    try {
        // Find the team by ID
        const team = await team_model_1.Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }
        if (Array.isArray(players) && players.length > 0) {
            team.players = [...team.players, ...players];
        }
        // Save the updated team
        const updatedTeam = await team.save();
        res.status(200).json({
            message: 'Team updated successfully',
            updatedTeam,
        });
    }
    catch (error) {
        console.error('Error updating team:', error);
        res.status(500).json({ error: 'Could not update team' });
    }
};
exports.updateTeam = updateTeam;
// Delete a team by ID
const deleteTeam = async (req, res) => {
    const { teamId } = req.params;
    try {
        const existingTeam = await team_model_1.Team.findByIdAndRemove(teamId);
        if (existingTeam) {
            res.status(200).json({ message: "You have deleted the team successfully" });
        }
        else {
            res.status(404).json({ error: 'Team not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Could not delete team' });
    }
};
exports.deleteTeam = deleteTeam;
/********************************* FIXTURES ******************************/
//Create Fixture
const CreateFixture = async (req, res) => {
    try {
        const { homeTeam, awayTeam, date, location, result, status } = req.body;
        const homeTeamExists = await team_model_1.Team.exists({ teamName: homeTeam });
        const awayTeamExists = await team_model_1.Team.exists({ teamName: awayTeam });
        if (!homeTeamExists || !awayTeamExists) {
            return res.status(400).json({ error: 'One or both teams do not exist' });
        }
        // Check if a fixture exists for either homeTeam or awayTeam on the same date
        const existingFixture = await fixtures_model_1.Fixture.findOne({
            $or: [
                {
                    $and: [{ teamName: homeTeam }, { date: date }],
                },
                {
                    $and: [{ teamName: awayTeam }, { date: date }],
                },
            ],
        });
        if (existingFixture) {
            return res.status(400).json({
                error: 'A fixture for one of the teams on this date already exists',
            });
        }
        const fixture = await fixtures_model_1.Fixture.create({
            homeTeam,
            awayTeam,
            date,
            location,
            result,
            status
        });
        const savedFixture = await fixture.save();
        res.status(201).json({
            message: 'Fixture created successfully',
            savedFixture,
        });
    }
    catch (error) {
        console.error('Error creating fixture:', error);
        res.status(500).json({ error: 'Error creating fixture' });
    }
};
exports.CreateFixture = CreateFixture;
//Get All Fixtures
const AllFixtures = async (req, res) => {
    try {
        // Determine the fixture status based on the query parameter 'status'
        const status = req.query.status;
        let fixtures;
        if (status === 'complete') {
            fixtures = await fixtures_model_1.Fixture.find({ status: 'complete' });
        }
        else if (status === 'pending') {
            fixtures = await fixtures_model_1.Fixture.find({ status: 'pending' });
        }
        else {
            // If no status is specified, retrieve all fixtures
            fixtures = await fixtures_model_1.Fixture.find();
        }
        if (fixtures.length < 1) {
            return res.status(404).json({ message: "No fixtures Yet" });
        }
        res.status(200).json(fixtures);
    }
    catch (error) {
        res.status(500).json({ error: "Error viewing Fixtures" });
    }
};
exports.AllFixtures = AllFixtures;
//GetSingle Fixture
const SingleFixture = async (req, res) => {
    try {
        const { fixtureId } = req.params;
        const existingSingleFixture = await fixtures_model_1.Fixture.findById(fixtureId);
        if (!existingSingleFixture) {
            return res.status(404).json({ error: "Fixture not found" });
        }
        res.status(200).json(existingSingleFixture);
    }
    catch (error) {
        res.status(500).json({ error: "Error viewing Fixture" });
    }
};
exports.SingleFixture = SingleFixture;
//Update Fixture
const UpdateFixture = async (req, res) => {
    const { fixtureId } = req.params;
    const updates = req.body;
    try {
        const updatedFixture = await fixtures_model_1.Fixture.findByIdAndUpdate(fixtureId, updates, {
            new: true,
        });
        if (updatedFixture) {
            res.status(200).json({
                message: 'Fixture updated successfully',
                updatedFixture,
            });
        }
        else {
            res.status(404).json({ error: 'Fixture not found' });
        }
    }
    catch (error) {
        console.error('Error updating fixture:', error);
        res.status(500).json({ error: 'Error updating fixture' });
    }
};
exports.UpdateFixture = UpdateFixture;
//Delete Fixture
const DeleteFixture = async (req, res) => {
    const { fixtureId } = req.params;
    try {
        const existingFixture = await fixtures_model_1.Fixture.findByIdAndRemove(fixtureId);
        if (existingFixture) {
            res.status(200).json({ message: "You have deleted the Fixture successfully" });
        }
        else {
            res.status(404).json({ error: 'Fixture not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Could not delete Fixture' });
    }
};
exports.DeleteFixture = DeleteFixture;
