import 'bootstrap-notify'
import * as $ from 'jquery'
import i18n from '../i18n'

export const NotificationService = {
  notify: function (message: string, type?: string, options?: any) {
    if (!type) {
      type = 'inverse'
    }

    const notificationOptions = Object.assign({}, {
      type,
      placement: {
        from: 'bottom',
        align: 'left',
      },
      animate: {
        enter: 'fadeInUp',
      },
    }, options)

    return $.notify({
      message: i18n.t(message),
      icon: options && options.icon ? options.icon : null,
    }, notificationOptions)
  },
}