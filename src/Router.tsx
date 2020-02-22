import React, { useReducer } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Dispatch, Global, InitialState, Reducer } from './globalState';
import { Home } from './routes/home';
import { NotFound } from './routes/notFound';

const Router: React.FC = () => {
  const [global, dispatch] = useReducer(Reducer, InitialState);
  return (
    <Dispatch.Provider value={{ dispatch }}>
      <Global.Provider value={{ global }}>
        <BrowserRouter>
          <Route
            render={({ location }) => (
              <Switch location={location}>
                <Route exact path='/' component={Home} />
                <Route component={NotFound} />
              </Switch>
            )}
          />
        </BrowserRouter>
      </Global.Provider>
    </Dispatch.Provider>
  );
};

export { Router };
