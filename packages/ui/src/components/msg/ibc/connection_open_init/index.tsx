import Typography from '@mui/material/Typography';
import AppTrans from '@/components/AppTrans';
import { FC } from 'react';
import Name from '@/components/name';
import { type MsgConnectionOpenInit } from '@/models';
import { useProfileRecoil } from '@/recoil/profiles/hooks';

const ConnectionOpenInit: FC<{ message: MsgConnectionOpenInit }> = (props) => {
  const { message } = props;

  const signer = useProfileRecoil(message.signer);
  const signerMoniker = signer ? signer?.name : message.signer;

  return (
    <Typography>
      <AppTrans
        i18nKey="message_contents:txConnectionOpenInitContent"
        components={[<Name address={message.signer} name={signerMoniker} />, <b />]}
        values={{
          clientId: message.clientId,
          counterparty: message.counterparty,
        }}
      />
    </Typography>
  );
};

export default ConnectionOpenInit;
