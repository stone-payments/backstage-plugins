/*
 * Copyright 2022 Oriflame
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TableColumn } from '@backstage/core-components';
import { Chip } from '@material-ui/core';
import React from 'react';
import { scoreToColorConverter } from '../../../helpers/scoreToColorConverter';
import { EntityScoreTableEntry } from '../helpers/getScoreTableEntries';

export const scorePercentColumn: TableColumn<EntityScoreTableEntry> = {
  title: <div style={{ minWidth: '3.5rem' }}>Score</div>,
  field: 'scorePercent',
  align: 'right',
  grouping: false,
  width: '1%',
  render: entityScoreEntry => {
    const chipStyle: React.CSSProperties = {
      margin: 0,
      backgroundColor: scoreToColorConverter(entityScoreEntry?.scoreSuccess).background,
      color: scoreToColorConverter(entityScoreEntry?.scoreSuccess).foreground,
      minWidth: '4rem',
    };
    const label = entityScoreEntry?.scoreLabel ?? `${entityScoreEntry.scorePercent} %`;
    return typeof entityScoreEntry.scorePercent !== 'undefined' ? (
      <Chip label={label} style={chipStyle} />
    ) : null;
  },
};
