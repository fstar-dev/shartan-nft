import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Button, useWalletModal } from '@pantherswap-libs/uikit'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { CONTRACT_ADDRESS, NETWORK_CHAIN_NAME, INFURA_PROJECT_ID } from '../Constants';

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: `https://${NETWORK_CHAIN_NAME}.infura.io/v3/${INFURA_PROJECT_ID}` },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 15000,
})

export const injected = new InjectedConnector({
  supportedChainIds: [1, 56, 97],
})


const UnlockButton = props => {
  const { account, activate, deactivate } = useWeb3React()

  const handleLogin = (connectorId) => {
    console.log("dddddddddddddddd")
    if (connectorId === 'walletconnect') {
      return activate(walletconnect)
    }
    return activate(injected)
  }

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account)
  const ddd = () =>{
    console.log('error')
  }
  return (
    <Button onClick={onPresentConnectModal} >
      Connect Wallet
    </Button>
  )
}

export default UnlockButton
