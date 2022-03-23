import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { Button } from 'react-bootstrap';
import { useWalletModal } from '@pantherswap-libs/uikit'
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
    console.log("dddddddddddddddd", connectorId)
    if (connectorId === 'walletconnect') {
      return activate(walletconnect)
    }
    return activate(injected)
  }
  const handleDisconnect = () => {
    deactivate();
  }
  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account)
  
  return (
    <Button onClick={account? handleDisconnect : onPresentConnectModal}
      style={{
        background: "transparent",
        fontSize:'25px',
        color: '#4e0000',
        borderRadius: '16px',
        border: '4px solid rgb(254, 200, 99)',
        height: '60px',
        fontWeight: 'bold',
        whiteSpace: 'no-wrap'
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" style={{marginRight: '16px'}} width="33.999" height="33.999">
        <g data-name="Group 33">
        <path d="M31.68 27.818h-5.408a6.189 6.189 0 0 1-6.182-6.182 6.189 6.189 0 0 1 6.182-6.181h5.409a.772.772 0 0 0 .772-.773v-2.318a3.084 3.084 0 0 0-2.844-3.066L25.17 1.547A3.054 3.054 0 0 0 23.3.105a3.037 3.037 0 0 0-2.326.311L5.763 9.273H3.09A3.094 3.094 0 0 0 0 12.363V30.91a3.094 3.094 0 0 0 3.09 3.09h26.273a3.094 3.094 0 0 0 3.09-3.09V28.59a.772.772 0 0 0-.772-.772ZM8.835 9.273l12.92-7.521a1.494 1.494 0 0 1 .756-.206 1.515 1.515 0 0 1 1.32.769v.003L11.886 9.273h-3.05Zm17.295-2.94 1.684 2.94h-6.735l5.051-2.94Z" fill="#4e0000" fill-rule="evenodd" data-name="Path 24"/><path d="M31.68 17h-5.408a4.641 4.641 0 0 0-4.636 4.636 4.641 4.641 0 0 0 4.636 4.636h5.409a2.32 2.32 0 0 0 2.318-2.318v-4.636A2.32 2.32 0 0 0 31.68 17Zm-5.408 6.182a1.547 1.547 0 0 1-1.546-1.546c0-.852.694-1.545 1.546-1.545.852 0 1.545.693 1.545 1.545s-.693 1.546-1.545 1.546Z" 
          fill="#4e0000" 
          fillRule="evenodd" data-name="Path 25"/>
        </g>
      </svg>
     { account? 'Disconnect' : 'Connect Wallet'} 
    </Button>
  )
}

export default UnlockButton
