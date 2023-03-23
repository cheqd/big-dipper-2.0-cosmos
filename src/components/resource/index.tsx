import React from 'react';
import classnames from 'classnames';
import Link from 'next/link';
import { Typography } from '@material-ui/core';
import { RESOURCE_URL } from '@utils/go_to_page';
import { useStyles } from './styles';

const Resource: React.FC<{
  className?: string;
  collection: string;
  id: string;
  href?: (collection: string, id: string) => string;
}> = ({
  className, collection, id, href = RESOURCE_URL,
}) => {
  const classes = useStyles();

  return (
    <Link target="_blank" href={href(collection, id)} passHref>
      <Typography variant="body1" className={classnames(className, classes.root)} component="a">
        {id}
      </Typography>
    </Link>
  );
};

export default Resource;
