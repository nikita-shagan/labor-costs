import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import WidgetContainer from '../WidgetContainer/WidgetContainer';
import { useEffect, useState } from 'react';
import laborCostsApi from '../../utils/api/LaborCostsApi';

function SupportsWidget({ updateWidgetsToggle }) {
  const [supports, setSupports] = useState([]);
  const [monthsNumbers, setMonthsNumbers] = useState([]);
  const [totalCostsByMonth, setTotalCostsByMonth] = useState({});

  useEffect(() => {
    laborCostsApi.getSupports()
      .then((res) => {
        res.sort((a, b) => a.year - b.year || a.month - b.month);
        const supports = {};
        for (let sup of res) {
          const laborCostsData = {
            monthNum: sup.month,
            actualLaborCosts: sup.actual_labor_costs,
          };
          if (!(sup.employee_id in supports)) {
            supports[sup.employee_id] = {
              id: sup.employee_id,
              employeeName: sup.employee_name,
              months: [laborCostsData]
            }
          } else {
            supports[sup.employee_id].months.push(laborCostsData)
          }
        }

        const supportsArr = Object.values(supports);
        const monthsNumbers = [];
        if (supportsArr.length) {
          for (const month of supportsArr[0].months) {
            if (month.actualLaborCosts) {
              monthsNumbers.push(month.monthNum)
            }
          }
        }

        const monthsWithTotalCosts = {};
        for (const dev of res) {
          if (!(dev.month in monthsWithTotalCosts)) {
            monthsWithTotalCosts[dev.month] = {
              totalActualCosts: dev.actual_labor_costs,
            }
          } else {
            monthsWithTotalCosts[dev.month].totalActualCosts += dev.actual_labor_costs;
          }
        }

        setTotalCostsByMonth(monthsWithTotalCosts);
        setMonthsNumbers(monthsNumbers);
        setSupports(supportsArr)
      })
      .catch((err) => console.log(err))
  }, [updateWidgetsToggle]);

  return (
    <WidgetContainer title='Поддержка' monthsNumbers={monthsNumbers}>
      <TableBody>
        <TableRow>
          <TableCell sx={{ borderLeft: 'none' }}></TableCell>
          {monthsNumbers.map((monthNum, index) => (
            <TableCell align='center' key={index}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell align='center' sx={{ borderBottom: 'none', fontWeight: 500 }}>
                      Факт
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableCell>
          ))}
        </TableRow>
        {supports.map((row) => (
          <TableRow key={row.id}>
            <TableCell align='center' sx={{ borderLeft: 'none' }}>
              {row.employeeName}
            </TableCell>
            {row.months.map((monthData) => (
              <TableCell align='center' key={monthData.monthNum}>
                <Table>
                  <TableBody>
                    <TableRow>
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

export default SupportsWidget;
