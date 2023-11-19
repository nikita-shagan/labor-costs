import Api from './Api';
import { API_URL } from '../constants/constants';

const getDevelopersMock = (months) => {
  const res = [];
  let employee_id = 1;
  for (let project_id = 1; project_id <= 2; project_id++) {
    for (let j = 1; j <= 3; j++) {
      for (let month of months) {
        res.push({
          month,
          employee_id,
          employee_name: `Фамилия Имя Разработчика ${employee_id}`,
          project_id,
          project_name: `Название Проекта ${project_id}`,
          manager_id: project_id,
          manager_name: `Фамилия Имя Менеджера ${project_id}`,
          year: month === 11 || month === 12 ? 2022 : 2023,
          position_name: 'Разработчик',
          plan_labor_costs: Math.floor(Math.random() * 200),
          actual_labor_costs: Math.floor(Math.random() * 200),
        })
      }
      employee_id++
    }
  }
  return res;
};

const getSupportsMock = (months) => {
  const res = [];
  let employee_id = 1;
  for (let project_id = 1; project_id <= 2; project_id++) {
    for (let j = 1; j <= 3; j++) {
      for (let month of months) {
        res.push({
          month: month,
          employee_id: employee_id,
          employee_name: `Фамилия Имя Разработчика ${employee_id}`,
          project_id,
          project_name: `Название Проекта ${project_id}`,
          manager_id: project_id,
          manager_name: `Фамилия Имя Менеджера ${project_id}`,
          year: month === 11 || month === 12 ? 2022 : 2023,
          position_name: 'Поддержка',
          actual_labor_costs: Math.floor(Math.random() * 200),
        })
      }
      employee_id++
    }
  }
  return res;
};

const getFilteredDevelopers = () => {
  const res = [];
  let employee_id = 1;
  for (let project_id = 1; project_id <= 2; project_id++) {
    for (let j = 1; j <= 3; j++) {
      res.push({
        month: 11,
        employee_id,
        employee_name: `Фамилия Имя Разработчика ${employee_id}`,
        project_id,
        project_name: `Название Проекта ${project_id}`,
        manager_id: project_id,
        manager_name: `Фамилия Имя Менеджера ${project_id}`,
        year: 2023,
        position_name: 'Разработчик',
        actual_labor_costs: Math.floor(Math.random() * 200),
      });
      employee_id++
    }
  }
  return res;
};


class LaborCostsApi extends Api {
  getDevelopers(lastsMonthsAmount) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getDevelopersMock([12, 2, 1]))
      }, 300)
    })
  }

  getSupports() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getSupportsMock([12, 2, 1]))
      }, 300)
    })
  }

  getFilteredEmployees({ month, project_id, manager_id, employee_id }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getFilteredDevelopers())
      }, 300)
    })
  }

  changeEmployeeLaborCosts(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data)
      }, 300)
    })
  }
}

const laborCostsApi = new LaborCostsApi(API_URL);
export default laborCostsApi;
