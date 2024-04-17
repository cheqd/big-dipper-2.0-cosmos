import Avatar from '@/components/avatar';
import useStyles from '@/components/avatar_name/styles';
import { ACCOUNT_DETAILS } from '@/utils/go_to_page';
import Link from 'next/link';
import { FC } from 'react';
import { AvatarNameProps } from '@/components/avatar_name/types';

const AvatarName: FC<AvatarNameProps> = ({
  className,
  address,
  name,
  imageUrl,
  href = ACCOUNT_DETAILS,
}) => {
  const { classes, cx } = useStyles();
  return (
    <Link shallow href={href(address || name)}>
      <span className={cx(classes.root, className)}>
        <Avatar address={address} imageUrl={imageUrl ?? undefined} />
        <span>{name}</span>
      </span>
    </Link>
  );
};

export default AvatarName;
