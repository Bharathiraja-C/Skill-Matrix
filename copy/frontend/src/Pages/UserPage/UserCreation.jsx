import React, { useState } from "react";
import {
  Button,
  TextField,
  Grid,
  MenuItem,
} from "@mui/material"; // Import Select and MenuItem from MUI
import UserService from "../../Services/UserService";
import { toast } from 'react-toastify';

const CreateUser = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [designation, setDesignation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await UserService.createUser(
        email,
        username,
        address,
        phone,
        role,
        designation
      );
      console.log("User created successfully:", result);
      toast.success("User created successfully!");
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user. Please try again.");
    }
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <div className="form-head">
          <center className="login-head">Create New User</center>
          <br />
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Username"
              type="text"
              fullWidth
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Address"
              type="text"
              fullWidth
              variant="outlined"
              margin="normal"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <TextField
              label="Phone"
              type="text"
              fullWidth
              variant="outlined"
              margin="normal"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <TextField
              select
              label="Role"
              fullWidth
              variant="outlined"
              margin="normal"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="">Select role</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="User">User</MenuItem>
              <MenuItem value="Approver">Approver</MenuItem>
            </TextField>
            <TextField
                 select
                 label="Designation"
                 fullWidth
                 variant="outlined"
                 margin="normal"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            >
              <MenuItem value="">Select designation</MenuItem>
              <MenuItem value="Intern">Intern</MenuItem>
              <MenuItem value="Software Engineer">Software Engineer</MenuItem>
              <MenuItem value="Senior Software Engineer">
                Senior Software Engineer
              </MenuItem>
              <MenuItem value="Solution Enabler">Solution Enabler</MenuItem>
              <MenuItem value="Solution Consultant">
                Solution Consultant
              </MenuItem>
              <MenuItem value="Project Delivery Manager">
                Project Delivery Manager
              </MenuItem>
              <MenuItem value="Principle Technology Architect">
                Principle Technology Architect
              </MenuItem>
              <MenuItem value="CTO">CTO</MenuItem>
              <MenuItem value="Administrative Manager">
                Administrative Manager
              </MenuItem>
            </TextField>
          <br/>
            <Button variant="contained" type="submit" fullWidth>
              Create User
            </Button>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

export default CreateUser;
