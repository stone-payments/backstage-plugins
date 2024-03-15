import { Entity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Chip, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect } from 'react';
import useAsync from 'react-use/lib/useAsync';

import {
  EmptyState,
  InfoCard,
  InfoCardVariants,
  Progress,
  Table,
  TableColumn,
} from '@backstage/core-components';
import { configApiRef, errorApiRef, useApi } from '@backstage/core-plugin-api';
import { scoreToColorConverter } from '../../helpers/scoreToColorConverter';
import { getWarningPanel } from '../../helpers/getWarningPanel';
import {
  getScoreTableEntries,
  EntityScoreTableEntry,
} from './helpers/getScoreTableEntries';
import { areaColumn } from './columns/areaColumn';
import { detailsColumn } from './columns/detailsColumn';
import { scorePercentColumn } from './columns/scorePercentColumn';
import { titleColumn } from './columns/titleColumn';
import { getReviewerLink } from './sub-components/getReviewerLink';
import { scoringDataApiRef } from '../../api';

const useStyles = makeStyles(theme => ({
  badgeLabel: {
    color: theme.palette.common.white,
  },
  header: {
    padding: theme.spacing(2, 2, 2, 2.5),
  },
  action: {
    margin: 0,
  },
  disabled: {
    backgroundColor: theme.palette.background.default,
  },
}));

const useScoringDataLoader = () => {
  const errorApi = useApi(errorApiRef);
  const scorigDataApi = useApi(scoringDataApiRef);
  const config = useApi(configApiRef);
  const { entity } = useEntity();

  const { error, value, loading } = useAsync(
    async () => scorigDataApi.getScore(entity),
    [scorigDataApi, entity],
  );

  useEffect(() => {
    if (error) {
      errorApi.post(error);
    }
  }, [error, errorApi]);

  const wikiLinkTemplate =
    config.getOptionalString('scorecards.wikiLinkTemplate') ?? '';

  return { loading, value, wikiLinkTemplate, error };
};

export const ScoreCard = ({
  title,
  subTitle,
  tableTitle,
  showError = true,
  emptyElement = <EmptyState
    missing="info"
    title="No information to display"
    description="There is no data available for this entity"
  />,
  variant = 'gridItem',
}: {
  title?: string;
  subTitle?: string;
  tableTitle?: string;
  entity?: Entity;
  emptyElement?: JSX.Element;
  showError?: boolean;
  variant?: InfoCardVariants;
}) => {
  const { loading, error, value: data, wikiLinkTemplate } = useScoringDataLoader();
  const classes = useStyles();

  let gateLabel = 'Not computed';
  const gateStyle = {
    margin: 0,
    backgroundColor: scoreToColorConverter(data?.scoreSuccess).background,
    color: scoreToColorConverter(data?.scoreSuccess).foreground,
  };
  if (data?.scorePercent || data?.scorePercent === 0) {
    const label = data?.scoreLabel ?? `${data.scorePercent} %`;
    gateLabel = `Total score: ${label}`;
  }
  const qualityBadge = !loading && <Chip label={gateLabel} style={gateStyle} />;

  const columns: TableColumn<EntityScoreTableEntry>[] = [
    areaColumn(data),
    titleColumn(wikiLinkTemplate),
    detailsColumn,
    scorePercentColumn,
  ];

  const allEntries = getScoreTableEntries(data);

  // Combinando título e subtítulo em um fragmento JSX para passar para InfoCard
  const combinedTitle = (
    <>
      {title && <Typography variant="h6">{title}</Typography>}
      {subTitle && <Typography variant="subtitle1">{subTitle}</Typography>}
    </>
  );

  return (
    <InfoCard
      title={combinedTitle} // Passando o título combinado
      variant={variant}
      headerProps={{
        action: qualityBadge,
        classes: {
          root: classes.header,
          action: classes.action,
        },
      }}
    >
      {loading && <Progress />}
      {showError && error && getWarningPanel(error)}
      {!loading && !data && (
        <div data-testid="score-card-no-data">{emptyElement}</div>
      )}
      {!loading && data && (
        <div data-testid="score-card">
          <Grid
            item
            container
            direction="column"
            justifyContent="space-between"
            alignItems="stretch"
            style={{ height: '100%' }}
            spacing={0}
          >
            <Table<EntityScoreTableEntry>
              title={tableTitle ?? "Score of each requirement"}
              options={{
                search: true,
                paging: false,
                grouping: true,
                padding: 'dense',
              }}
              columns={columns}
              data={allEntries}
              components={{
                Groupbar: () => null,
              }}
            />
            {getReviewerLink(data)}
          </Grid>
        </div>
      )}
    </InfoCard>
  );
};
