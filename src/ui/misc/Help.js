import React, { Component } from 'react';

import Modal from '../../util/Modal';
import './help.css';

class Help extends Component {
  render() {
    return (
      <Modal className="main-help-modal" centerOnly
        onClose={this.props.close} title="帮助">
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
        <div className="modal-footer">
          <div className="btn inverted" onClick={this.props.close}>关闭</div>
        </div>
      </Modal>
    );
  }
}

export default Help;
