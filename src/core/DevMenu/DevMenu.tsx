import React, { FC, useCallback } from 'react';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Animated from 'react-native-reanimated';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Clipboard from '@react-native-community/clipboard';
import DeviceInfo from 'react-native-device-info';

import * as S from './DevMenu.style';
import { ns } from '$utils';
import { NavBar, ScrollHandler } from '$uikit';
import { CellSection, CellSectionItem } from '$shared/components';
import { mainActions, mainSelector } from '$store/main';
import { useNavigation, useTranslator } from '$hooks';
import { openLogs } from '$navigation';
import { toastActions } from '$store/toast';
import crashlytics from '@react-native-firebase/crashlytics';

export const DevMenu: FC = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const nav = useNavigation();
  const dispatch = useDispatch();
  const t = useTranslator();
  const { isTestnet } = useSelector(mainSelector);

  const handleToggleTestnet = useCallback(() => {
    Alert.alert(t('settings_network_alert_title'), '', [
      {
        text: 'Testnet',
        onPress: () => {
          dispatch(mainActions.toggleTestnet({ isTestnet: true }));
        },
      },
      {
        text: 'Mainnet',
        onPress: () => {
          dispatch(mainActions.toggleTestnet({ isTestnet: false }));
        },
      },
    ]);
  }, [dispatch, t]);

  const handleLogs = useCallback(() => {
    openLogs();
  }, []);

  const handleTestCrash = useCallback(() => {
    crashlytics().crash();
  }, []);

  const handleTestJsCrash = useCallback(() => {
    throw new Error('Test js crash');
  }, []);

  const handleComponents = useCallback(() => {
    nav.navigate('DevStack');
  }, []);

  const handleCopyVersion = useCallback(() => {
    Clipboard.setString(DeviceInfo.getVersion() + ` (${DeviceInfo.getBuildNumber()})`);
    dispatch(toastActions.success(t('copied')));
  }, [dispatch, t]);

  return (
    <S.Wrap>
      <NavBar>Dev Menu</NavBar>
      <ScrollHandler>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: ns(16),
            paddingBottom: tabBarHeight,
          }}
          scrollEventThrottle={16}
        >
          <CellSection>
            <CellSectionItem onPress={handleCopyVersion}>
              Version {DeviceInfo.getVersion()} ({DeviceInfo.getBuildNumber()})
            </CellSectionItem>
            <CellSectionItem icon="ic-reset-24" onPress={handleToggleTestnet}>
              {t(isTestnet ? 'settings_to_mainnet' : 'settings_to_testnet')}
            </CellSectionItem>
            <CellSectionItem onPress={handleLogs}>Logs</CellSectionItem>
            {__DEV__ && (
              <>
                <CellSectionItem onPress={handleTestCrash}>Test native crash</CellSectionItem>
                <CellSectionItem onPress={handleTestJsCrash}>Test js-crash</CellSectionItem>
                <CellSectionItem onPress={handleComponents}>Components</CellSectionItem>
              </>
            )}
          </CellSection>
        </Animated.ScrollView>
      </ScrollHandler>
    </S.Wrap>
  );
};
