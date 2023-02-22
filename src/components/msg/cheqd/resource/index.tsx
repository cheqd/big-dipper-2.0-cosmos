import { MsgCreateResource } from '@models';
import { Typography } from '@material-ui/core';
import Resource from '@src/components/resource';
import Trans from 'next-translate/Trans';
import React from 'react';

const CreateResource = (props: { message: MsgCreateResource }) => {
  const { message } = props;

  return (
    <Typography>
      <Trans
        i18nKey="message_contents:MsgCreateResource"
        components={[
          (
            <Resource
              collection={message.payload.collection_id}
              id={message.payload.id}
            />
          ),
        ]}
      />
    </Typography>
  );
};

export default CreateResource;
