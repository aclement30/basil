import i18n from '../i18n'
import { getAccessToken } from '../store/selectors/session'
import store from '../store'

function request(url: string, file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const formData: any = new FormData()
    const xhr = new XMLHttpRequest()

    formData.append('uploadedFile', file, file.name)

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.response))
        } else {
          if (xhr.status === 204) {
            reject(new Error(i18n.t('recipeForm.noTextFound')))
          } else {
            reject(new Error(i18n.t('recipeForm.parseError')))
          }
        }
      }
    }

    xhr.open('POST', url, true)

    // XMLHttpRequest does not use apiFetch, so we must set the auth token manually
    const accessToken = getAccessToken(store.getState())
    if (accessToken) {
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)
    }

    xhr.send(formData)
  })
}

export const OCRService = {
  scanIngredients: function (file: File): Promise<string[]> {
    return request(`${process.env.REACT_APP_API_ENDPOINT}/ocr/ingredients`, file)
  },

  scanInstructions: function (file: File): Promise<string[]> {
    return request(`${process.env.REACT_APP_API_ENDPOINT}/ocr/instructions`, file)
  },
}