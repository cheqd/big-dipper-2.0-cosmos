import React from 'react';
import useTranslation from 'next-translate/useTranslation';
import {
  Typography,
  Dialog,
} from '@material-ui/core';
import QRCode from 'qrcode.react';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
  WhatsappIcon,
  EmailShareButton,
  EmailIcon,
} from 'react-share';
import CopyIcon from '@assets/icon-copy.svg';
import ShareIcon from '@assets/icon-share.svg';
import { getMiddleEllipsis } from '@utils/get_middle_ellipsis';
import {
  BoxDetails, Box,
} from '@components';
import { useStyles } from './styles';
import { useOverview } from './hooks';
import { useAccountContext } from '../../contexts/account';

const Overview: React.FC<{
  className?: string;
}> = ({ className }) => {
  const classes = useStyles();
  const { t } = useTranslation('accounts');
  const {
    open,
    handleClose,
    handleOpen,
    handleCopyToClipboard,
  } = useOverview(t);
  const { rawData } = useAccountContext();

  const dummyProps = {
    title: t('overview'),
    details: [
      {
        label: t('address'),
        className: classes.copyText,
        detail: (
          <>
            <CopyIcon
              onClick={() => handleCopyToClipboard(rawData.account.address)}
              className={classes.actionIcons}
            />
            <ShareIcon
              onClick={handleOpen}
              className={classes.actionIcons}
            />
            <Typography variant="body1" className="value">
              {getMiddleEllipsis(rawData.account.address, {
                beginning: 15, ending: 5,
              })}
            </Typography>
          </>
        ),
      },
      {
        label: t('rewardAddress'),
        className: classes.copyText,
        detail: (
          <>
            <CopyIcon
              className={classes.actionIcons}
              onClick={() => handleCopyToClipboard(rawData.account.withdrawalAddress)}
            />
            <Typography variant="body1" className="value">
              {getMiddleEllipsis(rawData.account.withdrawalAddress, {
                beginning: 15, ending: 5,
              })}
            </Typography>
          </>
        ),
      },
    ],
  };

  const url = `${process.env.NEXT_PUBLIC_URL}/accounts/${rawData.account.address}`;
  const hashTags = ['#forbole', '#bigdipper'];
  return (
    <>
      <Dialog
        maxWidth="xl"
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <Box className={classes.dialog}>
          <Typography variant="body1" align="center">
            {t('scanForAddress')}
          </Typography>
          <QRCode
            value={rawData.account.address}
            size={200}
            bgColor="#ffffff"
            fgColor="#000000"
            renderAs="svg"
          />
          <div className="dialog__share--wrapper">
            <Typography variant="body1">
              {t('shareTo')}
            </Typography>
            <div className={classes.icons}>
              <FacebookShareButton
                url={url}
                quote={rawData.account.address}
                hashtag={hashTags[0]}
                className="share-buttons"
              >
                <FacebookIcon
                  round
                />
              </FacebookShareButton>
              <TwitterShareButton
                url={url}
                title={rawData.account.address}
                hashtags={hashTags}
                className="share-buttons"
              >
                <TwitterIcon
                  round
                />
              </TwitterShareButton>

              <TelegramShareButton
                url={url}
                title={rawData.account.address}
                className="share-buttons"
              >
                <TelegramIcon
                  round
                />
              </TelegramShareButton>

              <WhatsappShareButton
                url={url}
                title={rawData.account.address}
                separator=":: "
                className="share-buttons"
              >
                <WhatsappIcon
                  round
                />
              </WhatsappShareButton>
              <EmailShareButton
                url={url}
                subject="address"
                body={rawData.account.address}
                separator=":: "
                className="share-buttons email"
              >
                <EmailIcon
                  round
                />
              </EmailShareButton>
            </div>
          </div>
        </Box>
      </Dialog>
      <BoxDetails className={className} {...dummyProps} />
    </>
  );
};

export default Overview;