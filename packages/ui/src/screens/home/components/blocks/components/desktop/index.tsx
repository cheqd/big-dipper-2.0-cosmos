import AvatarName from '@/components/avatar_name';
import { useProfileRecoil } from '@/recoil/profiles/hooks';
import { useStyles } from '@/screens/home/components/blocks/components/desktop/styles';
import { columns } from '@/screens/home/components/blocks/components/desktop/utils';
import type { ItemType } from '@/screens/home/components/blocks/types';
import dayjs from '@/utils/dayjs';
import { getMiddleEllipsis } from '@/utils/get_middle_ellipsis';
import { BLOCK_DETAILS } from '@/utils/go_to_page';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import numeral from 'numeral';
import { FC } from 'react';

type BlockRowProps = {
  item: ItemType;
};

const BlockRow: FC<BlockRowProps> = ({ item }) => {
  const { name, address, imageUrl } = useProfileRecoil(item.proposer);

  const formattedData = {
    height: (
      <Link href={BLOCK_DETAILS(item.height)} passHref>
        <Typography variant="body1" className="value" component="a">
          {numeral(item.height).format('0,0')}
        </Typography>
      </Link>
    ),
    txs: numeral(item.txs).format('0,0'),
    time: dayjs.utc(item.timestamp).fromNow(),
    proposer: <AvatarName address={address} imageUrl={imageUrl} name={name} />,
    hash: getMiddleEllipsis(item.hash, {
      beginning: 6,
      ending: 5,
    }),
  };
  return (
    <TableRow>
      {columns.map((column) => {
        const { key, align } = column;
        return (
          <TableCell key={`${item.height}-${key}`} align={align}>
            {formattedData[key as keyof typeof formattedData]}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

type DesktopProps = {
  className?: string;
  items: ItemType[];
};

const Desktop: FC<DesktopProps> = ({ className, items }) => {
  const { t } = useTranslation('blocks');
  const classes = useStyles();

  return (
    <div className={classnames(className, classes.root)}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.key} align={column.align}>
                {t(column.key)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((row) => (
            <BlockRow key={row.height} item={row} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Desktop;