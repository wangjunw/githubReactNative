import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
export default class BaseItem extends Component {
  static propTypes = {
    projectModel: PropTypes.object,
    onSelect: PropTypes.func,
    onFavorite: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      isFavorite: this.props.projectModel.isFavorite,
    };
  }

  // componentWillReceiveProps更新为getDerivedStateFromProps
  static getDerivedStateFromProps(nextProps, prevState) {
    const isFavorite = nextProps.projectModel.isFavorite;
    if (prevState.isFavorite !== isFavorite) {
      return {
        isFavorite,
      };
    }
    return null;
  }
  // 收藏按钮
  _favoriteIcon() {
    return (
      <TouchableOpacity
        style={{padding: 6}}
        onPress={() => {
          this.onPressFavorite();
        }}>
        <FontAwesome
          name={this.state.isFavorite ? 'star' : 'star-o'}
          size={26}
          style={{color: '#678'}}
        />
      </TouchableOpacity>
    );
  }
  onPressFavorite() {
    this.setFavoriteState(!this.state.isFavorite);
    this.props.onFavorite(this.props.projectModel, !this.state.isFavorite);
  }
  setFavoriteState(isFavorite) {
    this.props.projectModel.isFavorite = isFavorite;
    this.setState({
      isFavorite,
    });
  }
}
