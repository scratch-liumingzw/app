import { message } from 'antd';

export default {
    info: (content, duration, onClose) => message.info(content, duration, onClose),
    success: (content, duration, onClose) => message.success(content, duration, onClose),
    error: (content, duration, onClose) => message.error(content, duration, onClose),
    warn: (content, duration, onClose) => message.warn(content, duration, onClose),
    warning: (content, duration, onClose) => message.warning(content, duration, onClose),
    loading: (content, duration, onClose) => message.loading(content, duration, onClose),
    open: (args) => message.open(args),
    config: (options) => message.config(options),
    destroy: () => message.destroy()
}
