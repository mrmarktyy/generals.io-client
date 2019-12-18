import React, { Component } from 'react';
import PubSub from 'pubsub-js';

import './main-top-right.css';
import Login from './auth/Login';
import Register from './auth/Register';
import Forgot from './auth/Forgot';
import ChangePassword from './auth/ChangePassword';

class MainTopRight extends Component {
  constructor(props) {
    super(props);

    this.user = props.user;
    this.connector = props.connector;
    this.state = this.getInitialState();

    this.subscribes = [
      PubSub.subscribe('modal:login', () => this.login()),
      PubSub.subscribe('modal:user', () => this.userPanel())
    ];
  }

  componentWillUnmount() {
    this.subscribes.forEach(subscribe => {
      PubSub.unsubscribe(subscribe);
    });
  }

  getInitialState() {
    return {
      login: false,
      register: false,
      leaderboard: false,
      user: false,
      password: false,
      forgot: false
    };
  }

  close() {
    this.setState(this.getInitialState());
  }

  login() {
    this.close();
    this.setState({login: true});
  }

  logout() {
    this.user.logout();
    this.close();
  }

  change() {
    this.close();
    this.setState({password: true});
  }

  register() {
    this.close();
    this.setState({register: true});
  }

  forgot() {
    this.close();
    this.setState({forgot: true});
  }

  leaderboard() {
    this.close();
    this.setState({leaderboard: true});
  }

  userPanel() {
    this.close();
    this.setState({user: true});
  }

  systemModal() {
    PubSub.publish('system:modal', {
      title: '将军棋正式版 震撼上线',
      content: (
        <div>
          <img className="general" src="/images/logo.jpg" alt="crown" />
          <p className="modal-message">
            将军棋正式版v1.1.0正式上线，新的征程已经打开。
          </p>
          <p className="modal-message">
            同时，与大家一起分享将军棋未来的更新计划，我们希望将军棋的每一次进步都有你的陪伴。
          </p>
          <p className="modal-message">
            1) 增加单机模式与机器人切磋，提高技艺。
          </p>
          <p className="modal-message">
            2) 增加3类功能型建筑，让对决变得更有变数更多乐趣。
          </p>
          <p className="modal-message">
            3) 增加地图编辑器，让全服的玩家都可以玩到你设计的地图。
          </p>
          <p className="modal-message">
            4) 更多神秘更新...
          </p>
          <p className="modal-message">
            5) 你有什么想法也可以告诉我们, 点击下面链接，即刻加入组织  (O^~^O)
          </p>
        </div>
      )
    });
  }

  render() {
    const login = <Login connector={this.connector} close={this.close.bind(this)} forgot={this.forgot.bind(this)} register={this.register.bind(this)} />;
    const register = <Register connector={this.connector} close={this.close.bind(this)} login={this.login.bind(this)} />;
    const forgot = <Forgot connector={this.connector} close={this.close.bind(this)} />
    const password = <ChangePassword connector={this.connector} close={this.close.bind(this)} />
    return (
      <div className="main-top main-top-right">
        {this.state.login && login}
        {this.state.forgot && forgot}
        {this.state.register && register}
        {this.state.password && password}
        <div className="btn round" onClick={this.userPanel.bind(this)}>
          <span className="icon-user center"></span>
        </div>
        <div className="btn round" onClick={this.leaderboard.bind(this)}>
          <img className="center leaderboard" src="/images/rank.png" alt="leaderboard" />
        </div>
        <div className="btn round" onClick={this.systemModal.bind(this)}>
          <span className="icon-info center"></span>
        </div>
      </div>
    );
  }
}

export default MainTopRight;
