import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';



import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { api } from './constants';

export default function Register() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    let error = true;

    const register =  async (e) => {
        fetch(api + '/register', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: userName,
              password: password,
            }),
          }).then(() => navigate('/')).catch(err => console.log(err));
        
    }

    return (<Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box component="form"
            onSubmit={register}
            sx={{ mt: 3 }}
        >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField label="Username"
                        type="text"
                        name="username"
                        onChange={(event) => setUserName(event.target.value)}
                        required
                        error={error && !userName}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Password"
                        type="password"
                        name="password"
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        error={error && !password}
                    />
                </Grid>
            </Grid>

          <Grid item>
            <Button type="submit">Register</Button>
        </Grid>
        </Box>
    </Container>)
}