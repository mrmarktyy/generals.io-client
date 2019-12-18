import React, { Component } from 'react';
import classNames from 'classnames';

import Modal from '../../util/Modal';
import './help.css';

class Help extends Component {
  constructor(props) {
    super(props);

    this.state = {selected: 0};
  }

  handleClick({selected}) {
    this.setState({selected});
  }

  render() {
    const { selected } = this.state;
    let tabContent;
    if (selected === 0) {
      tabContent = (
        <div className="tab-content">
          <h3>什么是将军棋？</h3>
          <p>将军棋是一款多人同时在线，即时策略类的战争棋牌游戏。它集合娱乐、策略、经营、团队，竞技于一体。</p>
          <h3>游戏目标</h3>
          <p>游戏中，你的目标是通过不断扩张自己的领土，招募更多部队，探索敌人的<img className="general" src="/images/crown.png" alt="crown" />将军，并率领部队占领。</p>
          <h3>时间</h3>
          <p>将军棋有两个时间概念：<strong>回合</strong> 和 <strong>轮</strong>。</p>
          <p>游戏中，每1个<strong>回合</strong>等于现实中1秒，每25个回合算1轮。在游戏界面的左上角显示当前的回合数，部队每<strong>半回合</strong>可以移动1次(即是，每1个回合可以移动2次)。</p>
          <p>将军或占领的城市每1个回合生产1个单位部队，其他占领的领土每1轮（25个回合）生产1个单位部队。</p>
          <h3>单位</h3>
          <p>在移动部队过程中，你所占领的领土必须至少留下1个单位部队。也就是说，如果你要占领一个敌人的领土， 至少要比敌人的领土多2个单位（1个用来消灭敌人领土上的单位，1个用来占领敌人的领土，另1个必须留在之前的领土）。</p>
          <p>占领没有单位的领土只需要1个单位。中立领土每1轮不会增加单位。</p>
          <h3>移动</h3>
          <p>当每半回合所有玩家移动完毕后，移动优先级顺序将发生交替（例如：3名玩家A,B,C 本次移动完毕后，下一次移动顺序变为B,C,A,再下一次移动顺序为C,B,A，以此类推)。</p>
        </div>
      );
    } else if (selected === 1) {
      tabContent = (
        <div className="tab-content">
          <h3>功能型建筑</h3>
          <h5>一、进攻型</h5>
          <p>
            <img className="building" src="/images/sword.png" alt="sword" />
            占领该建筑时，部队数量瞬间增加1.5-2倍（该效益只会作用一次）。
          </p>
          <h5>二、防御型</h5>
          <p>
            <img className="building" src="/images/shield.png" alt="shield" />
            占领后，自己的将军以及所占领的城市防御大幅增加，对手需要消耗2个单位才能消灭自己城市里的1个单位（但不包括该建筑本身）。
          </p>
          <h5>三. 视野型</h5>
          <p>
            <img className="building" src="/images/eye.png" alt="eye" />
            占领后，可以获得对手将军以及将军周围一格的视野。
          </p>
        </div>
      );
    }

    return (
      <Modal className="main-help-modal" centerOnly
        onClose={this.props.close} title="帮助">
        <div className="tabs border">
          <div className={classNames('btn', {selected: selected === 0})} onClick={() => this.handleClick({selected: 0})}>简介</div>
          <div className={classNames('btn', {selected: selected === 1})} onClick={() => this.handleClick({selected: 1})}>建筑</div>
        </div>
        {tabContent}
        <div className="modal-footer">
          <div className="btn inverted" onClick={this.props.close}>关闭</div>
        </div>
      </Modal>
    );
  }
}

export default Help;
