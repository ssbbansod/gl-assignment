import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { PolutionModelProps } from '../../@types/polutionmodel';
import './PolutionDataModel.module.css'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function PolutionDataModel({ open, onHandleClose, data }: PolutionModelProps) {
  return (
    <React.Fragment>

      <BootstrapDialog
        onClose={onHandleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {data?.title}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onHandleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography variant="h6" gutterBottom>
            Polution Metrics
          </Typography>
          {data &&
            <table >
              <thead><tr><th>Metric</th><th>Value</th></tr></thead>
              <tbody>
                {data && Object.entries(data)
                  .filter(([key, _]) => key !== "title")
                  .map(([key, _],index) =>
                    <tr key={index}>
                      <td>
                        <Typography gutterBottom>
                          {key}
                        </Typography>
                      </td>

                      <td align='center'>
                        <Typography gutterBottom>
                          {data[key] ? data[key] : "null"}
                        </Typography>
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          }

        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={onHandleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment >
  );
}
