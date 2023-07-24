import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { groups, profiles } from './mockDataForTest'

const api = import.meta.env.VITE_SOLAS_API

const server = setupServer(
    rest.get(`${api}/group/my-groups`, (req, res, ctx) => {
        return res(ctx.json({
            result: 'ok',
            groups: groups
        }))
        // return res(ctx.status(404))
    }),

    rest.get(`${api}/group/list`, (req, res, ctx) => {
        return res(ctx.json({
            result: 'ok',
            groups: groups
        }))
    }),

    rest.get(`${api}/group/members`, (req, res, ctx) => {
        return res(ctx.json({
            result: 'ok',
            members: profiles
        }))
    }),

    rest.get(`${api}/profile/followers`, (req, res, ctx) => {
        return res(ctx.json({
            result: 'ok',
            profiles: profiles
        }))
    }),

    rest.get(`${api}/profile/followings`, (req, res, ctx) => {
        return res(ctx.json({
            result: 'ok',
            profiles: profiles
        }))
    }),
)

export default server

