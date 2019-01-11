import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Collapse, Col, Row } from "antd";

import "./ImageDetail.css";
import { getImage } from "../../actions/imageActions";
import { ipfs } from "../../utils/ipfs";

const Panel = Collapse.Panel;
const customPanelStyle = {
  background: "#f7f7f7",
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
  overflow: "hidden"
};

const ImageFrame = props => {
  return (
    <div>
      <div className="row  justify-content-center">
        <div className="col-md-10">
          <p>上傳於： {props.uploadedOn}</p>
          {props.ipfsHash ? (
            <img
              className="card "
              style={{
                height: "auto",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
                width: "50%"
              }}
              src={`https://ipfs.io/ipfs/${props.ipfsHash}`}
              alt={`${props.ipfsHash}`}
            />
          ) : (
            <img
              src="https://api.fnkr.net/testimg/333x180/?text=IPFS"
              className="card-img-top"
              alt="NA"
            />
          )}
          <br />
          <p>作者: {props.owner}</p>
        </div>
      </div>
      <div className="row  justify-content-center">
        <div
          className="col-md-10"
          style={{ textAlign: "center", marginTop: "4px" }}
        >
          <h3>{props.title}</h3>
          <div className="row  justify-content-center">
            <div className="col-md-10">
              <Collapse accordion bordered={false} defaultActiveKey={["1"]}>
                <Panel
                  header="關於此創作"
                  forceRender={true}
                  key="1"
                  style={customPanelStyle}
                >
                  <p style={{ textAlign: "left", wordWrap: "break-word" }}>
                    {props.description}
                  </p>
                </Panel>
              </Collapse>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

class ImageDetail extends Component {
  constructor(props) {
    super(props);
    this.goback = this.goback.bind(this);
  }
  componentDidMount() {
    if (this.props.match.params.flag === "all") {
      console.log("image index", this.props.match.params.index);
      this.props.getImage(this.props.match.params.index, true);
    } else {
      this.props.getImage(this.props.match.params.index, false);
    }
  }

  goback() {
    this.props.history.goBack();
  }

  render() {
    const image = this.props.image ? this.props.image : {};
    const { goback } = this;
    const { ipfsHash, title, description, uploadedOn, owner } = image;
    console.log("image", image);
    return (
      <div>
        <Row style={{ marginTop: "10px", marginLeft: "10px" }}>
          <Col span={2}>
            <button onClick={goback} type="button" class="btn btn-link">
              {" "}
              回前頁
            </button>
          </Col>
        </Row>
        <Row type="flex" justify="center" style={{ marginTop: "10px" }}>
          <Col md={10}>
            {ipfsHash ? (
              <img
                className="card "
                style={{
                  height: "auto",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: "80%"
                }}
                src={`http://localhost:8080/ipfs/${ipfsHash}`}
                alt={`${ipfsHash}`}
              />
            ) : (
              <img
                src="https://api.fnkr.net/testimg/333x180/?text=IPFS"
                className="card-img-top"
                alt="NA"
              />
            )}
          </Col>
          <Col md={10} style={{ padding: "20px" }}>
            <p>上傳於： {uploadedOn}</p>
            <p>作者: {owner}</p>
            <p>
              IPFS hash:
              <span style={{ marginLeft: "4px" }} />
              <a
                href={`http://localhost:8080/ipfs/${ipfsHash}`}
                style={{ color: "#5E90AF", wordBreak: "break-word" }}
                target="_blank"
              >
                {ipfsHash}
              </a>
            </p>
            <h3>{title}</h3>
            <Collapse accordion bordered={false} defaultActiveKey={["1"]}>
              <Panel
                header="關於此創作"
                forceRender={true}
                key="1"
                style={customPanelStyle}
              >
                <p style={{ textAlign: "left", wordWrap: "break-word" }}>
                  {description}
                </p>
              </Panel>
            </Collapse>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  image: state.image.image
});

export default connect(
  mapStateToProps,
  { getImage }
)(ImageDetail);
