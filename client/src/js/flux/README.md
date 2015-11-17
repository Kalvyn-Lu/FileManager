# Fluxy stuf

This library of fluxy type stuff exports two functions: `createAction` and `createStore`.

## Actions

`createAction` creates a listenable action.

`createAction([fn])` takes an optional function `fn` that is called when the action event is emitted, before any listeners are called. Any arguments passed to the action emit function, are passed to `fn`. If the return value of `fn` is a Promise, registered listeners are called when the Promise is resolved. The value that the Promise resolved to is passed to all registered listeners. If the return value of `fn` is not a Promise, it is passed to all registered listeners as–is. The return values of listeners are ignored.

If `fn` is not provided, the first argument passed to the action emit function is passed to all registered listeners, and the Promise that is returned from the action event emit will resolve to this value as well.

If `fn` is provided, listeners are executed in a Promise callback, which is strictly not synchronous. If `fn` is *not* provided, listeners *are* executed synchronously.

This function returns a listenable action with the following interface:

- **The returned action itself** is a function that can be called to emit the action event (optionally with parameters). This function returns a Promise that is resolved after all registered listeners have been executed.
- `action.listen([resolveCallback], [rejectCallback])`: Registers a listener. At least one of `resolveCallback` and `rejectCallback` must be provided. On emit, the `fn` action function is executed. If the return value is a Promise, either `resolveCallback` or `rejectCallback` is called with the Promise’s value, depending on the Promise’s state. Returns a function that can be called to unregister the listeners.
- `action.listenWith(callback)`: Returns a mixin for React components that calls the provided callback on action emit. `callback` can be either a function or a string; if the latter, it is interpreted as a property key for a function on the React component. The callback is executed with the React component as `this`.

## Stores

`createStore` creates a new immutable store.

`createStore([initialValue])` takes an optional parameter `initialValue` as the initial value of the store. The value must be an object, and does not need to be immutable; its value is passed to `immutable.fromJS()` before using it as store data.

This function returns a store object with the following properties and methods:

- `store.current`: Gets the current value of the store as an immutable.Map.
- `store.cursor([keyOrPath])`: Returns a cursor that can be used to modify the store’s value. `keyOrPath` is an optional string or array of strings, and specifies a subpath within the store.
- `store.listen(callback)`: Registers a listener that is called when the store’s data is updated. Returns a function that unregisters the listener when called. On update, the listener is called with three parameters:
    - `store`: an immutable.Map, the new store value;
    - `oldStore`: an immutable.Map, the store value before the update;
    - `changedPath`: an array of strings, the subpath that was updated.
- `store.listenOn(keyOrPath, callback)`: Registers a listener that is called when the store’s data is updated at or below the subpath specified with `keyOrPath`. `keyOrPath` is a string or array of strings; if it is undefined or an empty array, a global listener is registered instead, as if `store.listen(callback)` was called. Returns a function that unregisters the listener when called. On update, the listener is called with three parameters:
    - `subStore`: an immutable.Map, the new store value at the given subpath;
    - `oldSubStore`: an immutable.Map, the store value before the update at the given subpath;
    - `changedSubPath`: an array of strings, the subpath that was updated below the subpath specified in `listenOn()`.
- `store.public`: An object that represents the store’s public API. This object can be exported from a module as its public–facing interface.

The store’s public API is an object with the following properties and methods:

- `public.current`: As `store.current`.
- `public.listen(callback)`: As `store.listen`.
- `public.listenOn(keyOrPath, callback)`: As `store.listenOn`.
- `public.connectTo([keyOrPath], stateName)`: Returns a mixin for React components that updates the component’s state through `this.setViewState()`, if available, or `this.setState()` otherwise. It will set `stateName` to the new value of the store. `keyOrPath` is an optional string or array of strings indicating the subpath to listen on.
