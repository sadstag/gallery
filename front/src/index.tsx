/* @refresh reload */
import { Route, Router } from "@solidjs/router";
import { render } from "solid-js/web";

import { MainPage } from "./pages/main/MainPage";
const PresentationPage = lazy(() => import("./pages/PresentationPage"));
const ArtworkPage = lazy(() => import("./pages/artwork"));

import { lazy } from "solid-js";
import { NotFound } from "./pages/NotFound";
import { Shell } from "./shell/Shell";

const root = document.getElementById("root");

if (root) {
	render(
		() => (
			<Router root={Shell}>
				<Route path="/" component={MainPage} />
				<Route path="/presentation" component={PresentationPage} />
				<Route path="/artwork/:id" component={ArtworkPage} />
				<Route path="*404" component={NotFound} />
			</Router>
		),
		root,
	)

} else {
	render(() => <p>No root element defined !</p>, document.body)
}

