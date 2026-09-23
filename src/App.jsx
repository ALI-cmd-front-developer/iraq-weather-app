import { useState } from "react"
import "./App.css"

//=========================================================================
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Done } from "@mui/icons-material";
import Stack from '@mui/material/Stack';
import { green } from '@mui/material/colors';
import Icon from '@mui/material/Icon';
import { ThemeProvider, createTheme } from '@mui/material/styles';

//=========================================================================
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

 function Icons() {
  return (
    <Stack direction="row" spacing={3}>
      <Icon sx={{ color: green[500], fontSize :"25px" }}>add_circle</Icon>
    </Stack>
  );
}

        








    function ColorToggleButton(props) {

  const handleChange = (event, newAlignment) => {
    props.setFilter(newAlignment);
  };

  return (
    <ToggleButtonGroup
      color= "success"
      value={props.filter}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
      sx={{color : green[500] , marginTop : "12px"}}
    >
      <ToggleButton value="active">active</ToggleButton>
      <ToggleButton value="completed">Completed</ToggleButton>
      <ToggleButton value="all">All</ToggleButton>
    </ToggleButtonGroup>
  );
}


function App() {

    const [filter, setFilter] = useState('all');
  const [tasks , setTasks] = useState([{
    id : 1,
    title : "read",
    details : "three books",
    done : false
  },

  {
  id : 2,
    title : "finish react course",
    details : "finish the last subject",
    done : false
  },
  {
    id : 3,
    title : "understand async/await",
    details : "in the course or read documentation",
    done : false
  }])
  //=================================================================
    return (
    <ThemeProvider theme={darkTheme}>

<div className="container">
    <h1 style={{marginBottom : "14px"}}>My Todo Application</h1>
    <hr />
	  <ColorToggleButton filter= {filter} setFilter = {setFilter} />
    <div className="wrapper">
    <ul>
      {tasks.map((task) => {
      return (
        <li className="wrapper-li-icon" dir="ltr" key={task.id}>
          <div className="wrapper-li">
          <p>{task.title}</p>
        <span>{task.details}</span>
        </div>
        <div className="all-icons">
        
        </div>
        </li>
      )
    })}
    </ul>

    </div>
    
    </div>
  

	 
    </ThemeProvider>
    )
}

export default App