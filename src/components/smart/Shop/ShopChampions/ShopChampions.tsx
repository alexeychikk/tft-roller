import React from 'react';
import clsx from 'clsx';

import { useTftState } from '@src/state';
import { CHAMPIONS_MAP } from '@src/constants';
import { ChampionAvatar } from '@src/components/dumb/ChampionAvatar';

import './ShopChampions.styles.css';

export type ShopChampionsProps = {};

const ShopChampionsBase: React.FC<ShopChampionsProps> = (props) => {
  const { shopChampionNames, buyChampion } = useTftState();

  return (
    <div className="tft__shop__champions">
      {shopChampionNames.map((name, index) => {
        return (
          <div key={index} className="tft__shop__champion-slot">
            {name && (
              <ChampionAvatar name={name} onClick={() => buyChampion(index)} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export const ShopChampions = React.memo(ShopChampionsBase);
