import {createFactory} from 'react';
import rr from 'react-router';

// Convenience methods to allow using react-router components without JSX
export const DefaultRoute = createFactory(rr.DefaultRoute);
export const Link = createFactory(rr.Link);
export const NotFoundRoute = createFactory(rr.NotFoundRoute);
export const Redirect = createFactory(rr.Redirect);
export const Route = createFactory(rr.Route);
export const RouteHandler = createFactory(rr.RouteHandler);

// In case JSX components are expected:
DefaultRoute.jsx = rr.DefaultRoute;
Link.jsx = rr.Link;
NotFoundRoute.jsx = rr.NotFoundRoute;
Redirect.jsx = rr.Redirect;
Route.jsx = rr.Route;
RouteHandler.jsx = rr.RouteHandler;

// Override components on Router
rr.DefaultRoute = DefaultRoute;
rr.Link = Link;
rr.NotFoundRoute = NotFoundRoute;
rr.Redirect = Redirect;
rr.Route = RouteHandler;
rr.RouteHandler = RouteHandler;
export default rr;
export const Router = rr;
