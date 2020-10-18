import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GroceryService } from '../../services/GroceryService'
import { GroceryItem } from '../../typings/GroceryItem'
import { NotificationService } from '../../services/NotificationService'

import './AddItem.scss'

interface Props {
  onItemAdded(item: GroceryItem): void
  toggleEditMode(): void
}

const AddItem = React.memo<Props>(({ onItemAdded, toggleEditMode }) => {
  const { t } = useTranslation()
  const [newItemText, setNewItemText] = useState<string>('')

  const createItem = useCallback(async () => {
    const item = GroceryService.parse(newItemText)

    try {
      const [newItem] = await GroceryService.add([item])
      onItemAdded(newItem)

      setNewItemText('')
    } catch (error) {
      NotificationService.notify(error.message)
    }
  }, [newItemText, setNewItemText, onItemAdded])

  const onKeyUp = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      createItem()
      event.preventDefault()
    }
  }, [createItem])

  const exitEditMode = useCallback(() => {
    if (newItemText && newItemText !== '') {
      createItem()
    }

    toggleEditMode()
  }, [newItemText, createItem, toggleEditMode])

  return (
    <div className="AddItem">
      <input
        type="search"
        value={newItemText}
        onChange={(event) => setNewItemText(event.target.value)}
        onKeyUp={onKeyUp}
        placeholder={t('groceries.addItem')}
        className="form-control"
      />
      <button type="button" className="btn btn-default" onClick={exitEditMode}>OK</button>
    </div>
  )
})

export default AddItem