import './App.css';
import React, { useState, useReducer } from 'react';
import { countries, options, questions, scores, api } from './constants';
import RadioGroup from '@mui/material/RadioGroup';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from "@mui/material/FormLabel";
import Radio from '@mui/material/Radio';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Container from '@mui/material/Container';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

function App() {
  const [result, setResult] = useState(0);
  const [state, setState] = useState({
    age: '',
    gender: '',
    ethnicity: '',
    country: '',
    jundice: '',
    A1: '',
    A2: '',
    A3: '',
    A4: '',
    A5: '',
    A6: '',
    A7: '',
    A8: '',
    A9: '',
    A10: '',
    diagnosis: '',
  });
  const [, forceUpdate] = useReducer(o => !o);

  let error;
  let disabled = false;

  const keyScore = (value, score) => {
    return (value === options[0] || value === options[1]) && score === 1 ? 1 : (value === options[2] || value === options[3]) && score === 0 ? 1 : 0;
  }


  const trainModel = async () => {
    let answers = [];
    for (let i = 1; i <= 10; i++) {
      answers.push(keyScore(state['A' + i], scores['A' + i]))
    }
    const response = await fetch(api + '/model', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        answers: answers,
        verdict: state['diagnosis'],
      }),
    });

  }

  const handleChange = (event, field) => {
    const localState = state;
    localState[field] = event.target ? event.target.value : event;
    setState(state);
    forceUpdate();
  }
  const processData = (event) => {
    disabled = true;
    error = !!Object.keys(state).find(key => !state[key]);
    if (error) {
      forceUpdate();
      console.log(error);
      event.preventDefault();
      disabled = false;
      return;
    }
    setResult(Object.keys(state).reduce((acc, key) =>
      scores[key] !== undefined ? keyScore(state[key], scores[key]) + acc : acc

      , 0));
    forceUpdate();
    trainModel();
    event.preventDefault();
  }


  const optionsHtml = options.map((option, i) => <FormControlLabel value={option} control={<Radio />} key={option} label={option} />)

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography>Autism detection</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Autism detection questionnaire.
             Please note, none of the personal data is gathered.
             The data entered will be used for federated training.
          </Typography>
        </AccordionDetails>
      </Accordion>
      {!result && <Box component="form"
        onSubmit={processData}
        sx={{ mt: 3 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Age"
              type="number"
              name="age"
              onChange={(event) => handleChange(event, 'age')}
              required
              error={error && !state.age}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Ethnicity"
              type="text"
              name="ethnicity"
              onChange={(event) => handleChange(event, 'ethnicity')}
              required
              error={error && !state.ethnicity}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel id="country-label">Country</InputLabel>
            <Select required
              labelId="country-label"
              value={state.country}
              error={error && !state.country}
              onChange={event => handleChange(event, 'country')}
              label="Country">
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {countries.map(country => <MenuItem value={country} key={country}>{country}</MenuItem>)}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <FormLabel id="gender">Gender</FormLabel>
            <RadioGroup
              required
              defaultValue="Female"
              name="gender"
              value={state.gender}
              error={error && !state.gender}
              onChange={(event) => handleChange(event.target.value, 'gender')}
            >
              <FormControlLabel value="Female" control={<Radio />} label="Female" />
              <FormControlLabel value="Male" control={<Radio />} label="Male" />
            </RadioGroup>

          </Grid>
          <Grid item xs={12}>
            <FormLabel id="jundice">Occurrence of autism in family</FormLabel>
            <RadioGroup
              required
              name="jundice"
              error={error && !state.jundice}
              value={state.jundice}
              onChange={(event) => handleChange(event.target.value, 'jundice')}
            >
              <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>

          </Grid>
          {questions.map((question, i) =>
            <Grid item key={question.substring(0, 20)} xs={12}>
              <FormLabel id={question.substring(0, 20)}>{question}</FormLabel>
              <RadioGroup label={question}
                required
                error={error && !state['A' + (i + 1)]}
                name={'A' + (i + 1)}
                onChange={(event) => handleChange(event.target.value, 'A' + (i + 1))}
                value={state['A' + (i + 1)]}>
                {optionsHtml}
              </RadioGroup>
            </Grid>)}
          <Grid item key="diagnosis">
            <FormLabel id="diagnosis_q">Is patient diagnosed with autism</FormLabel>
            <RadioGroup label="Is patient diagnosed with autism"
              name="Diagnosis"
              onChange={(event) => handleChange(event.target.value, 'diagnosis')}
              value={state["diagnosis"]}>
              <FormControlLabel value={1} control={<Radio />} key="Diagnosed" label="Diagnosed" />
              <FormControlLabel value={0} control={<Radio />} key="Not Diagnosed" label="Not Diagnosed" />
            </RadioGroup>

          </Grid>
          <Grid item>
            <Button type="submit">Submit</Button></Grid>
        </Grid>
      </Box>}
      {
        !!result &&
        <Box sx={{ minWidth: 275 }}>
          <Card variant="outlined">

            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                The result is
      </Typography>
              <Typography variant="h5" component="div">
                {result >= 6 ? "You likely have autism" : "You likely don't have autism"}
              </Typography>
              <Typography variant="body2">
                Score: {result}
                <br />
                Please consult with a specilist to validate
      </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => setResult(0)}>Back</Button>
              <Button size="small" target="_blank" href="https://thespectrum.org.au/autism-diagnosis/checklist-adults/">Learn More</Button>
            </CardActions>
          </Card>
        </Box>
      }
    </Container>
  );
}

export default App;
