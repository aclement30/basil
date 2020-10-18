import React from 'react'
import { Translation } from 'react-i18next'

import './index.scss'

import { NotificationService } from '../../services/NotificationService'
import { GroceryItem } from '../../typings/GroceryItem'
import { ingredientUnit } from '../../utils/ingredientUnit'
import { GroceryService } from '../../services/GroceryService'
import AddItem from './AddItem'
import LoadingCard from '../LoadingCard'
import BlankSlate from '../BlankSlate'

interface State {
  items: GroceryItem[]
  editModeEnabled: boolean
  itemsLoaded: boolean
}

class ShoppingList extends React.PureComponent<{}, State> {

  state = {
    items: [] as GroceryItem[],
    editModeEnabled: false,
    itemsLoaded: false,
  }

  async componentDidMount() {
    this.fetchItems()
  }

  private async fetchItems() {
    try {
      const items = await GroceryService.query()

      this.setState({
        items,
        itemsLoaded: true,
      })
    } catch (error) {
      NotificationService.notify(error.message)
    }
  }

  toggleEditMode = () => {
    this.setState({ editModeEnabled: !this.state.editModeEnabled })
  }

  onItemAdded = () => {
    this.fetchItems()
  }

  toggleItem = async (item: GroceryItem) => {
    const { items } = this.state

    const updatedItem: GroceryItem = {
      ...item,
      isCrossed: !item.isCrossed,
    }

    const updatedItems = [...items]
    const index = updatedItems.findIndex(i => i._id === item._id)

    // Replace updated item
    updatedItems.splice(index, 1, updatedItem)

    this.setState({ items: updatedItems })

    try {
      await GroceryService.toggleItem(item)
    } catch (error) {
      this.setState({ items })

      NotificationService.notify(error.message)
    }
  }

  clearCrossedItems = async () => {
    try {
      await GroceryService.clearCrossedItems()
      await this.fetchItems()
    } catch (error) {
      NotificationService.notify(error.message)
    }
  }

  remove = async (item: GroceryItem) => {
    const { items } = this.state

    const updatedItems = [...items]
    const index = updatedItems.findIndex(i => i._id === item._id)

    // Remove deleted item
    updatedItems.splice(index, 1)

    this.setState({ items: updatedItems })

    try {
      await GroceryService.remove(item._id!)
    } catch (error) {
      NotificationService.notify(error.message)

      this.setState({ items })
    }
  }

  render() {
    const { items, editModeEnabled, itemsLoaded } = this.state

    return (
      <Translation>
        {(t) => (
          <div className="ShoppingList">
            <div className={'c-header' + (editModeEnabled ? ' editing' : '')}>
              <h2>{t('groceries.title')}</h2>

              {editModeEnabled ?
                (
                  <AddItem toggleEditMode={this.toggleEditMode} onItemAdded={this.onItemAdded} />
                ) :
                (
                  <ul className="actions">
                    <li>
                      <a onClick={this.toggleEditMode} className="btn btn-icon-text btn-link">
                        <i className="zmdi zmdi-plus"/> {t('common.actions.add')}
                      </a>
                    </li>
                  </ul>
                )
              }
            </div>

            {items.length
              ?
                (
                  <>
                    <div className="card">
                      <div className="card-body table-responsive">
                        <table className="table items-list">
                          <tbody>
                          {items.map((item: GroceryItem) => (
                            <tr key={item._id} className={item.isCrossed ? 'crossed' : ''}>
                              <td className="quantity" onClick={() => this.toggleItem(item)}>
                                {item.quantity} {!!item.quantity && !!item.unit && (<span>{ingredientUnit(item.unit)}</span>)}
                              </td>
                              <td className="name" onClick={() => this.toggleItem(item)}>{item.name}</td>
                              <td className="actions">
                                <button className="btn btn-icon btn-default" onClick={() => this.remove(item)}>
                                  <i className="zmdi zmdi-close" />
                                </button>
                              </td>
                            </tr>
                          ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="text-center clear-button-container">
                      <button type="button" className="btn btn-warning btn-icon-text waves-effect" onClick={this.clearCrossedItems}>
                        <i className="zmdi zmdi-delete" /> {t('groceries.clearCrossedItems')}
                      </button>
                    </div>
                  </>
                )
              :
                (
                  !itemsLoaded
                    ? (<LoadingCard text={t('groceries.loading')} />)
                    : (<BlankSlate icon={'zmdi-assignment-check'} text={t('groceries.empty')} />)
                )
            }
          </div>
        )}
      </Translation>
    )
  }
}

export default ShoppingList