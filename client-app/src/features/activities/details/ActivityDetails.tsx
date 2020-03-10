import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';

interface DetailParams {
  id: string;
}

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({
<<<<<<< HEAD
  match,
  history
=======
  match,history
>>>>>>> 2bd193f00efd2d175d9ac10d6f779712d9e043b0
}) => {
  const activityStore = useContext(ActivityStore);
  const { activity, loadActivity, loadingInitial } = activityStore;

  useEffect(() => {
    loadActivity(match.params.id);
<<<<<<< HEAD
  }, [loadActivity, match.params.id, history]);

  if (loadingInitial) return <LoadingComponent content='Loading activity...' />;

  if (!activity) return <h2>Activity not found</h2>;
=======
  }, [loadActivity, match.params.id,history]);

  if (loadingInitial )
    return <LoadingComponent content='Loading activity...' />;
  if (!activity) 
     return <h2>Activity Not Found</h2> 
   
 
>>>>>>> 2bd193f00efd2d175d9ac10d6f779712d9e043b0

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader activity={activity} />
        <ActivityDetailedInfo activity={activity} />
        <ActivityDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDetails);
