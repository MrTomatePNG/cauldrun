set -e
export PATH="/home/cauldrun/.bun/bin:$PATH"
export NVM_DIR="/home/cauldrun/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 22
cd /opt/cauldrun
echo "### 4/5: Buildando a aplicação... ###"
bun --bun svelte-kit sync
bun --bun run build
