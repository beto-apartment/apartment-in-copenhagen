import React from 'react';
// components
import UpdateUsernameForm from './ChangeUsername'
import ChangePasswordForm from './ChangePassword';
import ChangeEmailForm from './ChangeEmail';
// material
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const UserSettings = ({ isEmployee }) => {
  return (
    <div style={{width: '15em', marginBottom: '1em'}}>
      {isEmployee && (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="change-username-content"
            id="change-username-header"
          >
            <Typography>Change Name</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <UpdateUsernameForm />
          </AccordionDetails>
        </Accordion>
      )}
      
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="change-password-content"
          id="change-password-header"
        >
          <Typography>Change Password</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ChangePasswordForm isRecoverPassword={false} />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="change-email-content"
          id="change-email-header"
        >
          <Typography>Change Email</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ChangeEmailForm />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default UserSettings;
