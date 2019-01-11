import React, { Component } from 'react'
import Webcam from 'react-webcam'
import { Col, Row, Button, Dropdown, Menu, Icon } from 'antd'

class Camera extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      screenshot: null,
      tab: 0,
      style: { filter: '' },
      name: '無',
    }
    this.onChangeFilter = this.onChangeFilter.bind(this)
  }
  onChangeFilter = (filter, name) => (e) => {
    console.log('filter', filter)
    console.log('e', e)
    this.setState({ style: { filter: filter }, name: name })
  }
  handleClick = () => {
    const screenshot = this.webcam.getScreenshot()
    this.setState({ screenshot })
    const bufferResult = Buffer(screenshot)
    console.log('bufferResult', bufferResult)
  }
  render() {
    const menu = (
      <Menu>
        <Menu.Item onClick={this.onChangeFilter('', '無')}>無</Menu.Item>
        <Menu.Item onClick={this.onChangeFilter('grayscale(100%)', '灰階')}>
          灰階
        </Menu.Item>
        <Menu.Item onClick={this.onChangeFilter('invert(100%)', '互補色')}>
          互補色
        </Menu.Item>
        <Menu.Item onClick={this.onChangeFilter('saturate(100%)', '飽和')}>
          飽和
        </Menu.Item>
        <Menu.Item onClick={this.onChangeFilter('sepia(100%)', '懷舊')}>
          懷舊
        </Menu.Item>
      </Menu>
    )
    return (
      <Row
        type="flex"
        justify="center"
        style={{ marginTop: '20px', marginBottom: '20px' }}
      >
        <Col xs={21} md={10}>
          <h3>相機</h3>
          <Webcam
            width={340}
            height={340}
            audio={false}
            style={this.state.style}
            ref={(node) => (this.webcam = node)}
          />
          <div className="controls" style={{ marginBottom: '10px' }}>
            <Button icon="camera" onClick={this.handleClick}>
              快門
            </Button>
          </div>
          <Dropdown overlay={menu} placement="bottomCenter">
            <a className="ant-dropdown-link">
              濾鏡模式 <Icon type="down" />
            </a>
          </Dropdown>
        </Col>
        <Col xs={21} md={10}>
          <h3>預覽相片</h3>
          <p>濾鏡： {this.state.name}</p>
          <div className="screenshots">
            {this.state.screenshot ? (
              <img
                src={this.state.screenshot}
                alt=""
                style={{ ...this.state.style, marginTop: '10px' }}
              />
            ) : null}
          </div>
        </Col>
      </Row>
    )
  }
}

export default Camera
