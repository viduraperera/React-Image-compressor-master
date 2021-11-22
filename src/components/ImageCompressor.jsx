import React from "react";

import imageCompression from "browser-image-compression";

import Card from "react-bootstrap/Card";

class imageCompressor extends React.Component {
  constructor() {
    super();
    this.state = {
      compressedLink:
        "https://testersdock.com/wp-content/uploads/2017/09/file-upload-1280x640.png",
      originalImage: "",
      originalLink: "",
      clicked: false,
      uploadImage: false
    };
  }

  handle = e => {
    const imageFile = e.target.files[0];
    this.setState({
      originalLink: URL.createObjectURL(imageFile),
      originalImage: imageFile,
      outputFileName: imageFile.name,
      uploadImage: true
    });
  };

  changeValue = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  click = async e => {
    const ORIGINAL_IMAGE = this.state.originalImage;
    e.preventDefault();

    const imageSize = (ORIGINAL_IMAGE.size / (1024 * 1024)).toFixed(1);

    const maxSize = 150 / 1024; // max size allowed

    const minSize = 100 / 1024; // min size possible (after adjustment)

    const compressionFactor = 0.25; // by how much the image size is to be reduced

    const adjustedImageSize = Math.min(imageSize * compressionFactor, maxSize);

    const compressedImageSize = Math.max(adjustedImageSize, minSize);

    const options = {
      maxSizeMB: compressedImageSize
    };

    // if (options.maxSizeMB >= ORIGINAL_IMAGE.size / 1024) {
    //   alert("add a bigger image");
    //   return 0;
    // }

    try {
      const output = await imageCompression(ORIGINAL_IMAGE, options);
      const downloadLink = URL.createObjectURL(output);
      this.setState({
        compressedLink: downloadLink
      });
    } catch (error) {
      console.log(error);
    }

    this.setState({ clicked: true });
    return 1;
  };

  render() {
    return (
      <div className="m-5">
        <div className="row mt-5">
          <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
            {this.state.uploadImage ? (
              <Card.Img
                className="ht"
                variant="top"
                src={this.state.originalLink}
              ></Card.Img>
            ) : (
              <Card.Img
                className="ht"
                variant="top"
                src="https://testersdock.com/wp-content/uploads/2017/09/file-upload-1280x640.png"
              ></Card.Img>
            )}
            <div className="d-flex justify-content-center">
              <input
                type="file"
                accept="image/*"
                className="mt-2 btn btn-dark w-75"
                onChange={e => this.handle(e)}
              />
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-12 mb-5 mt-5 col-sm-12 d-flex justify-content-center align-items-baseline">
            <br />
            {this.state.outputFileName ? (
              <button
                type="button"
                className=" btn btn-dark"
                onClick={e => this.click(e)}
              >
                Compress
              </button>
            ) : (
              <></>
            )}
          </div>

          <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 mt-3">
            <Card.Img variant="top" src={this.state.compressedLink}></Card.Img>
            {this.state.clicked ? (
              <div className="d-flex justify-content-center">
                <a
                  href={this.state.compressedLink}
                  download={this.state.outputFileName}
                  className="mt-2 btn btn-dark w-75"
                >
                  Download
                </a>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default imageCompressor;
