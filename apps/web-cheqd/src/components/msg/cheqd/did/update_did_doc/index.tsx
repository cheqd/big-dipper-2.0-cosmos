import { MsgUpdateDIDDoc } from '@models';
import Typography from '@mui/material/Typography';
import DID from '@/components/did';
import { Trans } from 'next-i18next';
import React from 'react';

const UpdateDidDoc = (props: { message: MsgUpdateDIDDoc }) => {
  const { message } = props;

  return (
    <Typography>
      <Trans
        i18nKey="message_contents:MsgUpdateDIDDoc"
        components={[<DID did={message.payload.id} />]}
      />
    </Typography>
  );
};

export default UpdateDidDoc;
