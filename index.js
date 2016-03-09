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
    onKeyboard: PropTypes.func,
    onNetInfo: PropTypes.func,
    onViewport: PropTypes.func,
  };

  defaultProps = {
    onAppState: () => {},
    onKeyboard: () => {},
    onNetInfo: () => {},
    onViewport: () => {},
  };

  componentDidMount() {
    console.log('$props', this.props)

    AppState.addEventListener('change', this.onAppState)
    this.onAppState(AppState.currentState)

    NetInfo.addEventListener('change', this.onNetInfo)
    NetInfo.fetch().done((netInfo) => this.onNetInfo(netInfo))

    this._keyboardDidHide = DeviceEventEmitter.addListener('keyboardDidHide', () => this.onKeyboard(false))
    this._keyboardDidShow = DeviceEventEmitter.addListener('keyboardDidShow', (layout) => this.onKeyboard(true, layout))
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.onAppState)

    NetInfo.isConnected.removeEventListener('change', this.onNetInfo)

    this._keyboardDidHide.remove()
    this._keyboardDidShow.remove()
  }

  onAppState = (appState) => {
    this.props.onAppState(appState)
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
