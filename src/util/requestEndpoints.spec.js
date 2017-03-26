const requestEndpoints = require('./requestEndpoints')
const { spy } = require('sinon')
const { expect } = require('chai')

describe('requestEndpoints', () => {
  describe('xWwwFormUrlencodedFetch', () => {
    context('successful response', () => {
      let fetch
      beforeEach(() => {
        fetch = spy((x) => {
          return Promise.resolve({ json: () => 'success' })
        })
      })

      it('calls fetch', async () => {
        await requestEndpoints(fetch)
          .xWwwFormUrlencodedFetch()
        expect(fetch.called).to.equal(true)
      })

      it('gets json from a response', async () => {
        const result = await requestEndpoints(fetch)
          .xWwwFormUrlencodedFetch()
        expect(result).to.equal('success')
      })
    })

    context('unsuccessful response', () => {
      let fetch
      beforeEach(() => {
        fetch = spy((x) => {
          return Promise.reject(new Error('err'))
        })
      })

      it('throws error', (done) => {
        requestEndpoints(fetch)
          .xWwwFormUrlencodedFetch()
          .then(() => done('should have errored'))
          .catch(() => done())
      })
    })

    context('gives the right params to fetch', async () => {
      it('calls the right header', async () => {
        let testHeaders
        const fetch = spy((_, { headers }) => {
          testHeaders = headers
          return Promise.resolve({json: () => 'success'})
        })
        await requestEndpoints(fetch).xWwwFormUrlencodedFetch()
        console.log(testHeaders)
      })
    })
  })
})
