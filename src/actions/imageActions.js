import { keyBy } from 'lodash'
import { ipfs } from '../utils/ipfs'

import {
  GET_ALLIMAGES,
  GET_ALLIMAGES_SUCCESS,
  GET_IMAGES,
  GET_IMAGES_SUCCESS,
  GET_IMAGE,
  UPLOAD_IMAGE,
  UPLOAD_IMAGE_SUCCESS,
  SET_ERROR,
} from './types'

const allAllImagesFlag = 'ALL'
// Get all the images
export const getaAllImages = () => async (dispatch, getState) => {
  dispatch({ type: GET_ALLIMAGES })

  const web3State = getState().web3

  // Retrieve image state from local storage
  const localData = localStorage.getItem(allAllImagesFlag)
  console.log('localData', localData)
  const localImages = localData ? JSON.parse(localData) : []
  const imagesByIndex = keyBy(localImages, 'index')
  console.log('imagesByIndex', imagesByIndex)

  const images = []
  try {
    const Count = await web3State.contractInstance.getOwnersCount.call(
      web3State.account,
      {
        from: web3State.account,
      }
    )
    const ownersCount = Count.toNumber()
    let indexAll = -1
    for (let i = 0; i < ownersCount; ++i) {
      const count = await web3State.contractInstance.getImageCountByIndex.call(
        i,
        {
          from: web3State.account,
        }
      )
      const imageCount = count.toNumber()

      for (let index = 0; index < imageCount; index++) {
        indexAll += 1
        const imageResult = await web3State.contractInstance.getImageByIndex.call(
          i,
          index,
          {
            from: web3State.account,
          }
        )

        // Image for UI
        const image = {
          index: indexAll,
          ipfsHash: imageResult[0],
          title: imageResult[1],
          description: imageResult[2],
          tags: imageResult[3],
          uploadedOn: convertTimestampToString(imageResult[4]),
          owner: imageResult[5],
        }
        images.push(image)
      }
    }
    console.log('allindex', indexAll)
    // Save image state to local storage
    localStorage.setItem(allAllImagesFlag, JSON.stringify(images))

    dispatch({ type: GET_ALLIMAGES_SUCCESS, payload: images })
  } catch (error) {
    console.log('error', error)
    dispatch({ type: SET_ERROR, payload: error })
  }
}

// Get images that belong to a owner
export const getImages = () => async (dispatch, getState) => {
  dispatch({ type: GET_IMAGES })

  const web3State = getState().web3

  // Retrieve image state from local storage
  const localData = localStorage.getItem(web3State.account)
  console.log('localData', localData)
  const localImages = localData ? JSON.parse(localData) : []
  const imagesByIndex = keyBy(localImages, 'index')
  console.log('imagesByIndex', imagesByIndex)

  const images = []
  try {
    const count = await web3State.contractInstance.getImageCount.call(
      web3State.account,
      {
        from: web3State.account,
      }
    )
    const imageCount = count.toNumber()

    for (let index = 0; index < imageCount; index++) {
      const imageResult = await web3State.contractInstance.getImage.call(
        web3State.account,
        index,
        {
          from: web3State.account,
        }
      )

      // Image for UI
      const image = {
        ...imagesByIndex[index],
        index,
        ipfsHash: imageResult[0],
        title: imageResult[1],
        description: imageResult[2],
        tags: imageResult[3],
        uploadedOn: convertTimestampToString(imageResult[4]),
        owner: imageResult[5],
      }
      images.push(image)
    }

    // Save image state to local storage
    localStorage.setItem(web3State.account, JSON.stringify(images))

    dispatch({ type: GET_IMAGES_SUCCESS, payload: images })
  } catch (error) {
    console.log('error', error)
    dispatch({ type: SET_ERROR, payload: error })
  }
}

// upload an image
export const uploadImage = (buffer, title, description, tags) => async (
  dispatch,
  getState
) => {
  dispatch({ type: UPLOAD_IMAGE })

  // Add image to IPFS
  ipfs.files.add(buffer, async (error, result) => {
    if (error) {
      console.log('ERR', error)
      dispatch({
        type: SET_ERROR,
        payload: {
          error,
        },
      })
    } else {
      const ipfsHash = result[0].hash // base58 encoded multihash
      // Need to send ipfsHash to server for image processing
      ipfs.files.get(ipfsHash, (error, files) => {
        console.log('ipfsHash', ipfsHash)
        console.log('files', files)
      })

      const web3State = getState().web3
      const contractInstance = web3State.contractInstance
      try {
        // Success, upload IPFS and metadata to the blockchain
        const txReceipt = await contractInstance.uploadImage(
          ipfsHash,
          title,
          description,
          tags,
          {
            from: web3State.account,
          }
        )

        console.log('uploadImage tx receipt', txReceipt)

        const {
          blockHash,
          blockNumber,
          transactionHash,
          transactionIndex,
          cumulativeGasUsed,
          gasUsed,
        } = txReceipt.receipt

        // // Determine index based on length of images array; otherwise,
        // // would need to call contract to get length
        // const index = getState().image.images.length
        //   ? getState().image.images.length
        //   : 0

        const newImage = {
          ipfsHash,
          title,
          description,
          tags,
          uploadedOn: 'Pending',
          blockHash,
          blockNumber,
          transactionHash,
          transactionIndex,
          cumulativeGasUsed,
          gasUsed,
        }

        // Update persisted state in local storage
        const localData = localStorage.getItem(web3State.account)
        const localImages = localData ? JSON.parse(localData) : []
        localImages.push(newImage)
        localStorage.setItem(web3State.account, JSON.stringify(localImages))

        dispatch({
          type: UPLOAD_IMAGE_SUCCESS,
          payload: newImage,
        })
      } catch (error) {
        console.log('ERR', error)
        dispatch({
          type: SET_ERROR,
          payload: {
            error,
          },
        })
        throw error
      }
    }
  })
}

// Get image by index
export const getImage = (index, fromAll) => ({
  type: GET_IMAGE,
  payload: { index, fromAll },
})

const convertTimestampToString = (timestamp) => {
  let tempDate = timestamp.toNumber()
  return tempDate !== 0 ? new Date(tempDate * 1000).toString() : null
}
