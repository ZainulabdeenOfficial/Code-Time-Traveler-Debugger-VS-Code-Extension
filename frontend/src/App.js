import React, { useEffect, useState, useRef } from 'react';
import { Slider, Box, Typography, Paper, Grid, AppBar, Toolbar, CircularProgress, CssBaseline, ThemeProvider, createTheme, IconButton, FormControl, InputLabel, Select, MenuItem, TextField, Autocomplete, Tooltip as MuiTooltip, Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import NoteIcon from '@mui/icons-material/Note';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Legend } from 'recharts';

const EVENT_TYPES = ['call', 'log', 'return', 'var', 'screenshot'];
const SESSION_ID = 'default';

function getNotesFromStorage() {
  try {
    return JSON.parse(localStorage.getItem('cttd_notes') || '{}');
  } catch {
    return {};
  }
}
function saveNotesToStorage(notes) {
  localStorage.setItem('cttd_notes', JSON.stringify(notes));
}

function App() {
  const [timeline, setTimeline] = useState([]);
  const [index, setIndex] = useState(0);
  const [screenshotUrl, setScreenshotUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedVar, setSelectedVar] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredSteps, setFilteredSteps] = useState([]);
  const [notes, setNotes] = useState(getNotesFromStorage());
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');
  const fileInputRef = useRef();

  // Theme setup
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#1976d2' },
      background: { default: darkMode ? '#181818' : '#fafafa' },
    },
  });

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/timeline/default')
      .then(res => res.json())
      .then(data => {
        setTimeline(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (timeline.length > 0) {
      fetch(`http://localhost:5000/screenshot/default/${index}`)
        .then(res => res.ok ? res.blob() : null)
        .then(blob => {
          if (blob) {
            setScreenshotUrl(URL.createObjectURL(blob));
          } else {
            setScreenshotUrl(null);
          }
        });
    } else {
      setScreenshotUrl(null);
    }
  }, [index, timeline]);

  // Filtered steps for quick jump
  useEffect(() => {
    let filtered = timeline.map((snap, i) => ({ ...snap, _step: i }));
    if (eventTypeFilter) {
      filtered = filtered.filter(e => e.event === eventTypeFilter);
    }
    if (searchKeyword) {
      filtered = filtered.filter(e =>
        JSON.stringify(e).toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }
    setFilteredSteps(filtered);
  }, [timeline, eventTypeFilter, searchKeyword]);

  // Persist notes in localStorage
  useEffect(() => {
    saveNotesToStorage(notes);
  }, [notes]);

  const current = timeline[index] || {};
  const vars = (current.data && current.data.vars) || {};
  const logs = timeline.filter(e => e.event === 'log').map(e => e.data.args).flat();

  // Collect all variable names from timeline
  const allVarNames = Array.from(
    new Set(
      timeline.flatMap(e => e.data && e.data.vars ? Object.keys(e.data.vars) : [])
    )
  );

  // Prepare data for variable graph
  const varGraphData = timeline.map((snap, i) => {
    const value = snap.data && snap.data.vars && selectedVar in snap.data.vars ? snap.data.vars[selectedVar] : null;
    return { step: i + 1, value };
  });

  // Function call heatmap data
  const callCounts = {};
  timeline.forEach(e => {
    if (e.event === 'call' && e.data && e.data.name) {
      callCounts[e.data.name] = (callCounts[e.data.name] || 0) + 1;
    }
  });
  const callHeatmapData = Object.entries(callCounts).map(([name, count]) => ({ name, count }));

  // Notes helpers
  const noteKey = `${SESSION_ID}:${index}`;
  const hasNote = !!notes[noteKey];
  const openNoteDialog = () => {
    setNoteDraft(notes[noteKey] || '');
    setNoteDialogOpen(true);
  };
  const saveNote = () => {
    setNotes({ ...notes, [noteKey]: noteDraft });
    setNoteDialogOpen(false);
  };
  const removeNote = () => {
    const newNotes = { ...notes };
    delete newNotes[noteKey];
    setNotes(newNotes);
    setNoteDialogOpen(false);
  };

  // Export/Import session
  const handleExport = () => {
    const data = { timeline, notes };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code-time-travel-session.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleImport = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const data = JSON.parse(evt.target.result);
        if (Array.isArray(data.timeline)) setTimeline(data.timeline);
        if (typeof data.notes === 'object') setNotes(data.notes);
        setIndex(0);
      } catch {
        alert('Invalid session file.');
      }
    };
    reader.readAsText(file);
  };

  // Header with logo, session info, and dark mode toggle
  const Header = () => (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Toolbar>
        <TimelineIcon sx={{ mr: 2 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Code Time Traveler Debugger
        </Typography>
        <Typography variant="body2" sx={{ mr: 2 }}>
          Session: <b>{SESSION_ID}</b>
        </Typography>
        <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );

  // Quick jump options (show annotation icon if step has note)
  const quickJumpOptions = filteredSteps.map(e => ({
    label: `#${e._step + 1} [${e.event}] ${e.data && e.data.name ? e.data.name : ''}`.trim(),
    value: e._step,
    hasNote: !!notes[`${SESSION_ID}:${e._step}`]
  }));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Box sx={{ p: 4 }}>
        {/* Export/Import Session */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport}>
            Export Session
          </Button>
          <Button variant="outlined" startIcon={<UploadFileIcon />} component="label">
            Import Session
            <input type="file" accept="application/json" hidden ref={fileInputRef} onChange={handleImport} />
          </Button>
        </Stack>
        {/* Event Filter/Search and Quick Jump */}
        <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="event-type-label">Event</InputLabel>
            <Select
              labelId="event-type-label"
              value={eventTypeFilter}
              label="Event"
              onChange={e => setEventTypeFilter(e.target.value)}
            >
              <MenuItem value=""><em>All</em></MenuItem>
              {EVENT_TYPES.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            size="small"
            label="Search"
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <Autocomplete
            size="small"
            options={quickJumpOptions}
            getOptionLabel={option => option.label}
            value={quickJumpOptions.find(opt => opt.value === index) || null}
            onChange={(_, v) => v && setIndex(v.value)}
            renderOption={(props, option) => (
              <li {...props}>
                {option.hasNote && <NoteIcon fontSize="small" color="primary" style={{ marginRight: 4 }} />}
                {option.label}
              </li>
            )}
            renderInput={params => <TextField {...params} label="Quick Jump" />}
            sx={{ minWidth: 220 }}
            isOptionEqualToValue={(opt, val) => opt.value === val.value}
          />
          <MuiTooltip title={hasNote ? 'Edit annotation' : 'Add annotation'}>
            <span>
              <IconButton color={hasNote ? 'primary' : 'default'} onClick={openNoteDialog}>
                {hasNote ? <NoteIcon /> : <NoteAddIcon />}
              </IconButton>
            </span>
          </MuiTooltip>
        </Paper>
        {/* Annotation Panel */}
        {hasNote && (
          <Paper sx={{ p: 2, mb: 2, bgcolor: 'warning.light' }}>
            <Typography variant="subtitle2" color="textSecondary">Annotation for step #{index + 1}:</Typography>
            <Typography>{notes[noteKey]}</Typography>
          </Paper>
        )}
        {/* Annotation Dialog */}
        <Dialog open={noteDialogOpen} onClose={() => setNoteDialogOpen(false)}>
          <DialogTitle>{hasNote ? 'Edit Annotation' : 'Add Annotation'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Annotation"
              type="text"
              fullWidth
              multiline
              minRows={2}
              value={noteDraft}
              onChange={e => setNoteDraft(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            {hasNote && <Button onClick={removeNote} color="error">Remove</Button>}
            <Button onClick={() => setNoteDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveNote} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Loading timeline...</Typography>
          </Box>
        ) : timeline.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
            <Typography variant="h6">No timeline data available.</Typography>
            <Typography variant="body2" color="textSecondary">Run your app with the adapter to record execution.</Typography>
          </Box>
        ) : (
          <>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography gutterBottom>Timeline</Typography>
              <Slider
                value={index}
                min={0}
                max={timeline.length - 1}
                onChange={(_, v) => setIndex(v)}
                valueLabelDisplay="auto"
              />
              <Typography>Step: {index + 1} / {timeline.length}</Typography>
            </Paper>
            {/* Function Call Heatmap */}
            {callHeatmapData.length > 0 && (
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Function Call Heatmap</Typography>
                <ResponsiveContainer width="100%" height={40 + 30 * callHeatmapData.length}>
                  <BarChart
                    layout="vertical"
                    data={callHeatmapData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#1976d2" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, mb: 2, minHeight: 180 }}>
                  <Typography variant="h6">Call Stack</Typography>
                  <pre style={{ margin: 0 }}>{JSON.stringify(current.data && current.data.name ? [current.data.name] : [], null, 2)}</pre>
                </Paper>
                <Paper sx={{ p: 2, mb: 2, minHeight: 180 }}>
                  <Typography variant="h6">Variables</Typography>
                  <pre style={{ margin: 0 }}>{JSON.stringify(vars, null, 2)}</pre>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, mb: 2, minHeight: 180 }}>
                  <Typography variant="h6">Logs</Typography>
                  <pre style={{ margin: 0 }}>{logs.join('\n')}</pre>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, mb: 2, minHeight: 180 }}>
                  <Typography variant="h6">Screenshot</Typography>
                  <Box sx={{ minHeight: 200, bgcolor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {screenshotUrl ? (
                      <img src={screenshotUrl} alt="screenshot" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }} />
                    ) : (
                      <Typography color="textSecondary">No screenshot</Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
            {/* Variable Change Graph Panel */}
            <Paper sx={{ p: 2, mt: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FormControl sx={{ minWidth: 200 }} size="small">
                  <InputLabel id="var-select-label">Variable</InputLabel>
                  <Select
                    labelId="var-select-label"
                    value={selectedVar}
                    label="Variable"
                    onChange={e => setSelectedVar(e.target.value)}
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {allVarNames.map(name => (
                      <MenuItem key={name} value={name}>{name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography sx={{ ml: 2 }} color="textSecondary">
                  Variable Change Graph
                </Typography>
              </Box>
              {selectedVar ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={varGraphData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="step" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#1976d2" dot={true} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Typography color="textSecondary">Select a variable to view its value over time.</Typography>
              )}
            </Paper>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App; 