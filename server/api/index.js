import Router from 'koa-router'
import uploadApi from './upload'

const api = new Router({
  prefix: '/api'
})

api.use('/upload', uploadApi.routes())

export default api