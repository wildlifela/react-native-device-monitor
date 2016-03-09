## React Native Device Monitor
Basic Usage (assuming redux or similar)
```js
render() {
  return (
    <DeviceMonitor
      onAppState={this.props.actions.setAppState}
      onKeyboard={this.props.actions.setKeyboardStatus}
      onNetInfo={this.props.actions.setNetInfo}
      onViewport={this.props.actions.setViewport}
      >
      <RestOfTheApp />
    </DeviceMonitor>
  )
}
```
