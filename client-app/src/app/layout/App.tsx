<<<<<<< HEAD
import React, { Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import {
  Route,
  withRouter,
  RouteComponentProps,
  Switch
} from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import NotFound from './NotFound';
import {ToastContainer} from 'react-toastify';
=======
import React, { Fragment } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import { Route, withRouter, RouteComponentProps, Switch } from "react-router-dom";
import HomePage  from "../../features/home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import  ActivityDetails  from "../../features/activities/details/ActivityDetails";
import NotFound from "./NotFount";
import {ToastContainer} from 'react-toastify'
>>>>>>> 2bd193f00efd2d175d9ac10d6f779712d9e043b0

const App: React.FC<RouteComponentProps> = ({ location }) => {
  return (
    <Fragment>
<<<<<<< HEAD
      <ToastContainer position='bottom-right' />
=======
      <ToastContainer position='bottom-right'/>
>>>>>>> 2bd193f00efd2d175d9ac10d6f779712d9e043b0
      <Route exact path='/' component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
              <Switch>
<<<<<<< HEAD
                <Route exact path='/activities' component={ActivityDashboard} />
                <Route path='/activities/:id' component={ActivityDetails} />
                <Route
                  key={location.key}
                  path={['/createActivity', '/manage/:id']}
                  component={ActivityForm}
                />
                <Route component={NotFound} />
=======
              <Route exact path='/activities' component={ActivityDashboard} />
              <Route path='/activities/:id' component={ActivityDetails} />
              <Route
                key={location.key}
                path={['/createActivity', '/manage/:id']}
                component={ActivityForm}
              />
              <Route component= {NotFound}/>
>>>>>>> 2bd193f00efd2d175d9ac10d6f779712d9e043b0
              </Switch>
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
