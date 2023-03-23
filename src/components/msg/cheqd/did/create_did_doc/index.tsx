import { MsgCreateDIDDoc } from '@models';
import { Typography } from '@material-ui/core';
import DID from '@src/components/did';
import Trans from 'next-translate/Trans';
import React from 'react';

const CreateDIDDoc = (props: { message: MsgCreateDIDDoc }) => {
  const { message } = props;

  return (
    <Typography>
      <Trans
        i18nKey="message_contents:MsgCreateDIDDoc"
        components={[<DID did={message.payload.id} />]}
      />
    </Typography>
  );
};

export default CreateDIDDoc;
