import React from 'react';
import classnames from 'classnames';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import { DID_RESOLVER_URL } from '@/utils/go_to_page';
import useStyles from './styles';

const DID: React.FC<{ className?: string; did: string; href?: (did: string) => string }> = ({
  className,
  did,
  href = DID_RESOLVER_URL,
}) => {
  const classes = useStyles();

  return (
    <Typography className={classnames(classes.root, className)}>
      <Link href={href(did)}>
        <a>{did}</a>
      </Link>
    </Typography>
  );
};

export default DID;
