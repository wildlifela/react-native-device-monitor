import React, {
  AppState,
  Component,
  DeviceEventEmitter,
  NetInfo,
  PropTypes,
  View,
} from 'react-native'

export default class DeviceMonitor extends Component {

  _lastViewport = null;

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

    NetInfo.addEventListener('change', this.onNetInfo)
    NetInfo.fetch().done((netInfo) => this.onNetInfo(netInfo))

    NetInfo.isConnected.addEventListener('change', this.onConnectivityChange)
    NetInfo.isConnected.fetch().done(this.onConnectivityChange)

    this._keyboardDidHide = DeviceEventEmitter.addListener('keyboardDidHide', () => this.onKeyboard(false))
    this._keyboardDidShow = DeviceEventEmitter.addListener('keyboardDidShow', (layout) => this.onKeyboard(true, layout))
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.onAppState)
    NetInfo.removeEventListener('change', this.onNetInfo)
    NetInfo.isConnected.removeEventListener('change', this.onConnectivityChange)
    this._keyboardDidHide.remove()
    this._keyboardDidShow.remove()
  }

  onAppState = (appState) => {
    this.props.onAppState(appState)
  };

  onConnectivityChange = (isConnected) => {
    this.props.onConnectivityChange(isConnected)
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
      this._viewport = viewport
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
