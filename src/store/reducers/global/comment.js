import api from '~api'
import { createReducer } from 'redux-immutablejs'
import { fromJS } from 'immutable'
import { errConfig } from '../global'

const initStates = fromJS({
    lists: {
        data: [],
        hasNext: 0,
        page: 1,
        pathname: ''
    }
})

const reducers = {
    ['recevieCommentList']: (state, action) => {
        const {list, pathname, hasNext, hasPrev, page} = action
        let data
        if (page === 1) {
            data = [].concat(list)
        } else {
            data = state.toJS().lists.data.concat(list)
        }
        return state.merge({
            lists: {
                data, hasNext, hasPrev, page: page + 1, pathname
            }
        })
    },
    ['insertCommentItem']: (state, {item}) => {
        const { lists } = state.toJS()
        const data = [item].concat(lists.data)
        return state.mergeDeep({
            lists: {
                data
            }
        })
    },
    ['deleteComment']: (state, {id}) => {
        const {lists} = state.toJS()
        const obj = lists.data.find(ii => ii._id === id)
        if (obj) obj.is_delete = 1
        return state.mergeDeep({
            lists
        })
    },
    ['recoverComment']: (state, {id}) => {
        const {lists} = state.toJS()
        const obj = lists.data.find(ii => ii._id === id)
        if (obj) obj.is_delete = 0
        return state.mergeDeep({
            lists
        })
    }
}

export const getCommentList = config => {
    return async dispatch => {
        const { data: { data, code} } = await api.get('frontend/comment/list', config)
        if (code === 200) {
            return dispatch({
                type: 'recevieCommentList',
                ...data,
                ...config
            })
        }
        return dispatch(errConfig)
    }
}

export default createReducer(initStates, reducers)
