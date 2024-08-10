import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { api } from './constants';

import Button from '@mui/material/Button';


import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';

export default function Login() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    let error = true;

    const login = async (e) => {
        e.preventDefault();
        const resp = await fetch(api + '/login', {
            method: 'POST',
            credentials: "same-origin",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: userName,
              password: password,
            }),
          });
        if (resp.status === 200) {
            navigate('/');
        }
    }
    return (
    <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box component="form"
            onSubmit={login}
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
                <Grid item>
            <Button type="submit">Login</Button>
        </Grid>
            </Grid>
        </Box>
    </Container>)
}