import {
  Box,
  Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput,
  Paper, Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, TextField
} from '@mui/material';
import { useEffect, useState } from 'react';
import laborCostsApi from '../../utils/api/LaborCostsApi';
import { MONTHS } from '../../utils/constants/constants';


function ProjectsWidget({ forceUpdateWidgets, updateWidgetsToggle }) {
  const date = new Date();
  const [data, setData] = useState([]);
  const [projectsSelects, setProjectsSelects] = useState([]);
  const [managersSelects, setManagersSelects] = useState([]);
  const [employeesSelects, setEmployeesSelects] = useState([]);
  const [monthsSelects, setMonthsSelects] = useState([]);
  const [isLaborCostsPopupOpen, setIsLaborCostsPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState({
    date: {
      month: date.getMonth() + 1,
      year: date.getFullYear()
    },
    employeeName: '',
    hours: 0,
    employeeId: ''
  });
  const [filters, setFilters] = useState({
    date: {
      month: date.getMonth(),
      year: date.getFullYear()
    },
    projects: [],
    managers: [],
    employees: [],
  });

  useEffect(() => {
    laborCostsApi.getFilteredEmployees(filters)
      .then((res) => {
        const data = {};
        const employeesSelects = {};
        const projectsSelects = {};
        const managersSelects = {};
        for (const dev of res) {
          if (!(dev.project_id in data)) {
            data[dev.project_id] = {
              managerId: dev.manager_id,
              managerName: dev.manager_name,
              projectId: dev.project_id,
              projectName: dev.project_name,
              totalLaborCosts: 0,
              developers: []
            }
          }
          const employee = {
            id: dev.employee_id,
            name: dev.employee_name
          };
          const project = {
            id: dev.project_id,
            name: dev.project_name
          };
          const manager = {
            id: dev.manager_id,
            name: dev.manager_name
          };
          data[dev.project_id].totalLaborCosts += dev.actual_labor_costs;
          data[dev.project_id].developers.push(employee);
          employeesSelects[dev.employee_id] = employee;
          projectsSelects[dev.project_id] = project;
          managersSelects[dev.manager_id] = manager
        }

        const monthsSelects = [];
        const date = new Date();
        date.setDate(1);
        for (let i = 0; i < 3; i++) {
          monthsSelects.push({
            month: date.getMonth() + 1,
            year: date.getFullYear()
          });
          date.setMonth(date.getMonth() - 1);
        }

        setMonthsSelects(monthsSelects);
        setEmployeesSelects(Object.values(employeesSelects));
        setProjectsSelects(Object.values(projectsSelects));
        setManagersSelects(Object.values(managersSelects));
        setData(Object.values(data));
      })
      .catch((err) => console.log(err))
  }, [filters, updateWidgetsToggle]);

  const getWithoutRemoved = (items) => {
    return items.filter((item) => {
      let count = 0;
      for (const i of items) {
        if (i.id === item.id) {
          count += 1;
        }
      }
      return count === 1
    });
  };

  const handleMonthChange = (evt) => {
    const date = JSON.parse(evt.target.value);
    setFilters({...filters, date})
  };

  const handleProjectsChange = (evt) => {
    const value = evt.target.value;
    const withoutRemoved = getWithoutRemoved(value);
    setFilters({...filters, projects: [...withoutRemoved]});
  };

  const handleManagersChange = (evt) => {
    const value = evt.target.value;
    const withoutRemoved = getWithoutRemoved(value);
    setFilters({...filters, managers: [...withoutRemoved]});
  };

  const handleEmployeesChange = (evt) => {
    const value = evt.target.value;
    const withoutRemoved = getWithoutRemoved(value);
    setFilters({...filters, employees: [...withoutRemoved]});
  };

  const handleDeleteProjectChip = (projectId) => () => {
    setFilters({
      ...filters,
      projects: filters.projects.filter((item) => item.id !== projectId)
    })
  };

  const handleDeleteManagerChip = (managerId) => () => {
    setFilters({
      ...filters,
      managers: filters.managers.filter((item) => item.id !== managerId)
    })
  };

  const handleDeleteEmployeeChip = (employeeId) => () => {
    setFilters({
      ...filters,
      employees: filters.employees.filter((item) => item.id !== employeeId)
    })
  };

  const clearAllChips = () => {
    setFilters({
      date: {
        month: filters.date.month,
        year: filters.date.year
      },
      projects: [],
      managers: [],
      employees: []
    })
  };

  const handlePopupSelectMonthChange = (evt) => {
    setPopupData({...popupData, date: JSON.parse(evt.target.value)})
  };

  const handlePopupHoursChange = (evt) => {
    setPopupData({...popupData, hours: Number(evt.target.value)})
  };

  const handleLaborCostsPopupOpen = ({ id, name }) => () => {
    setPopupData({...popupData, employeeId: id, employeeName: name});
    setIsLaborCostsPopupOpen(true)
  };

  const handleLaborCostsPopupClose = () => {
    setIsLaborCostsPopupOpen(false);
    setPopupData({
      date: {
        month: date.getMonth() + 1,
        year: date.getFullYear()
      },
      employeeName: '',
      hours: 0,
      employeeId: ''
    });
  };

  const handlePopupFormSubmit = () => {
    laborCostsApi.changeEmployeeLaborCosts(popupData)
      .then((res) => {
        console.log(res);
        forceUpdateWidgets();
        handleLaborCostsPopupClose();
      })
      .catch((err) => console.log(err))
  };

  return (
    <Box>
      <Box>
        <FormControl sx={{ m: 1, width: 200 }}>
          <InputLabel id='month-label'>Месяц</InputLabel>
          <Select
            labelId='month-label'
            id='month-select'
            value={JSON.stringify(filters.date)}
            label='Месяц'
            onChange={handleMonthChange}
            sx={{ backgroundColor: 'white' }}
          >
            {monthsSelects.map((date, index) => (
              <MenuItem value={JSON.stringify(date)} key={index}>
                {`${MONTHS[date.month]} ${date.year}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, width: 200 }}>
          <InputLabel id='project-label'>Проект</InputLabel>
          <Select
            labelId='project-label'
            id='project-select'
            multiple
            value={filters.projects}
            onChange={handleProjectsChange}
            input={<OutlinedInput label='Проект' />}
            renderValue={() => `Выбрано ${filters.projects.length}`}
            sx={{ backgroundColor: 'white' }}
          >
            {projectsSelects.map((item) => (
              <MenuItem
                key={item.id}
                value={item}
              >
                <Checkbox checked={filters.projects.some((i) => i.id === item.id)}/>
                <ListItemText primary={item.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, width: 200 }}>
          <InputLabel id='manager-label'>Менеджер</InputLabel>
          <Select
            labelId='manager-label'
            id='manager-select'
            multiple
            value={filters.managers}
            onChange={handleManagersChange}
            input={<OutlinedInput label='Менеджер' />}
            renderValue={() => `Выбрано ${filters.managers.length}`}
            sx={{ backgroundColor: 'white' }}
          >
            {managersSelects.map((item) => (
              <MenuItem
                key={item.id}
                value={item}
              >
                <Checkbox checked={filters.managers.some((i) => i.id === item.id)}/>
                <ListItemText primary={item.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, width: 200 }}>
          <InputLabel id='employee-label'>Сотрудник</InputLabel>
          <Select
            labelId='employee-label'
            id='employee-select'
            multiple
            value={filters.employees}
            onChange={handleEmployeesChange}
            input={<OutlinedInput label='Сотрудник' />}
            renderValue={() => `Выбрано ${filters.employees.length}`}
            sx={{ backgroundColor: 'white' }}
          >
            {employeesSelects.map((item) => (
              <MenuItem
                key={item.id}
                value={item}
              >
                <Checkbox checked={filters.employees.some((i) => i.id === item.id)}/>
                <ListItemText primary={item.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          p: '5px',
          m: '0 0 20px 0',
          gap: '5px'
        }}
      >
        {filters.projects.map((item) => (
          <Chip
            label={item.name}
            onDelete={handleDeleteProjectChip(item.id)}
            key={item.id}
            color='primary'
            variant='outlined'
          />
        ))}
        {filters.managers.map((item) => (
          <Chip
            label={item.name}
            onDelete={handleDeleteManagerChip(item.id)}
            key={item.id}
            color='primary'
            variant='outlined'
          />
        ))}
        {filters.employees.map((item) => (
          <Chip
            label={item.name}
            onDelete={handleDeleteEmployeeChip(item.id)}
            key={item.id}
            color='primary'
            variant='outlined'
          />
        ))}
        {(filters.projects.length || filters.managers.length || filters.employees.length) ? (
          <Chip
            label={'Очистить всё'}
            onDelete={clearAllChips}
            color='primary'
          />
        ) : ''}
      </Box>
      <TableContainer component={Paper} sx={{
        'td, th': { p: '0', borderLeft: '1px solid rgba(224, 224, 224, 1)' },
        borderTop: '1px solid rgba(224, 224, 224, 1)',
        borderRight: '1px solid rgba(224, 224, 224, 1)',
      }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align='center'>
                <Box sx={{ p: '2px' }}>
                  {`${MONTHS[filters.date.month]} ${filters.date.year}`}
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align='center'>
                        <Box sx={{ p: '2px' }}>
                          Менеджер
                        </Box>
                      </TableCell>
                      <TableCell align='center'>
                        <Box sx={{ p: '2px' }}>
                          Проект
                        </Box>
                      </TableCell>
                      <TableCell align='center'>
                        <Box sx={{ p: '2px' }}>
                          Общие трудозатраты
                        </Box>
                      </TableCell>
                      <TableCell align='center'>
                        <Box sx={{ p: '2px' }}>
                          Разработчики
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((project) => (
                      <TableRow
                        key={project.projectId}
                        sx={{ '&:last-child > td, &:last-child > th': { borderBottom: 0 } }}
                      >
                        <TableCell align='center'>
                          {project.managerName}
                        </TableCell>
                        <TableCell align='center'>
                          {project.projectName}
                        </TableCell>
                        <TableCell align='center'>
                          {project.totalLaborCosts} Ч.
                        </TableCell>
                        <TableCell sx={{ borderLeft: 'none !important' }}>
                          <Table>
                            <TableBody>
                              {project.developers.map((dev) => (
                                <TableRow
                                  key={dev.id}
                                  sx={{ '&:last-child td, &:last-child th': { borderBottom: 0 } }}
                                >
                                  <TableCell align='center'>
                                    {dev.name}
                                  </TableCell>
                                  <TableCell align='center' sx={{ width: '120px '}}>
                                    <Button size='small' onClick={handleLaborCostsPopupOpen(dev)}>
                                      Трудозатраты
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={isLaborCostsPopupOpen} onClose={handleLaborCostsPopupClose}>
        <DialogTitle>Изменить трудозатраты сотрудника {popupData.employeeName}</DialogTitle>
        <DialogContent>
          <FormControl sx={{ mt: 1, mb: 2, width: '100%' }}>
            <InputLabel id='month-label-in-popup'>Месяц</InputLabel>
            <Select
              labelId='month-label-in-popup'
              id='month-select-in-popup'
              value={JSON.stringify(popupData.date)}
              label='Месяц'
              onChange={handlePopupSelectMonthChange}
              sx={{ backgroundColor: 'white' }}
            >
              {monthsSelects.map((date, index) => (
                <MenuItem value={JSON.stringify(date)} key={index}>
                  {`${MONTHS[date.month]} ${date.year}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin='dense'
            id='year'
            label='Колличество часов'
            type='email'
            fullWidth
            variant='standard'
            onChange={handlePopupHoursChange}
            value={popupData.hours || 0}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLaborCostsPopupClose}>Отмена</Button>
          <Button onClick={handlePopupFormSubmit}>Отправить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ProjectsWidget;
