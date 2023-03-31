import { MsgDeactivateDIDDoc } from '@models';
import { Typography } from '@material-ui/core';
import DID from '@src/components/did';
import Trans from 'next-translate/Trans';
import React from 'react';

const DeactivateDIDDoc = (props: { message: MsgDeactivateDIDDoc }) => {
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

export default DeactivateDIDDoc;
