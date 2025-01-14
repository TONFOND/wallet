import React, { FC } from 'react';

import * as S from './Separator.style';
import { SeparatorProps } from '$uikit/Separator/Separator.interface';
import { useTheme } from '$hooks';

export const Separator: FC<SeparatorProps> = (props) => {
  const {
    absolute = false,
    backgroundColor = 'backgroundSecondary',
    toTop = false,
  } = props;
  const theme = useTheme();

  return (
    <S.Wrap
      absolute={absolute}
      toTop={toTop}
      style={{ backgroundColor: theme.colors[backgroundColor] }}
    >
      <S.Separator />
    </S.Wrap>
  );
};
