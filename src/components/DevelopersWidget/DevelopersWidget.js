import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import WidgetContainer from '../WidgetContainer/WidgetContainer';
import { useEffect, useState } from 'react';
import laborCostsApi from '../../utils/api/LaborCostsApi';

function DevelopersWidget({ updateWidgetsToggle }) {
  const [developers, setDevelopers] = useState([]);
  const [monthsNumbers, setMonthsNumbers] = useState([]);
  const [totalCostsByMonth, setTotalCostsByMonth] = useState({});

  useEffect(() => {
    laborCostsApi.getDevelopers()
      .then((res) => {
        res.sort((a, b) => a.year - b.year || a.month - b.month);
        const developers = {};
        for (let dev of res) {
          if (!(dev.employee_id in developers)) {
            developers[dev.employee_id] = {
              id: dev.employee_id,
              employeeName: dev.employee_name,
              months: []
            }
          }
          developers[dev.employee_id].months.push({
            monthNum: dev.month,
            planLaborCosts: dev.plan_labor_costs,
            actualLaborCosts: dev.actual_labor_costs,
          })
        }
        const developersArr = Object.values(developers);

        const monthsNumbers = [];
        if (developersArr.length) {
          for (const month of developersArr[0].months) {
            if (month.actualLaborCosts || month.planLaborCosts) {
              monthsNumbers.push(month.monthNum)
            }
          }
        }

        const monthsWithTotalCosts = {};
        for (const dev of res) {
          if (!(dev.month in monthsWithTotalCosts)) {
            monthsWithTotalCosts[dev.month] = {
              totalActualCosts: dev.actual_labor_costs,
              totalPlanCosts: dev.plan_labor_costs
            }
          } else {
            monthsWithTotalCosts[dev.month].totalActualCosts += dev.actual_labor_costs;
            monthsWithTotalCosts[dev.month].totalPlanCosts += dev.plan_labor_costs
          }
        }

        setTotalCostsByMonth(monthsWithTotalCosts);
        setMonthsNumbers(monthsNumbers);
        setDevelopers(developersArr)
      })
      .catch((err) => console.log(err))
  }, [updateWidgetsToggle]);

  return (
    <WidgetContainer title='Разработчики' monthsNumbers={monthsNumbers}>
      <TableBody>
        <TableRow>
          <TableCell sx={{ borderLeft: 'none' }}></TableCell>
          {monthsNumbers.map((monthNum) => (
            <TableCell align='center' key={monthNum}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell align='center' sx={{
                        borderBottom: 'none',
                        borderLeft: 'none',
                        fontWeight: 500
                      }}
                    >
                      План
                    </TableCell>
                    <TableCell align='center' sx={{
                        borderBottom: 'none',
                        fontWeight: 500
                      }}
                    >
                      Факт
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableCell>
          ))}
        </TableRow>
        {developers.map((row) => (
          <TableRow key={row.id}>
            <TableCell align='center' sx={{ borderLeft: 'none' }}>
              {row.employeeName}
            </TableCell>
            {row.months.map((monthData) => (
              <TableCell align='center' key={monthData.monthNum}>
                <Table>
                  <TableBody>
                    <TableRow sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
                      <TableCell align='center' sx={{ borderBottom: 'none', borderLeft: 'none' }}>
                        {monthData.planLaborCosts}
                      </TableCell>
                      <TableCell align='center' sx={{ borderBottom: 'none' }}>
                        {monthData.actualLaborCosts}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableCell>
            ))}
          </TableRow>
        ))}
        <TableRow>
          <TableCell sx={{ borderLeft: 'none', borderBottom: 'none' }} align='center'>
            Итого
          </TableCell>
          {monthsNumbers.map((month) => (
            <TableCell align='center' key={month} sx={{ borderBottom: 'none' }}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell align='center' sx={{ borderBottom: 'none', borderLeft: 'none' }}>
                      {totalCostsByMonth[month].totalPlanCosts}
                    </TableCell>
                    <TableCell align='center' sx={{ borderBottom: 'none' }}>
                      {totalCostsByMonth[month].totalActualCosts}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </WidgetContainer>
  )
}

export default DevelopersWidget;
