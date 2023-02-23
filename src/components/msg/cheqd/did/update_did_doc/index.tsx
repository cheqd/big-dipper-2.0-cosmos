import { MsgUpdateDIDDoc } from '@models';
import { Typography } from '@material-ui/core';
import DID from '@src/components/did';
import Trans from 'next-translate/Trans';
import React from 'react';

const UpdateDIDDoc = (props: { message: MsgUpdateDIDDoc }) => {
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

export default UpdateDIDDoc;
