import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { MONTHS } from '../../utils/constants/constants';

function WidgetContainer({ title, children, monthsNumbers }) {
  return (
    <TableContainer component={Paper} sx={{
      'td, th': { padding: '2px' },
      borderTop: '1px solid rgba(224, 224, 224, 1)',
      borderRight: '1px solid rgba(224, 224, 224, 1)'
    }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align='center'>{title}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell sx={{ borderBottom: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align='center' sx={{ borderLeft: 'none' }}></TableCell>
                    {monthsNumbers.map((monthNumber) => (
                      <TableCell align='center' key={monthNumber}>
                        {MONTHS[monthNumber]}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                {children}
              </Table>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default WidgetContainer;
