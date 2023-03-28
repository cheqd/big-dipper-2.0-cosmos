import { MsgDeactivateDIDDoc } from '@models';
import Typography from '@mui/material/Typography';
import DID from '@/components/did';
import { Trans } from 'next-i18next';
import React from 'react';

const DeactivateDidDoc = (props: { message: MsgDeactivateDIDDoc }) => {
  const { message } = props;

  return (
    <Typography>
      <Trans
        i18nKey="message_contents:MsgDeactivateDIDDoc"
        components={[<DID did={message.payload.id} />]}
      />
    </Typography>
  );
};

export default DeactivateDidDoc;
