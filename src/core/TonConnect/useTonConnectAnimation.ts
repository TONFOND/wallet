import React from 'react';
import { delay } from '$utils';
import { useTickerAnimation } from './useTickerAnimation';
import { ADDRESS_CELL_WIDTH } from './TonConnect.style';
import { useSelector } from 'react-redux';
import { walletSelector } from '$store/wallet';
import { CryptoCurrencies } from '$shared/constants';

export enum States {
  INITIAL,
  LOADING,
  SUCCESS,
  RETURN,
}

export const ADDRESS_REPEAT_COUNT = 4;
export const ADDRESS_TEXT_WIDTH = 800;

export const useTonConnectAnimation = () => {
  const [state, setState] = React.useState(States.INITIAL);
  const ticker = useTickerAnimation();

  const { address: addresses } = useSelector(walletSelector);
  const address = addresses[CryptoCurrencies.Ton];

  React.useEffect(() => {
    ticker.start({
      targetWidth: ADDRESS_CELL_WIDTH,
      textWidth: ADDRESS_TEXT_WIDTH,
    });
  }, []);

  const revert = () => {
    setState(States.INITIAL);
  };

  const startLoading = () => {
    setTimeout(() => setState(States.LOADING), 300);
  };

  const showSuccess = async (onShown: () => void) => {
    await delay(250);

    setState(States.SUCCESS);
    onShown();

    await delay(1750);
  };

  const showReturnButton = () => {
    setState(States.RETURN);
  };

  return {
    showReturnButton,
    startLoading,
    showSuccess,
    revert,
    ticker,
    state,
    address,
  };
};
