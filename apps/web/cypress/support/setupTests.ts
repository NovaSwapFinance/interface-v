// @ts-ignore
import TokenListJSON from '@uniswap/default-token-list'
import { CyHttpMessages } from 'cypress/types/net-stubbing'

beforeEach(() => {
  // Many API calls enforce that requests come from our app, so we must mock Origin and Referer.
  cy.intercept('*', (req) => {
    req.headers["referer"] = "https://novaswap.finance";
    req.headers["origin"] = "https://novaswap.finance";
  })

  // Network RPCs are disabled for cypress tests - calls should be routed through the connected wallet instead.
  cy.intercept(/infura.io/, { statusCode: 404 })
  cy.intercept(/quiknode.pro/, { statusCode: 404 })

  // Log requests to hardhat.
  cy.intercept(/:8545/, logJsonRpc)

  Cypress.env('amplitudeEventCache', [])

  // Mock analytics responses to avoid analytics in tests.
  cy.intercept('https://interface.gateway.uniswap.org/v1/amplitude-proxy', (req) => {
    const requestBody = JSON.stringify(req.body)
    const byteSize = new Blob([requestBody]).size
    req.alias = 'amplitude'
    req.reply(
      JSON.stringify({
        code: 200,
        server_upload_time: Date.now(),
        payload_size_bytes: byteSize,
        events_ingested: req.body.events.length,
      }),
      {
        'origin-country': 'US',
      }
    )

    Cypress.env('amplitudeEventCache').push(...req.body.events)
  }).intercept('https://*.sentry.io', { statusCode: 200 })

  // Mock statsig to allow us to mock flags.
  cy.intercept(/statsig/, { statusCode: 409 })

  // Mock our own token list responses to avoid the latency of IPFS.
  cy.intercept('https://gateway.ipfs.io/ipns/tokens.uniswap.org', TokenListJSON)
    .intercept('https://gateway.ipfs.io/ipns/extendedtokens.uniswap.org', { statusCode: 404 })
    .intercept('https://gateway.ipfs.io/ipns/unsupportedtokens.uniswap.org', { statusCode: 404 })

  // Reset hardhat between tests to ensure isolation.
  // This resets the fork, as well as options like automine.
  cy.hardhat().then((hardhat) => hardhat.reset())
})

function logJsonRpc(req: CyHttpMessages.IncomingHttpRequest) {
  req.alias = req.body.method
  const log = Cypress.log({
    autoEnd: false,
    name: req.body.method,
    message: req.body.params?.map((param: any) =>
      typeof param === 'object' ? '{...}' : param?.toString().substring(0, 10)
    ),
  })
  req.on('after:response', (res) => {
    if (res.statusCode === 200) {
      log.end()
    } else {
      log.error(new Error(`${res.statusCode}: ${res.statusMessage}`))
    }
  })
}
