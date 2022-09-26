# LitProtocol Example app showing a failing response

When I try to decrypt the symmetric key that I received, using the exact
same conditions, I receive a 422 error complaining the JSON is
malformatted.


Clone the repo and start the server with:

```bash
npm i && npm run serve
```

Click the buttons in procession. Encrypt -> Save -> Decrypt.

The result should show this error:
```
422 Unprocessable Entity (/web/encryption/retrieve) - This usually means your JSON body is wrong. Please check that you have sent over every required JSON parameter and that the types are correct according to the docs here https://lit-protocol.github.io/lit-js-sdk/api_docs_html/index.html#litnodeclient
```
