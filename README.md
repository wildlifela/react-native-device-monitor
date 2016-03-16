## React Native Device Monitor
Monitor device state in a react-native app without boilerplate.

### Basic Usage
(assuming redux or similar)
```js
render() {
  return (
    <DeviceMonitor
      onAppState={this.props.actions.setAppState}
      onKeyboard={this.props.actions.setKeyboardStatus}
      onNetInfo={this.props.actions.setNetInfo}
      onConnectivityChange={this.props.actions.setConnectivity}
      onViewport={this.props.actions.setViewport}
      >
      <RestOfTheApp />
    </DeviceMonitor>
  )
}
```

### API
**onAppState** function (appState)  
* appState: enum('active', 'background', 'inactive')

**onKeyboard** function (status, layout)  
* status: bool
* layout: {width, height}

**onNetInfo** function (reach)  
* reach: enum('none', 'wifi', 'cell', 'unknown')

**onConnectivityChange** function (status)
* status: bool

**onViewport** function (viewport)
* viewport: {width, height}

Exact response shape may depend on your version of react-native. Return values are unmodified, as such it can be helpful to reference the [official docs](http://facebook.github.io/react-native/docs/getting-started.html).
