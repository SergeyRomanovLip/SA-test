import { useContext, useRef, useState } from 'react'
import { Button } from 'semantic-ui-react'
import { uploadNewQuestions } from '../backend/firebase'
import { AppContext } from '../context/AppContext'

export const ExcelUploadQuest = ({ loadingHandler }) => {
  const { authenticated } = useContext(AppContext)

  const file = useRef()
  const [dataFromExcel, setDataFromExcel] = useState([])
  const [courses, setCourses] = useState([])
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
          if (workbook.SheetNames.includes('questions')) {
            let XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets.questions)
            let courses = []
            XL_row_object.forEach((el) => {
              if (el.answer && el.description && el.question && el.type && el.rightAnswer) {
                if (!courses.includes(el.type)) {
                  courses.push(el.type)
                }
              } else {
                throw 'В файле отсутствуют/не заполнены необходимые столбцы, проверьте что присутствуют столбцы: question, answer, rightAnswer, description, type. Проверьте что все строки в столбцах заполнены (запрещены пустые значения)'
              }
            })
            setCourses(courses)
            setDataFromExcel(XL_row_object)
            clearFileInput()
          } else {
            throw 'В файле отсутствует лист questions (с маленькой буквы)'
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
      Загрузить новые / обновить базу вопросов?
      <input
        ref={file}
        type='file'
        id='fileInput'
        onClick={(e) => {
          e.stopPropagation()
        }}
        onChange={uploadHandler}
      />
      {dataFromExcel.length > 0 && (
        <>
          <p>В загруженном файле {dataFromExcel.length} вопросов в курсах:</p>
          <ul>
            {courses.map((el, i) => {
              return <li key={i + 5}>{el}</li>
            })}
          </ul>
        </>
      )}
      {dataFromExcel.length > 0 && (
        <Button
          onClick={() => {
            uploadNewQuestions(authenticated, dataFromExcel, loadingHandler)
          }}
        >
          Загрузить вопросы?
        </Button>
      )}
    </>
  )
}
