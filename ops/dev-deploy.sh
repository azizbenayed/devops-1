#!/usr/bin/env bash
# Fast local deploy for testing code changes on nodeapp.local WITHOUT the
# Jenkins pipeline: build one service's image locally, load it straight into
# k3s' containerd (no Docker Hub push), and point the deployment at it.
#
# Usage: ops/dev-deploy.sh <service> [<service> ...]
#   e.g. ops/dev-deploy.sh client
#        ops/dev-deploy.sh auth orders
#
# To go back to the pipeline image: ops/dev-deploy.sh --reset <service>
# (or just run the pipeline / let ArgoCD sync again).
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DOCKERHUB_USERNAME="mohamedaziz599"
SERVICES="auth client expiration orders payments tickets"

if [ "${1:-}" = "--reset" ]; then
  shift
  for svc in "$@"; do
    kubectl rollout undo deployment/"$svc"
  done
  exit 0
fi

[ $# -gt 0 ] || { echo "Usage: $0 <service>...  (one of: $SERVICES)"; exit 1; }

# Ask for the sudo password once, up front (k3s ctr needs root).
sudo -v

for svc in "$@"; do
  case " $SERVICES " in *" $svc "*) ;; *) echo "Unknown service: $svc"; exit 1 ;; esac

  # Unique tag per run so Kubernetes always rolls out the new pods.
  TAG="dev-$(date +%Y%m%d-%H%M%S)"
  IMAGE="docker.io/${DOCKERHUB_USERNAME}/${svc}:${TAG}"

  echo "==> Building $IMAGE (with Docker cache, much faster than the pipeline)"
  docker build -t "$IMAGE" "$REPO_ROOT/$svc"

  echo "==> Importing image into k3s containerd"
  docker save "$IMAGE" | sudo k3s ctr images import -

  echo "==> Updating deployment/$svc"
  # IfNotPresent: the image only exists locally, it must not be pulled from Docker Hub.
  # Single patch = single rollout revision, so --reset (rollout undo) restores the previous image.
  kubectl patch deployment "$svc" --type=json -p="[
    {\"op\":\"replace\",\"path\":\"/spec/template/spec/containers/0/image\",\"value\":\"$IMAGE\"},
    {\"op\":\"replace\",\"path\":\"/spec/template/spec/containers/0/imagePullPolicy\",\"value\":\"IfNotPresent\"}
  ]"
  kubectl rollout status deployment/"$svc" --timeout=180s
done

echo "Done. Open https://nodeapp.local to see your changes."
