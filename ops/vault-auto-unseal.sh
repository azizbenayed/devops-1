#!/bin/sh
# Auto-unseal vault-0 on boot. Waits for k3s + the pod to come up, then
# unseals using the key stored in ~/.vault-credentials. Never echoes the key.
set -eu

export KUBECONFIG=/home/dev/.kube/config
CRED_FILE=/home/dev/.vault-credentials

# Wait for the pod to exist and be reachable (up to 5 min).
i=0
while [ "$i" -lt 60 ]; do
    if kubectl get pod vault-0 -n vault >/dev/null 2>&1; then
        break
    fi
    i=$((i + 1))
    sleep 5
done

UNSEAL_KEY=$(grep '^VAULT_UNSEAL_KEY=' "$CRED_FILE" | cut -d= -f2-)
if [ -z "$UNSEAL_KEY" ]; then
    echo "vault-auto-unseal: no VAULT_UNSEAL_KEY found in $CRED_FILE" >&2
    exit 1
fi

# Retry unseal for up to ~2.5 min (container may still be starting Vault itself).
i=0
while [ "$i" -lt 30 ]; do
    if kubectl exec -n vault vault-0 -- vault status 2>/dev/null | grep -q '^Sealed *false'; then
        echo "vault-auto-unseal: already unsealed."
        exit 0
    fi
    if kubectl exec -n vault vault-0 -- vault operator unseal "$UNSEAL_KEY" >/dev/null 2>&1; then
        echo "vault-auto-unseal: unseal succeeded."
        exit 0
    fi
    i=$((i + 1))
    sleep 5
done

echo "vault-auto-unseal: failed to unseal after retries." >&2
exit 1
