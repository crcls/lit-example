import { useCallback, useState } from 'react'
import { createRoot } from 'react-dom/client'
import LitJsSdk from '@lit-protocol/sdk-browser'

const chain = 'mumbai'
const evmContractConditions = [
  {
    contractAddress: "0x093d00c17dA59Ec0Bf265Aad61424360aE055f30",
    functionName: "ownerOfBlock",
    functionParams: [
      "0xdcc5e7df34d6f1fafe3d8510e852d280b2f700d59d62fd17fd9c32d9ef71f9bc",
      ":userAddress"
    ],
    functionAbi: {
      name: "ownerOfBlock",
      inputs: [
        {
          name: "cid",
          type: "bytes32"
        },
        {
          name: "owner",
          type: "address"
        }
      ],
      outputs: [
        {
          name: "",
          type: "bool"
        }
      ],
      constant: false,
      stateMutability: "view",
      type: "function"
    },
    chain,
    returnValueTest: {
      comparator: "=",
      value: "true"
    }
  }
]

const client = new LitJsSdk.LitNodeClient()

const App = () => {
  const [key, setKey] = useState()
  const [payload, setPayload] = useState(JSON.stringify({
    test: "test"
  }))
  const [error, setError] = useState()
  const [encryptedKey, setEncryptedKey] = useState()

  const encrypt = useCallback(async () => {
    const data = LitJsSdk.uint8arrayFromString(payload)
    const { encryptedFile, symmetricKey } = await LitJsSdk.encryptFile({ file: new Blob([data]) })
    const buffer = await new Response(encryptedFile).arrayBuffer()
    const fileUint = new Uint8Array(buffer)

    setKey(LitJsSdk.uint8arrayToString(symmetricKey, 'hex'))
    setPayload(LitJsSdk.uint8arrayToString(fileUint, 'hex'))
  }, [payload, key])

  const save = useCallback(async () => {
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
    await client.connect()

    try {
      const encryptedSymmetricKey = await client.saveEncryptionKey({
        authSig,
        chain,
        evmContractConditions,
        symmetricKey: LitJsSdk.uint8arrayFromString(key, 'hex'),
      })
      setEncryptedKey(LitJsSdk.uint8arrayToString(encryptedSymmetricKey, 'hex'))
    } catch(err) {
      setError(err.message)
    }
  }, [key])

  const decrypt = useCallback(async () => {
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
    await client.connect()

    try {
      const decryptedKey = await client.getEncryptionKey({
        authSig,
        chain,
        evmContractConditions,
        toDecrypt: encryptedKey,
      })
      setEncryptedKey(LitJsSdk.uint8arrayToString(decryptedKey, 'utf8'))
    } catch(e) {
      setError(e.message)
    }
  }, [encryptedKey])

  return (
    <div>
      <h2>Lit Protocol Encrypt/Decrypt Example</h2>
      <p>Click the buttons in procession. Encrypt {'->'} Save {'->'} Decrypt.</p>
      <p>Expected: Error regarding a failed conditions of some sort. Or a success if you own the account that passes the condition</p>
      <p>Result: 422 Error complaining about JSON being malformatted</p>
      <div>
        <button onClick={encrypt}>Encrypt</button>
      </div>
      <div>
        <button onClick={save}>Save</button>
      </div>
      <div>
        <button onClick={decrypt}>Decrypt</button>
      </div>
      <div>
        <h3>Results:</h3>
        <p>Key: {key}</p>
        <p>Encrypted Key: {encryptedKey}</p>
        <p>Payload: {payload}</p>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

const main = document.querySelector('main#app')
const root = createRoot(main)
root.render(<App />)
