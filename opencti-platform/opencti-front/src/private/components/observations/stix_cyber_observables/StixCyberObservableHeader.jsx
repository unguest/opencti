import React, { useEffect } from 'react';
import { graphql, createFragmentContainer, useQueryLoader, usePreloadedQuery, useLazyLoadQuery } from 'react-relay';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import StixCyberObservablePopover from './StixCyberObservablePopover';
import { truncate } from '../../../../utils/String';
import StixCoreObjectEnrichment from '../../common/stix_core_objects/StixCoreObjectEnrichment';
import StixCoreObjectSharing from '../../common/stix_core_objects/StixCoreObjectSharing';
import { useParams } from "react-router-dom";
import Loader from "../../../../components/Loader";

const useStyles = makeStyles(() => ({
  title: {
    float: 'left',
  },
  popover: {
    float: 'left',
    marginTop: '-13px',
  },
  actions: {
    margin: '-6px 0 0 0',
    float: 'right',
  },
}));

const stixCyberObservableQuery = graphql`
  query StixCyberObservableHeaderQuery($id: String!) {
    stixCyberObservable(id: $id) {
      id
      observable_value
      entity_type
    }
  }
`;

const StixCyberObservableHeader = ({
  isArtifact,
  disableSharing,
}) => {
  const classes = useStyles();
  const { observableId = '' } = useParams();
  const { stixCyberObservable } = useLazyLoadQuery(
    stixCyberObservableQuery,
    { id: observableId },
    {fetchPolicy: 'store-or-network'},
  );
  return (
    <div>
      <Typography
        variant="h1"
        gutterBottom={true}
        classes={{ root: classes.title }}
      >
        {truncate(stixCyberObservable.observable_value, 50)}
      </Typography>
      <div className={classes.popover}>
        <StixCyberObservablePopover
          stixCyberObservableId={stixCyberObservable.id}
          isArtifact={isArtifact}
        />
      </div>
      <div className={classes.actions}>
        <ToggleButtonGroup size="small" color="secondary" exclusive={true}>
          {disableSharing !== true && (
            <StixCoreObjectSharing
              elementId={stixCyberObservable.id}
              variant="header"
            />
          )}
          <StixCoreObjectEnrichment stixCoreObjectId={stixCyberObservable.id} />
        </ToggleButtonGroup>
      </div>
      <div className="clearfix" />
    </div>
  );
};

export default StixCyberObservableHeader;
