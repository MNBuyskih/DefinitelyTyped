// Type definitions for react-navigation 1.0
// Project: https://github.com/react-community/react-navigation#readme
// Definitions by: MNB <https://github.com/MNBuyskih>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import {ComponentClass} from 'react';
import {Animated, ViewStyle, ImageStyle, TextStyle} from 'react-native';

export function StackNavigator<P, S>(routeConfigMap: NavigationRouteConfigMap, stackConfig?: StackNavigatorConfig): NavigationContainer<NavigationProps<P, S>, NavigationContainerState<S>>;
export function TabNavigator<P, S>(routeConfigs: NavigationRouteConfigMap, config?: TabNavigatorConfig): NavigationContainer<NavigationProps<P, S>, NavigationContainerState<S>>;

export interface NavigationContainer<P, S> extends React.Component<P, S> {
    new (props?: P, context?: any): React.Component<P, S>
}

export type NavigationProps<P, T> = P & {
    navigation: NavigationScreenProp<T, NavigationAction>,
    onNavigationStateChange?: (newState: NavigationState, oldState: NavigationState) => void,
};

export type NavigationContainerState<S> = S & {
    nav: NavigationState | null,
};

export interface NavigationRouteConfigMap {
    [routeName: string]: NavigationRouteConfig<any>,
}

export interface StackNavigatorConfig extends NavigationContainerConfig, NavigationStackViewConfig, NavigationStackRouterConfig {
}

export interface TabNavigatorConfig extends NavigationTabRouterConfig, TabViewConfig, NavigationContainerConfig {
}

export interface NavigationTabRouterConfig {
    initialRouteName?: string,
    paths?: NavigationPathsConfig,
    navigationOptions?: NavigationScreenConfig<NavigationTabScreenOptions>,
    order?: Array<string>, // todo: type these as the real route names rather than 'string'

    // Does the back button cause the router to switch to the initial tab
    backBehavior?: 'none' | 'initialRoute', // defaults `initialRoute`
}

export interface TabViewConfig {
    tabBarComponent?: ComponentClass<any>;
    tabBarPosition?: 'top' | 'bottom';
    tabBarOptions?: {};
    swipeEnabled?: boolean;
    animationEnabled?: boolean;
    lazyLoad?: boolean;
}

export interface NavigationTabScreenOptions extends NavigationScreenOptions {
    tabBarIcon?: JSX.Element | ((options: { tintColor: string | null, focused: boolean }) => JSX.Element | null),
    tabBarLabel?: string,
    tabBarVisible?: boolean,
}

export interface NavigationContainerConfig {
    containerOptions?: NavigationContainerOptions,
}


export interface NavigationContainerOptions {
    // This is used to extract the path from the URI passed to the app for a deep link
    URIPrefix?: string,
}

export type NavigationRouteConfig<T> = T & {
    navigationOptions?: NavigationScreenConfig<any>,
    path?: string,
};

export type NavigationScreenConfig<Options> = Options | NavigationScreenConfigProps & {
    navigationOptions: NavigationScreenProp<NavigationRoute, NavigationAction>
};

export interface NavigationScreenConfigProps {
    navigation: NavigationScreenProp<NavigationRoute, NavigationAction>,
    screenProps: Object,
}

export interface NavigationStackViewConfig {
    mode?: 'card' | 'modal',
    headerMode?: HeaderMode,
    headerComponent?: ComponentClass<HeaderProps>,
    cardStyle?: Style,
    onTransitionStart?: () => void,
    onTransitionEnd?: () => void
}

export interface NavigationStackRouterConfig {
    initialRouteName?: string,
    initialRouteParams?: NavigationParams,
    paths?: NavigationPathsConfig,
    navigationOptions?: NavigationScreenConfig<NavigationStackScreenOptions>,
}

export interface NavigationScreenProp<S, A> {
    state: S,
    dispatch: NavigationDispatch<A>,
    goBack: (routeKey?: string | null) => boolean,
    navigate: (routeName: string, params?: NavigationParams, action?: NavigationAction) => boolean,
    setParams: (newParams: NavigationParams) => boolean,
}

export interface NavigationRoute extends NavigationLeafRoute, NavigationStateRoute {

}

export interface NavigationAction extends NavigationInitAction, NavigationStackAction, NavigationTabAction {

}

export type HeaderMode = 'float' | 'screen' | 'none';

export interface HeaderProps extends NavigationSceneRendererProps {
    mode: HeaderMode,
    router: NavigationRouter<NavigationState, NavigationAction, NavigationStackScreenOptions>,
    getScreenDetails: (scene: NavigationScene) => NavigationScreenDetails<NavigationStackScreenOptions>,
}

type Style = ViewStyle | ImageStyle | TextStyle;

export interface NavigationParams {
    [key: string]: string,
}

export interface NavigationPathsConfig {
    [routeName: string]: string,
}

export interface NavigationStackScreenOptions extends NavigationScreenOptions {
    headerTitle?: string | JSX.Element,
    headerTitleStyle?: Style,
    headerLeft?: string | JSX.Element,
    headerBackTitle?: string,
    headerRight?: string | JSX.Element,
    headerStyle?: Style,
    headerVisible?: boolean,
    gesturesEnabled?: boolean,
}

export interface NavigationDispatch<A> {
    (action: A): boolean;
}

export interface NavigationLeafRoute {
    /**
     * React's key used by some navigators. No need to specify these manually,
     * they will be defined by the router.
     */
    key: string,
    /**
     * For example 'Home'.
     * This is used as a key in a route config when creating a navigator.
     */
    routeName: string,
    /**
     * Path is an advanced feature used for deep linking and on the web.
     */
    path?: string,
    /**
     * Params passed to this route when navigating to it,
     * e.g. `{ car_id: 123 }` in a route that displays a car.
     */
    params?: NavigationParams,
}

export interface NavigationStateRoute extends NavigationLeafRoute {
    index: number,
    routes: Array<NavigationRoute>,
}

export interface NavigationStackAction extends NavigationInitAction, NavigationNavigateAction, NavigationBackAction, NavigationSetParamsAction, NavigationResetAction {

}

export interface NavigationTabAction extends NavigationInitAction, NavigationNavigateAction, NavigationBackAction {

}

export interface NavigationSceneRendererProps extends NavigationTransitionProps {

}

export interface NavigationRouter<State, Action, Options> {
    /**
     * The reducer that outputs the new navigation state for a given action, with
     * an optional previous state. When the action is considered handled but the
     * state is unchanged, the output state is null.
     */
    getStateForAction: (action: Action, lastState: State | null) => State | null,

    /**
     * Maps a URI-like string to an action. This can be mapped to a state
     * using `getStateForAction`.
     */
    getActionForPathAndParams: (path: string, params?: NavigationParams) => Action | null,

    getPathAndParamsForState: (state: State) => { path: string, params?: NavigationParams },

    getComponentForRouteName: (routeName: string) => NavigationComponent,

    getComponentForState: (state: State) => NavigationComponent,

    /**
     * Gets the screen navigation options for a given screen.
     *
     * For example, we could get the config for the 'Foo' screen when the
     * `navigation.state` is:
     *
     *  {routeName: 'Foo', key: '123'}
     */
    getScreenOptions: NavigationScreenOptionsGetter<Options, Action>
}

/**
 * NavigationState is a tree of routes for a single navigator, where each child
 * route may either be a NavigationScreenRoute or a NavigationRouterRoute.
 * NavigationScreenRoute represents a leaf screen, while the
 * NavigationRouterRoute represents the state of a child navigator.
 *
 * NOTE: NavigationState is a state tree local to a single navigator and
 * its child navigators (via the routes field).
 * If we're in navigator nested deep inside the app, the state will only be the
 * state for that navigator.
 * The state for the root navigator of our app represents the whole navigation
 * state for the whole app.
 */
export interface NavigationState {
    /**
     * Index refers to the active child route in the routes array.
     */
    index: number,
    routes: Array<NavigationRoute>,
}

export interface NavigationProp<S, A> {
    state: S,
    dispatch: NavigationDispatch<A>,
}

export interface NavigationScene {
    index: number,
    isActive: boolean,
    isStale: boolean,
    key: string,
    route: NavigationRoute,
}

export interface NavigationScreenDetails<T> {
    options: T,
    state: NavigationRoute,
    navigation: NavigationScreenProp<NavigationRoute, NavigationAction>,
}

export interface NavigationScreenOptions {
    title?: string,
}

export interface NavigationInitAction {
    type: string,
    params?: NavigationParams,
}

export interface NavigationNavigateAction {
    type: string,
    routeName: string,
    params?: NavigationParams,

    // The action to run inside the sub-router
    action?: NavigationNavigateAction,
}

export interface NavigationBackAction {
    type: string,
    key?: string,
}

export interface NavigationSetParamsAction {
    type: string,

    // The key of the route where the params should be set
    key?: string,

    // The new params to merge into the existing route params
    params?: NavigationParams,
}

export interface NavigationInitAction {
    type: string,
    params?: NavigationParams,
}

export interface NavigationResetAction {
    type: string,
    index: number,
    key?: string,
    actions: Array<NavigationNavigateAction>,
}

export interface NavigationUriAction {
    type: string,
    uri: string,
}

export type NavigationTransitionProps = {
    // The layout of the screen container
    layout: NavigationLayout,

    // The destination navigation state of the transition
    navigation: NavigationScreenProp<NavigationState, NavigationAction>,

    // The progressive index of the transitioner's navigation state.
    position: Animated.Value,

    // The value that represents the progress of the transition when navigation
    // state changes from one to another. Its numberic value will range from 0
    // to 1.
    //  progress.__getAnimatedValue() < 1 : transtion is happening.
    //  progress.__getAnimatedValue() == 1 : transtion completes.
    progress: Animated.Value,

    // All the scenes of the transitioner.
    scenes: Array<NavigationScene>,

    // The active scene, corresponding to the route at
    // `navigation.state.routes[navigation.state.index]`. When rendering
    // NavigationSceneRendererPropsIndex, the scene does not refer to the active
    // scene, but instead the scene that is being rendered. The index always
    // is the index of the scene
    scene: NavigationScene,
    index: number,
};

export type NavigationComponent = NavigationScreenComponent<any, any> | NavigationNavigator<any, any, any, any>;

export interface NavigationScreenOptionsGetter<Options, Action> {
    (navigation: NavigationScreenProp<NavigationRoute, Action>, screenProps?: {}): Options;
}

export interface NavigationLayout {
    height: Animated.Value,
    initHeight: number,
    initWidth: number,
    isMeasured: boolean,
    width: Animated.Value,
}

export interface NavigationScreenComponent<T, Options> extends ComponentClass<T> {
    navigationOptions?: NavigationScreenConfig<Options>
}

export interface NavigationNavigator<T, State, Action, Options> extends ComponentClass<T> {
    router?: NavigationRouter<State, Action, Options>,
    navigationOptions?: NavigationScreenConfig<Options>,
}
