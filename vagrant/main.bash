set -e

sudo apt-get -y install nodejs nginx supervisor mongodb npm
sudo ln /usr/bin/nodejs /usr/bin/node

NGINX_CONF_LOCATION='/etc/nginx/nginx.conf'
mkdir -p `dirname $NGINX_CONF_LOCATION`
cat > $NGINX_CONF_LOCATION <<EOF
# user www-data;
worker_processes     4;
events {
    worker_connections  1024;
}

http {
    gzip  on;
    sendfile on;
    tcp_nopush on;
    tcp_nodelay off;
    server_tokens off;
    include mime.types;
    keepalive_timeout 5;
    default_type  application/octet-stream;

    index index.html;
    fastcgi_intercept_errors on;

    server {
    	listen 80 default_server;
    	server_name _;

        location / {
            proxy_pass       http://localhost:8000;
        }
    }
}
EOF

sudo nginx -s reload


SERVER_CONF_LOCATION='/etc/supervisor/conf.d/pirates.conf'
mkdir -p `dirname $SERVER_CONF_LOCATION`
cat > $SERVER_CONF_LOCATION <<EOF
[program:pirates]
command=nodejs /srv/pirates/server/index.js

EOF
