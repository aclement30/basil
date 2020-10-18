import React from 'react'
import { Translation } from 'react-i18next'

import './index.scss'

import { OCRService } from '../../services/OCRService'
import { NotificationService } from '../../services/NotificationService'

export const SCAN_INGREDIENTS = 'ocr/SCAN_INGREDIENTS'
export const SCAN_INSTRUCTIONS = 'ocr/SCAN_INSTRUCTIONS'

interface Props {
  type: 'ocr/SCAN_INGREDIENTS' | 'ocr/SCAN_INSTRUCTIONS'
  onScan(result: string[]): void
}

interface State {
  processing: boolean
  thumbnail: any
  selectedPicture: File | null
}

export default class SnapUploader extends React.PureComponent<Props, State> {

  inputRef = React.createRef<HTMLInputElement>()

  state = {
    processing: false,
    thumbnail: null,
    selectedPicture: null
  }

  focusInput = () => {
    this.inputRef.current?.click()
  }

  onFileChange = async (event) => {
    const { type, onScan } = this.props
    const selectedPicture = event.target.files[0]

    this.setState({ processing: true, selectedPicture })

    const reader = new FileReader()
    reader.onload = this.onLoadPicture
    reader.readAsDataURL(selectedPicture)

    try {
      let result

      if (type === SCAN_INGREDIENTS) {
        result = await OCRService.scanIngredients(selectedPicture)
      } else {
        result = await OCRService.scanInstructions(selectedPicture)
      }

      onScan(result)
    } catch (error) {
      NotificationService.notify(error.message, 'warning')
    } finally {
      this.resetField()
    }
  }

  onLoadPicture = (event: Event) => {
    this.setState({ thumbnail: (event.target as any).result })
  }

  resetField() {
    this.setState({ selectedPicture: null, processing: false, thumbnail: null })

    // @ts-ignore
    this.inputRef.current.value = null
  }

  render() {
    const { type } = this.props
    const { selectedPicture, thumbnail, processing } = this.state

    return (
      <Translation>
        {
          (t) => (
            <div className={'SnapUploader' + (processing ? ' -processing' : '')}>
              <button type="button" onClick={this.focusInput}>
                {selectedPicture
                  ?
                  <div className="thumbnail" style={{ backgroundImage: `url(${thumbnail})` }}/>
                  :
                  <i className="zmdi icon zmdi-camera"/>
                }

                {type === SCAN_INGREDIENTS &&
                <p className="description">
                  <strong>{t('recipeForm.addIngredients')}</strong><br/><small>{t('recipeForm.byTakingPicture')}</small>
                </p>
                }

                {type === SCAN_INSTRUCTIONS &&
                <p className="description">
                  <strong>{t('recipeForm.addInstructions')}</strong><br/><small>{t('recipeForm.byTakingPicture')}</small>
                </p>
                }

                <p className="loading-message">{t('recipeForm.analyzingPicture')}</p>
              </button>

              <input ref={this.inputRef} type="file" onChange={this.onFileChange} accept="image/*" capture="camera"/>
            </div>
          )}
      </Translation>
    )
  }
}