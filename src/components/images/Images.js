import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Particles from "react-particles-js";
import Spinner from "../common/Spinner";
import ImageItem from "./ImageItem";
import { getImages } from "../../actions/imageActions";

const param = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: "#ffffff"
    },
    shape: {
      type: "circle",
      stroke: {
        width: 0,
        color: "#000000"
      },
      polygon: {
        nb_sides: 5
      },
      image: {
        src: "img/github.svg",
        width: 100,
        height: 100
      }
    },
    opacity: {
      value: 0.7936889701284338,
      random: false,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.1,
        sync: false
      }
    },
    size: {
      value: 4.008530152163807,
      random: true,
      anim: {
        enable: false,
        speed: 40,
        size_min: 0.1,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 272.58005034713887,
      color: "#ffffff",
      opacity: 0.19240944730386272,
      width: 1.603412060865523
    },
    move: {
      enable: true,
      speed: 4.810236182596568,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200
      }
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "repulse"
      },
      onclick: {
        enable: true,
        mode: "push"
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 400,
        line_linked: {
          opacity: 1
        }
      },
      bubble: {
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 8,
        speed: 3
      },
      repulse: {
        distance: 200,
        duration: 0.4
      },
      push: {
        particles_nb: 4
      },
      remove: {
        particles_nb: 2
      }
    }
  },
  retina_detect: true
};

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
