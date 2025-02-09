import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {  PolutionTableModelProps} from '../../@types/polutionmodel';


function PolutionTable({data}:PolutionTableModelProps) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">CARBON MONOXIDE PPM</TableCell>
            <TableCell align="right">NITROGEN DIOXIDE PPM</TableCell>
            <TableCell align="right">OZONE PPM</TableCell>
            <TableCell align="right">PM10 UG M3</TableCell>
            <TableCell align="right">PM25 UG M3</TableCell>
            <TableCell align="right">SULFUR DIOXIDE PPB</TableCell>
          </TableRow>
        </TableHead>
      
        <TableBody>
          
            <TableRow
              key={`${data?.title}`}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="right">{data?.CARBON_MONOXIDE_PPM ? data?.CARBON_MONOXIDE_PPM : "-"}</TableCell>
              <TableCell align="right">{data?.NITROGEN_DIOXIDE_PPM ? data?.NITROGEN_DIOXIDE_PPM : "-"}</TableCell>
              <TableCell align="right">{data?.OZONE_PPM ? data?.OZONE_PPM : "-"}</TableCell>
              <TableCell align="right">{data?.PM10_UG_M3 ? data?.PM10_UG_M3 : "-"}</TableCell>
              <TableCell align="right">{data?.PM25_UG_M3 ? data?.PM25_UG_M3 : "-"}</TableCell>
              <TableCell align="right">{data?.SULFUR_DIOXIDE_PPB ? data?.SULFUR_DIOXIDE_PPB : "-"}</TableCell>
            </TableRow>
          
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PolutionTable;