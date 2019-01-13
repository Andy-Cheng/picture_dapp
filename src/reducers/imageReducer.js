import {
  GET_IMAGES,
  GET_IMAGES_SUCCESS,
  GET_ALLIMAGES,
  GET_ALLIMAGES_SUCCESS,
  GET_IMAGE,
  SET_ERROR,
  UPLOAD_IMAGE,
  UPLOAD_IMAGE_SUCCESS,
  SIMILARITY
} from "../actions/types";

const initialState = {
  allImages: null,
  images: null,
  image: null,
  loading: false,
  error: null,
  similarity: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ALLIMAGES:
      return {
        ...state,
        loading: true,
        error: null
      };
    case GET_ALLIMAGES_SUCCESS:
      return {
        images: null,
        loading: false,
        allImages: action.payload,
        error: null,
        image: null
      };
    case GET_IMAGES:
      return {
        ...state,
        loading: true,
        error: null
      };
    case GET_IMAGES_SUCCESS:
      // const imagesByIndex = keyBy(state.images, 'index')
      // const updatedImages = action.payload.map((image) => {
      //   const updatedImage = { ...imagesByIndex[image.index], ...image }
      //   return updatedImage
      // })
      return {
        ...state,
        loading: false,
        images: action.payload,
        error: null,
        image: null
      };
    case GET_IMAGE:
      if (action.payload.fromAll) {
        return {
          ...state,
          loading: false,
          image: state.allImages ? state.allImages[action.payload.index] : null,
          error: null
        };
      } else {
        return {
          ...state,
          loading: false,
          image: state.images ? state.images[action.payload.index] : null,
          error: null
        };
      }
    case UPLOAD_IMAGE:
      return {
        ...state,
        loading: true,
        error: null
      };
    case UPLOAD_IMAGE_SUCCESS:
      return {
        ...state,
        images: [...state.images, action.payload],
        loading: false,
        error: null
      };
    case SET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case SIMILARITY:
      return {
        ...state,
        similarity: action.payload
      };
    default:
      return state;
  }
};
