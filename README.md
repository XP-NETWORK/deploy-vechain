# Deploying custom target contracts on VeChain

## 1. Initiating the project

```bash
git clone https://github.com/XP-NETWORK/deploy-vechain.git
cd deploy-vechain/
yarn
```

## 2. Populating the environment variable

```bash
mv .env.example .env
```
Provide the private key of your wallet:

```
SK=<replace-with-your-private-key>
```

## 3. Populate the constructor parameters

Open the `./scripts/deploy.ts` lines: 34-39 and replace them with your data.

## 4. Deploy the contracts

```
yarn deploy
```

## 5. View the results in the explorers of the chain

Mainnet: https://vechainstats.com/

Testnet: https://explore-testnet.vechain.org/