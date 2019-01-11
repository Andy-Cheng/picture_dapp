import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Tooltip, Card } from "antd";

import "./ImageItem.css";
import { textTruncate } from "../../utils/string";

const imageTextStyle = {
  position: "absolute",
  bottom: "0px",
  width: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  paddingLeft: "20px",
  paddingRight: "20px"
};

class ImageItem extends Component {
  static propTypes = {
    image: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = { textDisplay: "none" };
    this.setVisibility.bind(this);
  }

  setVisibility = visibility => e => {
    this.setState({ textDisplay: visibility });
  };
  render() {
    const {
      index,
      ipfsHash,
      title,
      description,
      tags,
      uploadedOn
    } = this.props.image;

    const altDescription = description || "無內文...";
    const flag = this.props.fromAll ? "all" : "personal";
    return (
      <div className="col-md-4">
        <div className="card mb-4 box-shadow">
          <Tooltip placement="topRight" title="點擊我">
            <Link to={`/images/${flag}/${index}`} className="card-link">
              <img
                className="card-img-top"
                src={`http://localhost:8080/ipfs/${ipfsHash}`}
                alt="Card"
                style={{ height: "auto", maxHeight: "500px", width: "100%" }}
                onMouseOver={this.setVisibility("")}
                onMouseLeave={this.setVisibility("none")}
              />
              <div
                style={{
                  ...imageTextStyle,
                  display: this.state.textDisplay,
                  boxShadow:
                    "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                }}
              >
                <h4 style={{ color: "white", fontWeight: "normal" }}>
                  {title}
                </h4>
              </div>
            </Link>
          </Tooltip>
        </div>
      </div>
    );
  }
}

export default ImageItem;
