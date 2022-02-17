import { useContext, useRef, useState } from 'react'
import { Button } from 'semantic-ui-react'
import { uploadEmployeesMatrix, uploadNewEmployees, uploadNewQuestions } from '../backend/firebase'
import { AppContext } from '../context/AppContext'

export const ExcelUploadMatrix = ({ loadingHandler }) => {
  const { authenticated } = useContext(AppContext)
  const file = useRef()
  const [dataFromExcel, setDataFromExcel] = useState([])
  const clearFileInput = () => {
    file.current.value = null
  }

  const uploadHandler = async () => {
    loadingHandler(true)
    let files = file.current.files[0]
    let fileExtension = files.name.substring(files.name.lastIndexOf('.'))
    if (fileExtension === '.xls' || fileExtension === '.xlsx') {
      let reader = new FileReader()
      reader.onload = (e) => {
        let XLSX = require('xlsx')
        let data = e.target.result
        let workbook = XLSX.read(data, { type: 'array' })
        try {
          if (workbook.SheetNames.includes('root')) {
            let XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets.root)
            XL_row_object.forEach((el) => {
              if (el.department && el.position && el.instrNum && el.instrName) {
              } else {
                throw 'В файле отсутствуют/не заполнены необходимые столбцы'
              }
            })
            console.log(XL_row_object)
            setDataFromExcel(XL_row_object)
            clearFileInput()
          } else {
            throw 'В файле отсутствует лист root (с маленькой буквы)'
          }
        } catch (e) {
          clearFileInput()
          setDataFromExcel([])
          alert(e)
        }
      }
      reader.onloadstart = loadingHandler(true)
      reader.readAsArrayBuffer(files)
      loadingHandler(false)
    } else {
      loadingHandler(false)
      clearFileInput()
      return alert('Необходимо загружать xls или xlsx формат')
    }
  }
  return (
    <>
      Загрузить матрицу инструкций?
      <input
        ref={file}
        type='file'
        id='fileInput'
        onClick={(e) => {
          e.stopPropagation()
        }}
        onChange={uploadHandler}
      />
      {dataFromExcel.length > 0 && <p>В загруженном файле {dataFromExcel.length} работников в курсах:</p>}
      {dataFromExcel.length > 0 && (
        <Button
          onClick={() => {
            uploadEmployeesMatrix(authenticated, dataFromExcel, loadingHandler)
          }}
        >
          Загрузить матрицу инструкций?
        </Button>
      )}
    </>
  )
}
