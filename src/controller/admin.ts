import express, { Request, Response, NextFunction } from 'express'
import User  from '../model/user.model';
import bcrypt from 'bcrypt';
import {Team} from '../model/team.model';

import { GeneratePassword, GenerateSalt,GenerateToken, option, registerSchema, loginSchema, teamSchema } from '../utils/utility';
import { Fixture } from '../model/fixtures.model';


//Register Admin
export const RegisterAdmin = async (req:Request, res:Response) =>
{
    try
    {
        const { email, username, phone, password } = req.body
        const validateRegister = registerSchema.validate(req.body, option);
        if (validateRegister.error)
        {
            return res
                .status(400)
                .json({ Error: validateRegister.error.details[0].message });
        }
        //Generate salt
        const salt = await GenerateSalt(10);
        //Encrypting password
        const adminPassword = await GeneratePassword(password, salt);
        const admin = await User.findOne({ $or: [{ email }, { username }] });

        if (admin)
        {
            if (admin.username === username)
            {
                return res.status(400).json({ Error: "Username already exists" });
            }
            if (admin.email === email)
            {
                return res.status(400).json({ Error: "Admin email already exists" });
            }
        }

        //create admin
        const newAdmin = await User.create({
            username,
            email,
            password: adminPassword,
            role: "admin"
        })
        return res.status(201).json(
            {
                message: "User created successfully",
                newAdmin: newAdmin
            }
            
        )
        
    } catch (error)
    {
        res.status(500).json(error)
    }
};

//Login Admin
export const AdminLogin = async (req:Request, res:Response) => {
  try {
    const { email, password } = req.body
        const validateRegister = loginSchema.validate(req.body, option);
        if (validateRegister.error)
        {
            return res
                .status(400)
                .json({ Error: validateRegister.error.details[0].message });
        }
    // Find the admin by email
    const admin = await User.findOne({ email });
    
    // Check if the admin exists
    if (!admin) {
      return res.status(404).json({ error: "Not a registered User" });
    }
    
    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
    
    // Generate and return a token if the login is successful
      const token = await GenerateToken({
          id: admin.id,
          email: admin.email,
          role: '',
          
      });
      let session = req.session;

    res.status(200).json({ token , admin});
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/***************************** TEAMS **************************/
// Create a new team
export const createTeam = async (req: Request, res: Response) => {
    try {
        const { teamName, sport, homeCity, homeStadium, country } = req.body;

        // Validate the request body using a schema (e.g., with a library like Joi).
        const validateResult = teamSchema.validate(req.body, option);

        if (validateResult.error) {
            return res.status(400).json({
                error: validateResult.error.details[0].message,
            });
        }

        // Check if a team with the same name already exists.
        const existingTeam = await Team.findOne({ teamName });

        if (existingTeam) {
            return res.status(400).json({ error: "Name already taken" });
        }

        // If validation passes and the team doesn't already exist, create and save the new team.
        const team = await Team.create({
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
    } catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({ error: 'Error creating team' });
    }
};

// Get a list of all teams
export const getAllTeams = async (req: Request, res: Response) => {
    try {
        
    const teams = await Team.find();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch teams' });
  }
};

// Get a single team by ID
export const getTeamById = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  try {
    const team = await Team.findById(teamId);
    if (team) {
      res.status(200).json(team);
    } else {
      res.status(404).json({ error: 'Team not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch team' });
  }
};

// Update a team by ID
export const updateTeam = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  const { players } = req.body;

  try {
    // Find the team by ID
    const team = await Team.findById(teamId);

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
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ error: 'Could not update team' });
  }
};

// Delete a team by ID
export const deleteTeam = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  try {
    const existingTeam = await Team.findByIdAndRemove(teamId);
    if (existingTeam) {
        res.status(200).json({ message:"You have deleted the team successfully"});
    } else {
      res.status(404).json({ error: 'Team not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Could not delete team' });
  }
};


/********************************* FIXTURES ******************************/

//Create Fixture
export const CreateFixture = async (req: Request, res: Response) =>
{
    try {
        const { homeTeam, awayTeam, date, location, result, status } = req.body
        const homeTeamExists = await Team.exists({ teamName: homeTeam });
        const awayTeamExists = await Team.exists({ teamName: awayTeam });

        if (!homeTeamExists || !awayTeamExists) {
            return res.status(400).json({ error: 'One or both teams do not exist' });
        }
   // Check if a fixture exists for either homeTeam or awayTeam on the same date
const existingFixture = await Fixture.findOne({
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

        const fixture = await Fixture.create({
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
    } catch (error) {
        console.error('Error creating fixture:', error);
        res.status(500).json({ error: 'Error creating fixture' });
    }
};

//Get All Fixtures
export const AllFixtures = async (req: Request, res: Response) =>
{
    try {
        // Determine the fixture status based on the query parameter 'status'
        const status = req.query.status as string;

        let fixtures;

        if (status === 'complete') {
            fixtures = await Fixture.find({ status: 'complete' });
        } else if (status === 'pending') {
            fixtures = await Fixture.find({ status: 'pending' });
        } else {
            // If no status is specified, retrieve all fixtures
            fixtures = await Fixture.find();
        }

        if (fixtures.length < 1) {
            return res.status(404).json({ message: "No fixtures Yet" });
        }

        res.status(200).json(fixtures);
    } catch (error) {
        res.status(500).json({ error: "Error viewing Fixtures" });
    }
};


//GetSingle Fixture
export const SingleFixture = async (req: Request, res: Response) =>
{
    try {
        const { fixtureId } = req.params
        const existingSingleFixture = await Fixture.findById(fixtureId)
        if (!existingSingleFixture) {
            return res.status(404).json({ error: "Fixture not found" })
        }
        res.status(200).json(existingSingleFixture)
    } catch (error) {
        res.status(500).json({error: "Error viewing Fixture"})
    }
};


//Update Fixture
export const UpdateFixture =  async (req:Request, res:Response) => {
  const { fixtureId } = req.params;
  const updates = req.body;

  try {
    const updatedFixture = await Fixture.findByIdAndUpdate(fixtureId, updates, {
      new: true,
    });
    if (updatedFixture) {
      res.status(200).json({
        message: 'Fixture updated successfully',
        updatedFixture,
      });
    } else {
      res.status(404).json({ error: 'Fixture not found' });
    }
  } catch (error) {
    console.error('Error updating fixture:', error);
    res.status(500).json({ error: 'Error updating fixture' });
  }
};

//Delete Fixture
export const DeleteFixture = async (req: Request, res: Response) => {
  const { fixtureId } = req.params;
  try {
    const existingFixture = await Fixture.findByIdAndRemove(fixtureId);
    if (existingFixture) {
        res.status(200).json({ message:"You have deleted the Fixture successfully"});
    } else {
      res.status(404).json({ error: 'Fixture not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Could not delete Fixture' });
  }
};