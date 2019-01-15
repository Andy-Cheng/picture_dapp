import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Spinner from "../common/Spinner";
import ImageItem from "./ImageItem";
import { getImages } from "../../actions/imageActions";

class Images extends Component {
  static propTypes = {
    getImages: PropTypes.func.isRequired,
    image: PropTypes.object.isRequired
  };

  componentDidMount = () => {
    this.props.getImages();
  };

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.image.images !== nextProps.image.images;
  }

  render() {
    let { images, loading } = this.props.image;
    let imageItems;

    if (images === null || loading) {
      imageItems = <Spinner />;
    } else {
      if (images.length > 0) {
        imageItems = images.map(image => (
          <ImageItem key={image.index} fromAll={false} image={image} />
        ));
      } else {
        imageItems = <h4>快來上傳你的第一份作品吧</h4>;
      }
    }

    return (
      <div style={{ width: "100%" }}>
        <section
          className="jumbotron text-center"
          style={{
            backgroundColor: "#17182f",
            color: "white",
            borderRadius: 0
          }}
        >
          <div>
            <h style={{ color: "#D3D3D3" }}>
              上傳圖片至星際檔案系統 圖片的hash將永久存於以太鍊
            </h>
            <div style={{ margin: "10px" }} />
            <p>
              您的 Metamask 帳號
              <div style={{ margin: "10px" }} />
              <mark style={{ wordWrap: "break-word" }}>
                {this.props.web3.account || "Not Connected"}
              </mark>
            </p>
            <Link to="/uploadimage" className="btn btn-primary my-2">
              上傳圖片
            </Link>
          </div>
        </section>
        <div className="container" style={{ marginTop: "10px" }}>
          <div className="row">{imageItems}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  web3: state.web3,
  image: state.image
});

export default connect(
  mapStateToProps,
  { getImages }
)(Images);
