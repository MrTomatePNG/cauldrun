FROM caddy:builder AS builder

RUN xcaddy build \
    --with github.com/caddyserver/cache-handler \
    --with github.com/darkweak/storages/simplefs/caddy

FROM caddy:2.7-alpine
COPY --from=builder /usr/bin/caddy /usr/bin/caddy

# Criar diretórios de cache e logs com permissões corretas
RUN mkdir -p /var/cache/caddy/media /var/log/caddy && \
    chown -R caddy:caddy /var/cache/caddy /var/log/caddy

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
