import { AppBar, Box, Container, Link, Toolbar, Typography } from '@mui/material';
import DevelopersWidget from '../DevelopersWidget/DevelopersWidget';
import SupportsWidget from '../SupportsWidget/SupportsWidget';
import ProjectsWidget from '../ProjectsWidget/ProjectsWidget';
import { useState } from 'react';

function App() {
  const [updateWidgetsToggle, setUpdateWidgetsToggle] = useState(false);

  const forceUpdateWidgets = () => {
    setUpdateWidgetsToggle(!updateWidgetsToggle)
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Link
            href='/'
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: 'white', cursor: 'pointer' }}
          >
            Трудовые затраты
          </Link>
        </Toolbar>
      </AppBar>
      <Container sx={{ p: '50px 0 100px 0', m: 0, display: 'grid', gap: '50px' }}>
        <Box>
          <Typography variant="h5" component="h2" sx={{mb: '20px'}}>
            Затраты сотрудников по месяцам
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '5fr 3fr', gap: '50px' }}>
            <DevelopersWidget updateWidgetsToggle={updateWidgetsToggle}/>
            <SupportsWidget updateWidgetsToggle={updateWidgetsToggle}/>
          </Box>
        </Box>
        <Box>
          <Typography variant="h5" component="h2" sx={{mb: '20px'}}>
            Данные по проектам
          </Typography>
          <ProjectsWidget
            forceUpdateWidgets={forceUpdateWidgets}
            updateWidgetsToggle={updateWidgetsToggle}
          />
        </Box>
      </Container>
    </>
  )
}

export default App;
