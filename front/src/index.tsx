/* @refresh reload */
import { render } from 'solid-js/web'
import { Route, Router } from "@solidjs/router";

import MainPage from "./pages/main/MainPage";
const PresentationPage = lazy(() => import("./pages/PresentationPage"));
const ArtworkPage = lazy(() => import("./pages/ArtworkPage"));

import { Shell } from "./shell/Shell";
import { NotFound } from "./pages/NotFound";
import { lazy } from "solid-js";

const root = document.getElementById('root')

render(() =>
    <Router root={Shell}>
        <Route path="/" component={MainPage} />
        <Route path="/presentation" component={PresentationPage} />
        <Route path="/artwork/:id" component={ArtworkPage} />
        <Route path="*404" component={NotFound} />
    </Router>
    , root!)
