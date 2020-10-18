import * as swal from 'bootstrap-sweetalert'
import i18n from '../i18n'

export const Dialog = {
  confirm: function (title: string, text: string = ''): Promise<any> {
    return new Promise((resolve) => {
      swal({
        title: i18n.t(title),
        text: i18n.t(text),
        type: 'warning',
        showCancelButton: true,
        cancelButtonText: i18n.t('common.actions.cancel'),
        confirmButtonText: 'OK',
        confirmButtonClass: 'btn-warning',
      }, (choice: boolean) => {
        if (choice) {
          resolve(choice)
        }

        resolve(false)
      })
    })
  },

  show: function (title: string, text: string) {
    swal({
      customClass: 'announcement',
      title: title || '',
      text,
      showConfirmButton: false
    })
  },

  close: function () {
    swal.close()
  },
}