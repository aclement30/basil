import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Form } from 'react-bootstrap'

import './FormTab.scss'

import SnapUploader from '../SnapUploader'
import { DraftRecipe } from '../../typings/Recipe'
import { Tag } from '../../typings/Tag'

interface Props {
  recipe: DraftRecipe
  onChange(recipe: DraftRecipe): void
  formValidated: boolean
  tags: Tag[]
}

export default React.forwardRef<any, Props>(({ recipe, onChange, formValidated, tags }, ref) => {
  const { t } = useTranslation()

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target

    const updatedRecipe: DraftRecipe = {
      ...recipe,
      [name]: value
    }

    onChange(updatedRecipe)
  }, [recipe, onChange])

  const getSnapshotIngredients = useCallback((ingredients: string[]) => {
    const updatedRecipe: DraftRecipe = {
      ...recipe,
      combinedIngredients: recipe.combinedIngredients += ingredients.join('\n')
    }

    onChange(updatedRecipe)
  }, [recipe, onChange])

  const getSnapshotInstructions = useCallback((instructions: string[]) => {
    const updatedRecipe: DraftRecipe = {
      ...recipe,
      combinedInstructions: recipe.combinedInstructions  += '\n' + instructions.join('\n')
    }

    onChange(updatedRecipe)
  }, [recipe, onChange])

  const { title, combinedIngredients, combinedInstructions, recipeYield, image, originalUrl, notes } = recipe

  return (
    <div className="FormTab">
      <Form validated={formValidated} ref={ref}>
        <Form.Group>
          <Form.Label>{t('recipeForm.titleField')} *</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder={t('recipeForm.titleField')}
            name="title"
            value={title}
            onChange={handleInputChange}
          />
          <Form.Control.Feedback type="invalid">{t('recipeForm.requiredField')}</Form.Control.Feedback>
        </Form.Group>

        <Form.Row>
          <Form.Group as={Col} md="4">
            <Form.Label>{t('common.ingredients')} *</Form.Label>
            <Form.Control
              required
              as="textarea"
              placeholder={t('common.ingredients')}
              name="combinedIngredients"
              value={combinedIngredients}
              onChange={handleInputChange}
              rows={10}
            />
            <Form.Control.Feedback type="invalid">{t('recipeForm.requiredField')}</Form.Control.Feedback>

            <SnapUploader type="ocr/SCAN_INGREDIENTS" onScan={getSnapshotIngredients} />
        </Form.Group>

          <Form.Group as={Col} md="8">
            <Form.Label>{t('recipeForm.preparationSteps')} *</Form.Label>
            <Form.Control
              required
              as="textarea"
              placeholder={t('recipeForm.preparationSteps')}
              name="combinedInstructions"
              value={combinedInstructions}
              onChange={handleInputChange}
              rows={10}
            />
            <Form.Control.Feedback type="invalid">{t('recipeForm.requiredField')}</Form.Control.Feedback>

            <SnapUploader type="ocr/SCAN_INSTRUCTIONS" onScan={getSnapshotInstructions} />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} md="4">
            <Form.Label>{t('common.portions')} *</Form.Label>
            <Form.Control
              required
              type="number"
              placeholder={t('recipeForm.yield')}
              min={1}
              name="recipeYield"
              value={recipeYield}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">{t('recipeForm.requiredField')}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} md="8">
            <Form.Label>{t('common.category')}</Form.Label>
            <Form.Control
              as="select"
              placeholder={t('recipeForm.categoriesPlaceholder')}
              name="tags"
              onChange={handleInputChange}
            >
              {tags.map(tag => (
                <option key={tag._id} value={tag._id}>{tag.name}</option>
              ))}
            </Form.Control>
            <Form.Control.Feedback>{t('recipeForm.requiredField')}</Form.Control.Feedback>
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} md="6">
            <Form.Label>{t('recipeForm.photo')}</Form.Label>
            <Form.Control
              type="url"
              placeholder={t('recipeForm.photoUrl')}
              name="image"
              value={image}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">{t('recipeForm.invalidUrl')}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} md="6">
            <Form.Label>{t('common.source')}</Form.Label>
            <Form.Control
              type="url"
              placeholder={t('recipeForm.sourceUrl')}
              name="originalUrl"
              value={originalUrl}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">{t('recipeForm.invalidUrl')}</Form.Control.Feedback>
          </Form.Group>
        </Form.Row>

        <Form.Group>
          <Form.Label>{t('recipeForm.notes')}</Form.Label>
          <Form.Control
            type="text"
            placeholder={t('recipeForm.notes')}
            name="notes"
            value={notes}
            onChange={handleInputChange}
          />
        </Form.Group>
      </Form>
    </div>
  )
})