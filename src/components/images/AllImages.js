import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Row, Col, Input } from "antd";
import Spinner from "../common/Spinner";
import ImageItem from "./ImageItem";
import { getaAllImages } from "../../actions/imageActions";
import backgroundImage from "./back1.jpg";

const Search = Input.Search;

class AllImages extends Component {
  static propTypes = {
    getaAllImages: PropTypes.func.isRequired,
    image: PropTypes.object.isRequired
  };

  componentDidMount = () => {
    this.props.getaAllImages();
  };

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.image.allImages !== nextProps.image.allImages;
  }

  render() {
    let { allImages, loading } = this.props.image;
    console.log("allImages", allImages);

    let imageItems;

    if (allImages === null || loading) {
      imageItems = <Spinner />;
    } else {
      if (allImages.length > 0) {
        imageItems = allImages.map(image => (
          <ImageItem key={image.index} fromAll={true} image={image} />
        ));
      } else {
        imageItems = <h4>目前沒人上傳作品喔</h4>;
      }
    }

    return (
      <div style={{ width: "100%" }}>
        <section
          className="jumbotron text-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            borderRadius: 0,
            height: "300px",
            color: "white",
            backgroundSize: "100% auto ",
            opacity: 0.85
          }}
        >
          <Row justify="center" type="flex">
            <Col xs={16} md={10}>
              <h1 style={{ color: "white" }}>Decentralized Gallery</h1>
              <Search
                placeholder="搜尋作品..."
                onSearch={value => console.log(value)}
                enterButton
                size="large"
              />
            </Col>
          </Row>
          <Row justify="center" type="flex">
            <Col xs={16} md={10} />
          </Row>
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
  { getaAllImages }
)(AllImages);
