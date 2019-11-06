import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  AppState,
  DeviceEventEmitter,
  Keyboard,
  NetInfo,
  View,
} from 'react-native'

export default class DeviceMonitor extends Component {

  _lastViewport = null;
  _hasReceivedConnection = false

  static propTypes = {
    children: PropTypes.node,
    onAppState: PropTypes.func,
    onConnectivityChange: PropTypes.func,
    onKeyboard: PropTypes.func,
    onNetInfo: PropTypes.func,
    onViewport: PropTypes.func,
  };

  static defaultProps = {
    onAppState: () => {},
    onConnectivityChange: () => {},
    onKeyboard: () => {},
    onNetInfo: () => {},
    onViewport: () => {},
  };

  componentDidMount() {
    AppState.addEventListener('change', this.onAppState)
    this.onAppState(AppState.currentState)

    NetInfo.addEventListener('connectionChange', this.onNetInfo)
    NetInfo.getConnectionInfo().done((netInfo) => this.onNetInfo(netInfo))

    NetInfo.isConnected.fetch().done((isConnected) => {
      this.onConnectivityChange(isConnected, { calledFromComponentDidMount: true })
    })
    NetInfo.isConnected.addEventListener('connectionChange', this.onConnectivityChange)

    this._keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => this.onKeyboard(false))
    this._keyboardDidShow = Keyboard.addListener('keyboardDidShow', (layout) => this.onKeyboard(true, layout))
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.onAppState)
    NetInfo.removeEventListener('connectionChange', this.onNetInfo)
    NetInfo.isConnected.removeEventListener('connectionChange', this.onConnectivityChange)
    this._keyboardDidHide.remove()
    this._keyboardDidShow.remove()
  }

  onAppState = (appState) => {
    this.props.onAppState(appState)
  };

  onConnectivityChange = (isConnected, options = {}) => {
    // On iOS, The fetch in componentDidMount resolves AFTER the callback from the 'change' event listener
    // resulting in incorrect status being reported
    if (!options.calledFromComponentDidMount || !this._hasReceivedConnection) this.props.onConnectivityChange(isConnected)
    this._hasReceivedConnection = true
  };

  onNetInfo = (netInfo) => {
    this.props.onNetInfo(netInfo)
  };

  onKeyboard = (status, layout) => {
    this.props.onKeyboard(status, layout)
  };

  onLayout = (e) => {
    let viewport = e.nativeEvent.layout
    let lastViewport = this._lastViewport
    if (lastViewport && (viewport.width !== lastViewport.width || viewport.height !== lastViewport.height)) {
      this._lastViewport = viewport
      this.props.onViewport(viewport)
    }
  };

  render() {
    return (
      <View
        style={{flex: 1}}
        onLayout={this.onLayout}>
        {this.props.children}
      </View>
    )
  }
}
