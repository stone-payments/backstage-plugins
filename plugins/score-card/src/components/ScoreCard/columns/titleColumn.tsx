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
import { Link } from '@material-ui/core';
import React from 'react';
import { EntityScoreTableEntry } from '../helpers/getScoreTableEntries';
import { getWikiUrl } from '../helpers/getWikiUrl';
import { nameToColorCombinationConverter } from '../../../helpers/nameToColorCombinationConverter';

export function titleColumn(
  wikiLinkTemplate: string,
): TableColumn<EntityScoreTableEntry> {
  return {
    title: <div style={{ minWidth: '7rem' }}>Requirement</div>,
    field: 'title',
    grouping: false,
    width: '1%',
    render: entityScoreEntry => {
      const wikiUrl = getWikiUrl(wikiLinkTemplate, entityScoreEntry);
      const title = (
        entityScoreEntry.titleLabel ? 
          <>
            <span style={{ 
              fontSize: '12px',
              borderRadius: '4px', 
              padding: '0px 4px',
              display: 'inline-block',
              marginBottom: '4px',
              color: nameToColorCombinationConverter(entityScoreEntry.titleLabelColor).foreground,
              backgroundColor: nameToColorCombinationConverter(entityScoreEntry.titleLabelColor).background
            }}>
                {entityScoreEntry.titleLabel} 
            </span><br/>
            {entityScoreEntry.title}
          </>
          : <>{entityScoreEntry.title}</>
      );

      return (<span style={{ lineHeight: '20px' }}>
          {wikiUrl ? (
          <Link
            href={wikiUrl}
            target="_blank"
            data-id={entityScoreEntry.id}
            >
            {title}
          </Link>
        ) : (
          <>{title}</>
        )}
          {entityScoreEntry.isOptional ? ' (Optional)' : null}
        </span>
      )
    },
  };
}
