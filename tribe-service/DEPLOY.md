# TRIBE v2 Azure Deployment

## Prerequisites
- Azure CLI installed: `az --version`
- Docker installed and running
- Azure subscription with credits available

## Step 1: Login and create resource group

```bash
az login
az group create --name clickspark-rg --location eastus
```

## Step 2: Create Azure ML workspace

```bash
az ml workspace create \
  --name clickspark-ml \
  --resource-group clickspark-rg \
  --location eastus
```

Takes ~2 minutes.

## Step 3: Create Container Registry and push image

```bash
az acr create --resource-group clickspark-rg --name clicksparkcr --sku Basic
az acr login --name clicksparkcr

cd tribe-service
docker build -t clicksparkcr.azurecr.io/tribe-service:v1 .
docker push clicksparkcr.azurecr.io/tribe-service:v1
cd ..
```

Note: Docker build takes 10-20 minutes (large PyTorch base image + tribev2 install).

## Step 4: Deploy endpoint

```bash
az ml online-endpoint create \
  --file tribe-service/endpoint.yml \
  --resource-group clickspark-rg \
  --workspace-name clickspark-ml

az ml online-deployment create \
  --file tribe-service/deployment.yml \
  --resource-group clickspark-rg \
  --workspace-name clickspark-ml \
  --all-traffic
```

Deployment takes ~10 minutes. Check status:

```bash
az ml online-deployment show \
  --name tribe-v1 \
  --endpoint-name tribe-scoring-endpoint \
  --resource-group clickspark-rg \
  --workspace-name clickspark-ml \
  --query provisioning_state
```

## Step 5: Get endpoint URL and key

```bash
TRIBE_URL=$(az ml online-endpoint show \
  --name tribe-scoring-endpoint \
  --resource-group clickspark-rg \
  --workspace-name clickspark-ml \
  --query scoring_uri -o tsv)

TRIBE_KEY=$(az ml online-endpoint get-credentials \
  --name tribe-scoring-endpoint \
  --resource-group clickspark-rg \
  --workspace-name clickspark-ml \
  --query primaryKey -o tsv)

echo "TRIBE_ENDPOINT_URL=$TRIBE_URL"
echo "TRIBE_ENDPOINT_KEY=$TRIBE_KEY"
```

Copy both values into `.env.local` and into Vercel environment variables.

## Step 6: Smoke test

```bash
curl -X POST "$TRIBE_URL/score" \
  -H "Authorization: Bearer $TRIBE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"test hook","image_description":"test image","video_script":"test script"}'
```

Expected: `{"text_score":XX,"visual_score":XX,"combined_score":XX}`

## Step 7: Pre-compute Liquid Death scores (do this before the demo)

```bash
curl -X POST "$TRIBE_URL/score" \
  -H "Authorization: Bearer $TRIBE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"Death by hydration","image_description":"skull on water can dark background","video_script":"Open on skull. Zoom out. Its a water can. Text: Death by hydration."}'

curl -X POST "$TRIBE_URL/score" \
  -H "Authorization: Bearer $TRIBE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"Water that doesnt suck","image_description":"rebellious teenager choosing liquid death over generic water bottle","video_script":"Side by side. Generic water vs Liquid Death. One choice is obvious."}'

curl -X POST "$TRIBE_URL/score" \
  -H "Authorization: Bearer $TRIBE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"Youre not drinking water. Youre refusing to be boring.","image_description":"person at party confidently holding liquid death surrounded by people with generic drinks","video_script":"Open on crowded party. Everyone blending in. One person stands out. Liquid Death in hand. Text: Refuse to be boring."}'
```

Record the `combined_score` from each response and update `lib/demo-cache.ts` with the real scores.
