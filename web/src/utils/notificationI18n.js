import { notification } from 'antd';

export default {
    success: (params) => notification.success(params),
    close: (params) => notification.close(params),
    error: (params) => notification.error(params),
    info: (params) => notification.info(params),
    warning: (params) => notification.warning(params),
    open: (params) => notification.open(params),
    warn: (params) => notification.warn(params),
    config: (options) => notification.config(options),
    destroy: () => notification.destroy(),
}