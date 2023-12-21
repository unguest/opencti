/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO Remove this when V6
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { FunctionComponent, useEffect, useMemo } from 'react';
import { Route, Switch, Link, useParams, useLocation, useRouteMatch } from 'react-router-dom';
import { graphql, loadQuery, usePreloadedQuery, useQueryLoader, useSubscription } from 'react-relay';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { PreloadedQuery } from 'react-relay/relay-hooks/EntryPointTypes';
import StixCoreRelationship from '../../common/stix_core_relationships/StixCoreRelationship';
import StixCyberObservable from './StixCyberObservable';
import StixCyberObservableKnowledge from './StixCyberObservableKnowledge';
import StixCoreObjectHistory from '../../common/stix_core_objects/StixCoreObjectHistory';
import StixCyberObservableHeader from './StixCyberObservableHeader';
import EntityStixSightingRelationships from '../../events/stix_sighting_relationships/EntityStixSightingRelationships';
import StixSightingRelationship from '../../events/stix_sighting_relationships/StixSightingRelationship';
import StixCoreObjectOrStixCoreRelationshipContainers from '../../common/containers/StixCoreObjectOrStixCoreRelationshipContainers';
import FileManager from '../../common/files/FileManager';
import { useFormatter } from '../../../../components/i18n';
import Loader from '../../../../components/Loader';
import { environment } from '../../../../relay/environment';
import { RootStixCyberObservableQuery } from '@components/observations/stix_cyber_observables/__generated__/RootStixCyberObservableQuery.graphql';

const subscription = graphql`
  subscription RootStixCyberObservableSubscription($id: ID!) {
    stixCyberObservable(id: $id) {
      ...StixCyberObservable_stixCyberObservable
      ...StixCyberObservableEditionContainer_stixCyberObservable
      ...StixCyberObservableKnowledge_stixCyberObservable
      ...FileImportViewer_entity
      ...FileExportViewer_entity
      ...FileExternalReferencesViewer_entity
      ...WorkbenchFileViewer_entity
    }
  }
`;

function useRootStixCyberObservableSubscription(
  id: string,
) {
  const config = useMemo(() => ({
    subscription,
    variables: { id },
  }), [id]);
  return useSubscription(config);
}

const stixCyberObservableQuery = graphql`
  query RootStixCyberObservableQuery($id: String!) {
    stixCyberObservable(id: $id) {
      id
      standard_id
      entity_type
      ...StixCyberObservable_stixCyberObservable
      ...StixCyberObservableDetails_stixCyberObservable
      ...StixCyberObservableIndicators_stixCyberObservable
      ...StixCyberObservableKnowledge_stixCyberObservable
      ...FileImportViewer_entity
      ...FileExportViewer_entity
      ...FileExternalReferencesViewer_entity
      ...WorkbenchFileViewer_entity
    }
    connectorsForImport {
      ...FileManager_connectorsImport
    }
    connectorsForExport {
      ...FileManager_connectorsExport
    }
  }
`;

const Toto = () => {
  const { observableId = '' } = useParams();

  const variables: stixCyberObservableQuery$variables = useMemo(() => ({ id: observableId, relationship_type: 'indicates' }), [observableId]);
  useRootStixCyberObservableSubscription(observableId);
  const [queryRef, fetchLoadQuery] = useQueryLoader<RootStixCyberObservableQuery>(
    stixCyberObservableQuery,
  );
  useEffect(
    () => {
      fetchLoadQuery(variables);
    },
    [],
  );
  return queryRef ? (
    <React.Suspense fallback={<Loader />}>
      <RenderRootStixCyberObservable queryRef={queryRef} />
    </React.Suspense>
  ) : (<Loader />)
};

const RenderRootStixCyberObservable: FunctionComponent<{ queryRef: PreloadedQuery<RootStixCyberObservableQuery> }> = ({ queryRef }) => {
  const { path } = useRouteMatch();
  const { observableId = '' } = useParams();

  const data = usePreloadedQuery(
    stixCyberObservableQuery,
    queryRef,
  );
  return (
    <Switch>
      <Route
        path={`${path}/knowledge/relations/:relationId`}
        render={(routeProps: object) => (
          <StixCoreRelationship
            entityId={observableId}
            {...routeProps}
          />
        )}
      />
      <Route
        path={`${path}/knowledge/sightings/:sightingId`}
        render={(routeProps: object) => (
          <StixSightingRelationship
            paddingRight={false}
            entityId={observableId}
            {...routeProps}
          />
        )}
      />
      <Route
        path={`${path}/knowledge`}
        render={(routeProps: object) => (
          <StixCyberObservableKnowledge
            {...routeProps}
            stixCyberObservable={data.stixCyberObservable}
          />
        )}
      />
      <Route
        path={`${path}/analyses`}
        render={(routeProps: object) => (
          <StixCoreObjectOrStixCoreRelationshipContainers
            authorId={undefined}
            onChangeOpenExports={undefined}
            reportType={undefined}
            {...routeProps}
            stixDomainObjectOrStixCoreRelationship={data.stixCyberObservable}
          />
        )}
      />
      <Route
        path={`${path}/sightings`}
        render={(routeProps: object) => (
          <EntityStixSightingRelationships
            isTo={false}
            {...routeProps}
            entityId={observableId}
            entityLink={linkKnowledge}
            noPadding={true}
            stixCoreObjectTypes={[
              'Region',
              'Country',
              'City',
              'Position',
              'Sector',
              'Organization',
              'Individual',
              'System',
            ]}
          />
        )}
      />
      <Route
        path={`${path}/files`}
        render={(routeProps: object) => (
          <FileManager
            {...routeProps}
            id={observableId}
            connectorsImport={data.connectorsForImport}
            connectorsExport={data.connectorsForExport}
            entity={data.stixCyberObservable}
          />
        )}
      />
      <Route
        path={`${path}/history`}
        render={(routeProps: object) => (
          <StixCoreObjectHistory
            {...routeProps}
            stixCoreObjectId={observableId}
          />
        )}
      />
      <Route
        path={`${path}`}
        render={(routeProps: object) => (
          <StixCyberObservable
            {...routeProps}
            stixCyberObservable={data.stixCyberObservable}
          />
        )}
      />
    </Switch>
  );
};

const RootStixCyberObservable = () => {
  const { t } = useFormatter();
  const location = useLocation();
  const { url } = useRouteMatch();
  const linkKnowledge = `${url}/knowledge`;

  return (
    <>
      <StixCyberObservableHeader
        isArtifact={undefined}
        disableSharing={undefined}
      />
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          marginBottom: 4,
        }}
      >
        <Tabs
          value={
            location.pathname.includes(linkKnowledge)
              ? linkKnowledge
              : location.pathname
          }
        >
          <Tab
            replace
            component={Link}
            to={`${url}`}
            value={`${url}`}
            label={t('Overview')}
          />
          <Tab
            replace
            component={Link}
            to={linkKnowledge}
            value={linkKnowledge}
            label={t('Knowledge')}
          />
          <Tab
            replace
            component={Link}
            to={`${url}/analyses`}
            value={`${url}/analyses`}
            label={t('Analyses')}
          />
          <Tab
            replace
            component={Link}
            to={`${url}/sightings`}
            value={`${url}/sightings`}
            label={t('Sightings')}
          />
          <Tab
            replace
            component={Link}
            to={`${url}/files`}
            value={`${url}/files`}
            label={t('Data')}
          />
          <Tab
            replace
            component={Link}
            to={`${url}/history`}
            value={`${url}/history`}
            label={t('History')}
          />
        </Tabs>
      </Box>
      <Toto />
    </>
  );
};

export default RootStixCyberObservable;
