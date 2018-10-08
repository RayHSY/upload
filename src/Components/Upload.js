import React, { Component } from 'react';

const chunkSize = 1 * 1024 * 1024

class Upload extends Component {

  constructor (props) {
    super(props)

    this.fileList = []
  }

  handleClick = (e) => {
    e.preventDefault()
    this.refs.inputRef.click()
  }

  sliceFile = (file, chunkSize = chunkSize) => {
    console.log(file)
    const chunkFiles = [];
    const len = Math.ceil(file.size / chunkSize);
    for (let i = 0; i < len; i++) {
      // let fileObj = {
      //   lastModified: file.lastModified,
      //   lastModifiedDate: file.lastModifiedDate,
      //   name: file.name,
      //   type: file.type,
      //   size: chunkSize,
      //   chunkId: `${file.uid}-${i}`,
      //   uid: file.uid,
      // };

      let from = i * chunkSize
      let to = (i + 1) * chunkSize

      if (i === len - 1) {
        to = file.size
      }

      let fileBlob = file.slice(from, to, file.type)
      let fileObj = new File([fileBlob], file.webkitRelativePath, {
        type: file.type,
        lastModified: file.lastModified,
      })

      chunkFiles.push(fileObj);
    }

    return chunkFiles
  }

  handleChange = (e) => {
    const files = e.target.files
    console.log(files)

    for (let i = 0; i < files.length; i++) {
      this.fileList.push(this.sliceFile(files[i], chunkSize))
    }
    console.log(this.fileList)
    // const index = 0
    // localStorage.setItem(files[0].name, index)
    this.fetchUpload(0, 0)
    // e.target.value = ''
  }

  fetchUpload = (fileListIndex, fileIndex) => {
    const file = this.fileList[fileListIndex][fileIndex]
    let formData = new FormData()
    formData.append('file', file, file.name)
    formData.append('fileName', file.name); // 文件名
    formData.append('totalSize', file.size); // 文件总大小
    formData.append('lastModifiedlastModified', file.lastModified)

    fetch('/upload', { 
      method :"POST",
      body: formData,
    }).then(response => {
      if (response.ok) {
        return response.json()
      }

      localStorage.setItem(file.name, fileIndex)
      localStorage.setItem('fileListIndex', fileListIndex)
      console.log('暂停')
      return new Error()
    }).then(res => {
      if (res.code === 0) {
        if (fileIndex < this.fileList[fileListIndex].length - 1) {
          setTimeout(() => {
            this.fetchUpload(fileListIndex, fileIndex + 1)
          }, 10000)
        } else if (fileListIndex < this.fileList.length - 1) {
          localStorage.removeItem(file.name)
          setTimeout(() => {
            this.fetchUpload(fileListIndex + 1, 0)
          }, 10000)
        }
      }
    })
  }

  handleContinue = (e) => {
    e.preventDefault()
    // console.log(this.fileList)
    const fileListIndex = localStorage.getItem('fileListIndex')
    const fileIndex = localStorage.getItem(this.fileList[fileListIndex][0].name) || 0
    this.fetchUpload(parseInt(fileListIndex), parseInt(fileIndex))
  }

  render () {
    return (
      <div className="upload">
        <input webkitdirectory={this.props.directory ? "directory" : ''} ref="inputRef" onChange={this.handleChange} style={{ display: 'none' }} type="file" className="uploadInput"/>
        <a href="" className="uploadBtn" onClick={this.handleClick}>上传</a>
        <a href="" className="uploadBtn" onClick={this.handleContinue}>继续</a>
      </div>
    )
  }
}

export default Upload