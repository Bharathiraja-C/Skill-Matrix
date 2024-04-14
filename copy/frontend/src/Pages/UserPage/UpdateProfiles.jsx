import React, { useState } from 'react';
import { Button, TextField,  Grid } from '@mui/material';
import UserService from '../../Services/UserService';
import { useLocation,useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const UpdateProfiles = ({userId}) => {

    const location = useLocation();
    const userData = location.state.userData;
    console.log(userData);
    const [username, setUsername] = useState(userData.username);
    const [address, setAddress] = useState(userData.address);
    const [phone, setPhone] = useState(userData.phone);
    const [email, setEmail] = useState(userData.email);
    const navigate=useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await UserService.UpdateProfiles(userId,email, username, address, phone);
            console.log('profile Updated Successfully:', result);
            toast.success("profile Updated Successfully");
            navigate('/profile');
        } catch (error) {
            console.error('Error creating user:', error);
            toast.error("Failed to update profile. Please try again.");
        }
    };

    return (
        <Grid container justifyContent="center">
            <Grid item xs={12} sm={8} md={6} lg={4}>
                <div className="form-head">
                    <center className="login-head">Edit Details</center>
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
                      
                        <Button variant="contained" type="submit" fullWidth>Submit</Button>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
};

export default UpdateProfiles;
