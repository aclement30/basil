import React, { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Form, Alert } from 'react-bootstrap'

import './WebImportTab.scss'

import { DraftRecipe } from '../../typings/Recipe'
import { RecipeService } from '../../services/RecipeService'

interface Props {
  onImport(recipe: DraftRecipe): void
}

export default React.memo<Props>(({ onImport }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isImporting, setIsImporting] = useState<boolean>(false)
  const [validated, setValidated] = useState<boolean>(false)
  const inputRef = useRef(null)
  const { t } = useTranslation()

  const [url, setUrl] = useState<string>('')

  const importRecipe = useCallback(async (event) => {
    const { form } = event.currentTarget

    event.preventDefault()
    event.stopPropagation()

    if (!form.checkValidity()) {
      setValidated(true)

      return
    }

    setIsImporting(true)
    setErrorMessage(null)

    try {
      const importedRecipe = await RecipeService.import(url)

      onImport(importedRecipe)
    } catch (error) {
      setErrorMessage(error.message)
      setTimeout(() => setErrorMessage(null), 2000)
    }

    setIsImporting(false)
  }, [url, setIsImporting, setErrorMessage, onImport])

  return (
    <div className="WebImportTab">
      <Alert variant="danger" show={!!errorMessage}>{errorMessage}</Alert>

      <Form validated={validated}>
        <Form.Group>
          <Form.Row>
            <div className="input-wrapper">
              <Form.Control
                ref={inputRef}
                required
                type="url"
                placeholder="https://"
                name="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <div className="help-feedback">{t('recipeForm.enterWebpageUrl')}</div>
              <Form.Control.Feedback type="invalid">{t('recipeForm.invalidUrl')}</Form.Control.Feedback>
            </div>

            <Button type="submit" onClick={importRecipe} disabled={isImporting}>{t('common.actions.import')}</Button>
          </Form.Row>
        </Form.Group>
      </Form>
    </div>
  )
})